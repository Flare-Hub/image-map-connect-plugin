import { Feature, Map as OlMap } from "ol"
import LayerSwitcher from "ol-ext/control/LayerSwitcher"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Fill, Style, Text } from "ol/style"

import remixMap from "common/remix-unicode.json"
import { getFullCollection } from "common/utils/wp-fetch"
import Layer from "./Layer"

export default class Map {
	/** @type {import('./Layer').BlockAttr} Dataset from the map element. */ blockAttr
	/** @type {OlMap} Open Layers map to add the layer to. */ map
	/** @type {VectorLayer} Layer to display the features */ ftLayer
	/** @type {Array<Object<string, any>>} WordPress imagemaps. */ wpLayers

	constructor(el) {
		this.blockAttr = el.dataset
		this.map = new OlMap({ target: el })

		this.ftLayer = new VectorLayer({
			source: new VectorSource(),
			style: this.styleIcon,
			zIndex: 10
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
		if (this.ftLayer) this.map.removeLayer(this.ftLayer)
		this.map.addLayer(this.ftLayer)
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
