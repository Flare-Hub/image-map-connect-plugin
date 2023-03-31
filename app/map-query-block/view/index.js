import { getFullCollection } from "common/utils/wp-fetch"
import { Map, View } from "ol"
import ImageLayer from "ol/layer/Image"
import Projection from "ol/proj/Projection"
import Static from "ol/source/ImageStatic"
import LayerSwitcher from "ol-ext/control/LayerSwitcher"

import "./view.scss"
import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'

addEventListener("DOMContentLoaded", () => {
	const mapQueries = document.querySelectorAll('.wp-block-flare-image-map')

	mapQueries.forEach(async (blockEl) => {
		const { mapId, initialLayer, initialZoom, initialCenterX, initialCenterY } = blockEl.dataset
		// const ids = blockEl.dataset.postIds.split(',')

		// Add map to each map div.
		const map = new Map({ target: blockEl })

		// Get layers from WordPress.
		const wpLayers = await getFullCollection('imagemaps', {
			_fields: 'id,slug,meta,_links',
			_embed: 'flare:image',
			parent: mapId
		})

		wpLayers.forEach(layer => {
			// Check if this layer should be visible
			const visible = layer.id === +initialLayer

			// boundaries of the layer
			const extent = [
				0,
				0,
				layer._embedded['flare:image'][0].media_details.width,
				layer._embedded['flare:image'][0].media_details.height
			]

			// Coordinate system to use in the map.
			const projection = new Projection({
				code: 'layer-image',
				units: 'pixels',
				extent,
			})

			// Static source based on the image url.
			const source = new Static({
				url: layer._embedded['flare:image'][0].source_url,
				projection,
				imageExtent: extent,
			})

			// Layer to display the image.
			const imgLayer = new ImageLayer({
				source,
				title: layer.slug,
				baseLayer: true,
				visible,
				wpId: layer.id
			})

			// Add layer to the map.
			map.addLayer(imgLayer)

			// Set layer interactions based on the visible view.
			if (visible) map.setView(new View({
				minZoom: layer.meta.min_zoom,
				maxZoom: layer.meta.max_zoom,
				projection,
				extent,
				constrainOnlyCenter: true,
				center: [initialCenterX, initialCenterY],
				zoom: initialZoom
			}))
		})

		// Add layer switcher for base layers to the map.
		map.addControl(new LayerSwitcher({
			reordering: false,
			noScroll: true,
			displayInLayerSwitcher: layer => layer.get('baseLayer'),
			// onchangeCheck: layer => {},
		}))
	})
});
