import { __ } from '@wordpress/i18n';
import { Feature, Map as OlMap } from 'ol';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Style, Text } from 'ol/style';
import Popup from 'ol-ext/overlay/Popup';
import { Point } from 'ol/geom';
import Mustache from 'mustache';
import { Select } from 'ol/interaction';

import remixMap from 'common/remix-unicode.json';
import { getFullCollection, getItem, wpFetch } from './wp-fetch';
import Layer from './layer';

/**
 * @typedef View
 * @property {string}                 zoom   Map zoom level.
 * @property {{x: number, y:number }} center Map center coordinates.
 * @property {number}                 layer  Id of the layer to display
 */

export default class Map {
	/** @type {HTMLDivElement} Map container. */ el;
	/** @type {import('./layer').BlockAttr} Dataset from the map element. */ blockAttr;
	/** @type {string} WordPress Map ID. */ mapId;
	/** @type {View} Layer and extent on first render. */ initialView;
	/** @type {string} Show stand-alone markers, as well as linked posts. */ showStandalone;
	/** @type {string} IDs of posts to show on the map. */ postIds;
	/** @type {HTMLTemplateElement} Template for the popup content. */ template;
	/** @type {OlMap} Open Layers map to add the layer to. */ olMap;
	/** @type {VectorLayer} Layer to display the features */ ftLayer;
	/** @type {Array<Object<string, any>>} WordPress layers. */ wpLayers;
	/** @type {Array<Object<string, any>>} WordPress map. */ wpMap;
	/** @type {Popup} Marker popup. */ popup;
	/** @type {Select} Marker selection handler */ selector;
	/** @type {{slug: string, rest_base: string }} Post types that can be linked to markers */ postTypes;

	/** @param {HTMLDivElement} el Map container. */
	constructor(el) {
		this.el = el;
		this.mapId = el.dataset.mapId;
		this.showStandalone = el.dataset.showStandalone;
		this.postIds = el.dataset.postIds ? el.dataset.postIds.split(',') : [];

		// Set initial view based on the viewport width.
		const views = JSON.parse(el.dataset.initialViews);
		if (window.innerWidth < 600 && views.Mobile.layer) {
			this.initialView = views.Mobile;
		} else if (window.innerWidth < 1080 && views.Tablet.layer) {
			this.initialView = views.Tablet;
		} else {
			this.initialView = views.Desktop;
		}

		this.template = el.querySelector('template');

		this.olMap = new OlMap({ target: el });

		this.ftLayer = new VectorLayer({
			source: new VectorSource(),
			style: this.styleIcon,
			zIndex: 10,
		});

		this.selector = new Select({
			style: null,
			layers: [this.ftLayer],
			hitTolerance: 6,
		});

		this.popup = new Popup({
			popupClass: 'flare-marker-popup',
			closeBox: true,
			positioning: 'auto',
			onclose: () => this.selector.getFeatures().clear(),
			autoPan: { animation: { duration: 500 } },
		});

		// Map post type slugs to their REST API endpoints.
		wpFetch('/wp/v2/types')
			.then((types) => {
				this.postTypes = Object.values(types.body).reduce(
					(postTypes, type) => {
						postTypes[type.slug] = type.rest_base;
						return postTypes;
					},
					{}
				);
			})
			.catch(() => {
				this.setError(
					__('Unable to load marker types.', 'flare-imc') +
						' ' +
						__(
							'Please refresh this page to try again.',
							'flare-imc'
						)
				);
			});
	}

	/**
	 * Provide icon style for the given feature.
	 *
	 * @param {Feature} feature The feature to style.
	 */
	styleIcon(feature) {
		// Icon settings are passed to the feature below.
		const icon = feature.get('icon');
		if (!icon) return;
		return new Style({
			text: new Text({
				// Display marker icons using remix icon font characters.
				font: (icon.size ?? 24) + 'px remixicon',
				text:
					icon.img?.ref &&
					String.fromCharCode(parseInt(remixMap[icon.img.ref], 16)),
				fill: icon.colour && new Fill({ color: icon.colour }),
				offsetX:
					icon.img?.iconAnchor?.x &&
					icon.size &&
					(0.5 - icon.img.iconAnchor.x) * icon.size,
				offsetY:
					icon.img?.iconAnchor?.y &&
					icon.size &&
					(0.5 - icon.img.iconAnchor.y) * icon.size,
			}),
		});
	}

	/** Add instance's feature layer to the map. */
	addFeatureLayer() {
		if (this.ftLayer) {
			this.olMap.removeLayer(this.ftLayer);
			this.olMap.addLayer(this.ftLayer);
		} else {
			this.setError(
				__('Unable to load marker layer.', 'flare-imc') +
					' ' +
					__('Please refresh this page to try again.', 'flare-imc')
			);
		}
	}

	/** Add marker popup feature to the map (hidden). */
	addPopup() {
		if (this.popup) {
			this.olMap.removeOverlay(this.popup);
			this.olMap.addOverlay(this.popup);
		} else {
			// eslint-disable-next-line no-console
			console.warn(
				'Unable to add popup overlay because no overlay was found.'
			);
		}
	}

	/** Add select listeners for the marker features. */
	addSelectListeners() {
		if (this.selector) {
			// Add selection marker functionality
			this.olMap.removeInteraction(this.selector);
			this.olMap.addInteraction(this.selector);

			const features = this.selector.getFeatures();

			// Add select listener.
			features.un('add', this.onSelectFeature);
			features.on('add', this.onSelectFeature);

			// Add deselect listener.
			features.un('remove', this.onDeselectFeature);
			features.on('remove', this.onDeselectFeature);

			// change mouse cursor when over marker.
			this.olMap.un('pointermove', this.setPointer);
			this.olMap.on('pointermove', this.setPointer);
		} else {
			// eslint-disable-next-line no-console
			console.warn(
				'Unable to add listener because no selector was found.'
			);
		}
	}

	/**
	 * Open popup for selected feature.
	 *
	 * @param {{element: Feature<Point>}} e
	 */
	onSelectFeature = async (e) => {
		// Show loading indicator.
		const point = e.element?.getGeometry()?.getCoordinates();
		if (point) {
			this.popup.show(
				point,
				`<p class="flare-popup-desc flare-popup-title"><strong>${__(
					'Loading'
				)}...</string></p>`
			);
		}

		// Get marker from WordPress based on the marker's post type.
		const collection = this.postTypes[e.element?.get('postType')];

		try {
			const marker = await getItem(
				collection,
				e.element.get('markerId'),
				{
					_fields:
						'date,modified,slug,type,link,title,excerpt,author,featured_media,imc_icons,imc_img_tag,meta,_embedded',
					_embed: 'author',
				}
			);

			// Prepare the Mustache view object containing the marker content.
			const view = {
				...marker.body,
				author: marker.body._embedded.author[0],
				standalone: marker.body.type === 'imc-marker',
			};

			// Create popup content from Mustache template.
			const content = Mustache.render(this.template.innerHTML, view);

			// Update popup with marker content.
			this.popup.show(point, content);
			this.popup.performAutoPan();
		} catch (error) {
			this.setError(
				__('Unable to load marker.', 'flare-imc') +
					' ' +
					__('Please refresh this page to try again.', 'flare-imc')
			);
		}
	};

	/** Close popup for deselected feature. */
	onDeselectFeature = () => this.popup?.hide();

	/**
	 * Set mouse cursor to pointer on markers
	 *
	 * @param {import('ol').MapBrowserEvent} e
	 */
	setPointer = (e) => {
		const pixel = this.olMap.getEventPixel(e.originalEvent);
		const hit = this.olMap.hasFeatureAtPixel(pixel, {
			hitTolerance: 6,
			layerFilter: (layer) => layer === this.ftLayer,
		});
		this.olMap.getTarget().style.cursor = hit ? 'pointer' : '';
	};

	/** Add all the map object required for interactive markers. */
	addMarkerSupport() {
		this.addFeatureLayer();
		this.addPopup();
		this.addSelectListeners();
	}

	/**
	 * Add all base layers for the given WordPress map to the OpenLayers map.
	 *
	 * @param {number} mapId
	 */
	async initBaseLayers(mapId) {
		const apiCalls = [];

		// Get map from WordPress
		const map = getItem('imc_maps', mapId, { _fields: 'id,meta' });
		apiCalls.push(map);

		// Get layers from WordPress.
		const layers = getFullCollection('imc_layers', {
			_fields: 'id,slug,meta,image_source',
			post: mapId,
		});
		apiCalls.push(layers);

		try {
			// When all records have been fetched, sort the layers by order on the map.
			const records = await Promise.all(apiCalls);

			this.wpMap = records.find((record) => record.body)?.body;
			const sortOrder = this.wpMap?.meta?.layer_order;

			this.wpLayers = records
				.find((record) => Array.isArray(record))
				.sort(
					(a, b) =>
						sortOrder?.indexOf(b.id) - sortOrder?.indexOf(a.id)
				);
		} catch (error) {
			const body = await error.json();
			this.setError(
				body.message +
					' ' +
					__('Please refresh this page to try again.', 'flare-imc')
			);
		}

		if (this.wpLayers?.length) {
			// Add layers to map and set map interactions based on the visible layer.
			this.wpLayers.forEach(async (wpLayer, i) => {
				const layer = new Layer(this, wpLayer, i);
				layer.addToMap();

				if (layer.visible) {
					layer.setMapView();
					this.setFeatures(layer);
				}
			});

			// Add layer switcher if there are multiple layers.
			if (this.wpLayers.length > 1) this.addLayerSwitcher();
		}
	}

	/** Add layer switcher for base layers to the map. */
	addLayerSwitcher() {
		this.olMap.addControl(
			new LayerSwitcher({
				reordering: false,
				noScroll: true,
				mouseover: true,
				displayInLayerSwitcher: (layer) => layer.get('baseLayer'),
				onchangeCheck: (layer) =>
					this.setFeatures(layer.get('blockLayer')),
			})
		);
	}

	/**
	 * Replace features on feature layer with features from the provided layer.
	 *
	 * @param {Layer} layer
	 */
	async setFeatures(layer) {
		const source = this.ftLayer.getSource();
		source.clear();
		const features = await layer.getFeatures();
		source.addFeatures(features);
	}

	/**
	 * Replace the map with an error message.
	 *
	 * @param {string} msg Error message to display.
	 */
	setError(msg) {
		this.el.innerHTML = `<div class="flare-map-error">${msg}</div>`;
	}
}
