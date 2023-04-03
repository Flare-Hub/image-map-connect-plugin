import { Feature, Map as OlMap } from "ol"
import LayerSwitcher from "ol-ext/control/LayerSwitcher"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Fill, Style, Text } from "ol/style"
import Popup from "ol-ext/overlay/Popup"
import { Point } from "ol/geom"

import remixMap from "common/remix-unicode.json"
import { getFullCollection } from "common/utils/wp-fetch"
import Layer from "./Layer"
import { Select } from "ol/interaction"

const popupTemplate = /* html */`
	<h4 class="flare-marker-title">Title</h4>
	<div class="flare-marker">
		<div class="flare-col flare-marker-img">Image goes here.</div>
		<div class="flare-col flare-marker-content">Content goes here.</div>
	</div>
	`

export default class Map {
	/** @type {import('./Layer').BlockAttr} Dataset from the map element. */ blockAttr
	/** @type {OlMap} Open Layers map to add the layer to. */ map
	/** @type {VectorLayer} Layer to display the features */ ftLayer
	/** @type {Array<Object<string, any>>} WordPress imagemaps. */ wpLayers
	/** @type {Popup} Marker popup. */ popup
	/** @type {Select} Marker selection handler */ selector

	constructor(el) {
		this.blockAttr = el.dataset
		this.map = new OlMap({ target: el })

		this.ftLayer = new VectorLayer({
			source: new VectorSource(),
			style: this.styleIcon,
			zIndex: 10
		})

		this.selector = new Select({
			style: null,
			layers: [this.ftLayer],
			hitTolerance: 6,
		})

		this.popup = new Popup({
			popupClass: 'default',
			closeBox: true,
			onclose: () => this.selector.getFeatures().clear()
		})
	}

	/**
	 * Provide icon style for the given feature.
	 * @param {Feature} feature The feature to style.
	 */
	styleIcon(feature) {
		// Icon settings are passed to the feature below.
		const icon = feature.get('icon')
		return new Style({
			text: new Text({
				// Display marker icons using remix icon font characters.
				font: icon.size + "px remixicon",
				text: String.fromCharCode(parseInt(remixMap[icon.loc], 16)),
				fill: new Fill({ color: icon.colour }),
				offsetX: (0.5 - icon.iconAnchor.x) * icon.size,
				offsetY: (0.5 - icon.iconAnchor.y) * icon.size,
			})
		})
	}

	/** Add instance's feature layer to the map. */
	addFeatureLayer() {
		if (this.ftLayer) {
			this.map.removeLayer(this.ftLayer)
			this.map.addLayer(this.ftLayer)
		}
	}

	/** Add marker popup feature to the map (hidden). */
	addPopup() {
		if (this.popup) {
			this.map.removeOverlay(this.popup)
			this.map.addOverlay(this.popup)
		}
	}

	/** Add select listeners for the marker features. */
	addSelectListeners() {
		if (this.selector) {
			// Add selection marker functionality
			this.map.removeInteraction(this.selector)
			this.map.addInteraction(this.selector)

			const features = this.selector.getFeatures()

			// Add select listener.
			features.un('add', this.onSelectFeature)
			features.on('add', this.onSelectFeature)

			// Add deselect listener.
			features.un('remove', this.onDeselectFeature)
			features.on('remove', this.onDeselectFeature)

			// change mouse cursor when over marker.
			this.map.un('pointermove', this.setPointer)
			this.map.on('pointermove', this.setPointer)
		}
	}

	/**
	 * Open popup for selected feature.
	 * @param {{element: Feature<Point>}} e
	 */
	onSelectFeature = (e) => {
		const point = e.element.getGeometry()
		this.popup.show(point.getCoordinates(), popupTemplate)
	}

	/** Close popup for deselected feature. */
	onDeselectFeature = () => this.popup.hide()

	/** Set mouse cursor to pointer on markers */
	setPointer = (e) => {
		const pixel = this.map.getEventPixel(e.originalEvent);
		const hit = this.map.hasFeatureAtPixel(pixel, {
			hitTolerance: 6,
			layerFilter: layer => layer === this.ftLayer
		});
		this.map.getTarget().style.cursor = hit ? 'pointer' : '';
	}

	/** Add all the map object required for interactive markers. */
	addMarkerSupport() {
		this.addFeatureLayer()
		this.addPopup()
		this.addSelectListeners()
	}

	/** Add all base layers for the given WordPress map to the OpenLayers map. */
	async initBaseLayers(mapId) {
		// Get layers from WordPress.
		this.wpLayers = await getFullCollection('imagemaps', {
			_fields: 'id,slug,meta,_links',
			_embed: 'flare:image',
			parent: mapId
		})

		// Add layers to map and set map interactions based on the visible layer.
		this.wpLayers.forEach(async (wpLayer) => {
			const layer = new Layer(this.map, wpLayer, this.blockAttr)
			layer.addToMap()

			if (layer.visible) {
				layer.setMapView()
				this.setFeatures(layer)
			}
		})
	}

	/** Add layer switcher for base layers to the map. */
	addLayerSwitcher() {
		this.map.addControl(new LayerSwitcher({
			reordering: false,
			noScroll: true,
			displayInLayerSwitcher: layer => layer.get('baseLayer'),
			onchangeCheck: layer => this.setFeatures(layer.get('blockLayer')),
		}))
	}

	/**
	 * Replace features on feature layer with features from the provided layer.
	 * @param {Layer} layer
	 */
	async setFeatures(layer) {
		const source = this.ftLayer.getSource()
		source.clear()
		const features = await layer.getFeatures()
		source.addFeatures(features)
	}
}
