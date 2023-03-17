import { useEffect } from '@wordpress/element'
import LayerGroup from 'ol/layer/Group'
import LayerSwitcher from 'ol-layerswitcher'
import { Collection } from 'ol'

import { useMap } from './context'
import { createImgLayer, createProjection, createView } from './layer-helpers'
import { getCollection } from 'common/utils/wp-fetch'

import 'ol-layerswitcher/dist/ol-layerswitcher.css'

/**
 * Add OpenLayers layer group with base layers, and layer switcher, to map.
 *
 * @param {object} props
 * @param {Object<string, any>} props.mapId WordPress map ID to fetch the layer list from.
 * @param {string} props.title Title of the base layer group in the layer switcher.
 * @param {number} [props.selLayerId] Id of the Layer that is selected when initializing this component.
 */
export default function BaseLayerGroup({ mapId, title, selLayerId }) {
	const { map } = useMap()

	// Get the list of layers for the provided map and pre-select the 1st layer.
	useEffect(async () => {
		const { body: layers } = await getCollection(
			'imagemaps',
			{ parent: mapId, per_page: 100, _embed: true }
		)

		if (!selLayerId) selLayerId = layers[0].id

		/**
		 * @type {Array<import('ol/layer/Image').default>}
		 **/
		const imgLayers = new Collection()
		let view

		for (const layer of layers) {
			const projection = createProjection(layer)
			const imgLayer = createImgLayer(layer, projection, false)

			imgLayers.push(imgLayer)

			if (layer.id === selLayerId) {
				imgLayer.setVisible(true)
				view = createView(layer, projection)
			}
		}

		const group = new LayerGroup({ title })
		group.setLayers(imgLayers)
		map.setLayerGroup(group)
		if (view) map.setView(view)

		map.addControl(new LayerSwitcher())

	}, [mapId])

	return null
}
