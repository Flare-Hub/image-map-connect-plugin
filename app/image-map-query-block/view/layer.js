import { __ } from '@wordpress/i18n';
import { Feature, View } from 'ol';
import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import { getFullCollection } from './wp-fetch';
import { Point } from 'ol/geom';
import { getCenter } from 'ol/extent';

/** @typedef {import('./map').default} Map */

/** Open Layers layer from WordPress Imagemap. */
export default class Layer {
	/** @type {Map} Flare map instance. */ map;
	/** @type {Object<string, any>} WordPress imagemap. */ wpLayer;
	/** @type {boolean} Whether the layer is visible on the map. */ visible;
	/** @type {import('ol/extent')} boundaries of the layer.  */ extent;
	/** @type {Projection} Coordinate system to use in the map. */ projection;
	/** @type {Static} Static source based on the image url. */ source;
	/** @type {ImageLayer} Layer to display the image. */ baseLayer;
	/** @type {Array<Feature>} Marker features from WordPress markers on this layer. */ features;

	/**
	 * @param {Map}                 map   Open Layers map.
	 * @param {Object<string, any>} layer WordPress layer
	 * @param {number}              index Layer index in the Open Layers map
	 */
	constructor(map, layer, index) {
		this.map = map;
		this.wpLayer = layer;

		// The layer is visible if it is the initial layer in the block attributes,
		// or if no initial layer is set and it is the first layer in the list
		this.visible =
			layer.id === map.initialView.layer ||
			(index === 0 && !map.initialView.layer);

		// The size of the layer's image.
		this.extent = [
			0,
			0,
			layer.image_source?.width,
			layer.image_source?.height,
		];

		// Map coordinates one-to-one with image pixels.
		this.projection = new Projection({
			code: 'layer-image',
			units: 'pixels',
			extent: this.extent,
		});

		// Take full sized image from WordPress.
		this.source = new Static({
			url: layer.image_source?.url,
			projection: this.projection,
			imageExtent: this.extent,
		});

		// Bring it all together.
		this.baseLayer = new ImageLayer({
			source: this.source,
			title: layer.slug,
			baseLayer: true,
			visible: this.visible,
			blockLayer: this,
			zIndex: 0,
		});
	}

	/** Add base layer to the instance's map. */
	addToMap() {
		if (!this.source.getUrl()) {
			this.map.setError(
				__('Unable to load layer image.', 'flare-imc') +
					' ' +
					__('Please refresh this page to try again.', 'flare-imc')
			);
		}
		this.map.olMap.addLayer(this.baseLayer);
	}

	/** Get marker icons from WordPress for the instance's map. */
	fetchMarkerIcons() {
		try {
			return getFullCollection('imc_icons', {
				map: this.map.mapId,
			});
		} catch (error) {
			console.error(error); // eslint-disable-line no-console
			this.map.setError(
				__('Unable to load marker icons.', 'flare-imc') +
					' ' +
					__('Please refresh this page to try again.', 'flare-imc')
			);
		}
	}

	/** Get markers from WordPress for the instance's layer. */
	async fetchMarkers() {
		try {
			// Get linked markers based on post IDs in the current query.
			const linkedMarkers = getFullCollection('imc_markers', {
				imc_layers: this.wpLayer.id,
				map: this.map.mapId,
				_fields: 'id,type,imc_icons,imc_loc',
				post_types: 'linked',
				include: this.map.postIds,
			});

			// Get standalone markers.
			const saMarkers = this.map.showStandalone
				? getFullCollection('imc_markers', {
						imc_layers: this.wpLayer.id,
						map: this.map.mapId,
						_fields: 'id,type,imc_icons,imc_loc',
						post_types: 'standalone',
				  })
				: [];

			// Merge post and standalone markers once both have been fetched.
			const markers = await Promise.all([linkedMarkers, saMarkers]);

			return markers.flat();
		} catch (error) {
			console.error(error); // eslint-disable-line no-console
			this.map.setError(
				__('Unable to load markers.', 'flare-imc') +
					' ' +
					__('Please refresh this page to try again.', 'flare-imc')
			);
		}
	}

	/** Get point features for the instance's layer, creating them if needed. */
	async getFeatures() {
		if (this.features) return this.features;

		// Fetch markers and icons from WordPress.
		const [markers, icons] = await Promise.all([
			this.fetchMarkers(),
			this.fetchMarkerIcons(),
		]);

		// Create list that includes a feature for each marker with a valid icon.
		const features = markers.reduce((fts, marker) => {
			const icon = icons.find((mi) => mi.id === marker.imc_icons[0]);
			if (icon) {
				fts.push(
					new Feature({
						geometry: new Point([
							marker.imc_loc?.lng,
							marker.imc_loc?.lat,
						]),
						icon: { ...icon.meta },
						markerId: marker.id,
						postType: marker.type,
					})
				);
			}
			return fts;
		}, []);

		this.features = features;

		return features;
	}

	/** Set map interactions based on the visible view. */
	setMapView() {
		if (this.visible)
			this.map.olMap.setView(
				new View({
					minZoom: this.wpLayer.meta?.zoom?.min,
					maxZoom: this.wpLayer.meta?.zoom?.max,
					projection: this.projection,
					extent: this.extent,
					constrainOnlyCenter: true,
					center:
						this.map.initialView.center ?? getCenter(this.extent),
					zoom:
						this.map.initialView.zoom ??
						this.wpLayer.meta?.zoom?.min,
				})
			);
	}
}
