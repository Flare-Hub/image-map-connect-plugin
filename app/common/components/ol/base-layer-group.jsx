import { useEffect, useState } from '@wordpress/element'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

import { getCollection } from 'common/utils/wp-fetch'
import { useMap } from './context'
import ImageLayer from './image-layer'

import 'ol-ext/dist/ol-ext.css'

/**
 * Add OpenLayers layer group with base layers, and layer switcher, to map.
 *
 * @param {object} props
 * @param {Object<string, any>} props.mapId WordPress map ID to fetch the layer list from.
 * @param {number} [props.selLayerId] Id of the Layer that is selected when initializing this component.
 * @param {(selLayerId: number) => void} props.setSelLayerId Setter for the selected layer.
 */
export default function BaseLayerGroup({ mapId, selLayerId, setSelLayerId }) {
	const { controlBar } = useMap()
	const [layers, setLayers] = useState([])

	// Get the list of layers for the provided map and pre-select the 1st layer.
	useEffect(() => {
		controlBar.addControl(new LayerSwitcher({
			reordering: false,
			noScroll: true,
		}))

		getCollection(
			'imagemaps',
			{ parent: mapId, per_page: 100, _embed: true }
		).then((res) => {
			setLayers(res.body)
		})

	}, [mapId])

	return layers.map(layer => (
		<ImageLayer layer={layer} visible={layer.id === (selLayerId ?? layers[0].id)} key={layer.id} />
	))
}
