
import "./view.scss"
import 'ol/ol.css'
import 'ol-ext/dist/ol-ext.css'
import "remixicon/fonts/remixicon.css"
import Map from "./Map"

addEventListener("DOMContentLoaded", () => {
	const mapQueries = document.querySelectorAll('.wp-block-flare-image-map')

	mapQueries.forEach(async (blockEl) => {
		const map = new Map(blockEl)
		map.addFeatureLayer()
		map.initBaseLayers(blockEl.dataset.mapId)
		map.addLayerSwitcher()
	})
})
