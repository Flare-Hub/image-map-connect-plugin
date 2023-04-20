import { useEffect } from '@wordpress/element'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

import { useMap } from './context'
import ImageLayer from './image-layer'

import 'ol-ext/dist/ol-ext.css'
import { useSelect } from '@wordpress/data'

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

	// Get layers for selected map from WordPress.
	const layers = useSelect(select => select('core')
		.getEntityRecords('taxonomy', 'imagemap', { parent: mapId, per_page: 100, _embed: true }), [mapId])

	// Get the list of layers for the provided map and pre-select the 1st layer.
	useEffect(() => {
		controlBar.addControl(new LayerSwitcher({
			reordering: false,
			noScroll: true,
			displayInLayerSwitcher: layer => layer.get('baseLayer'),
			onchangeCheck: layer => setSelLayerId(layer.get('wpId')),
		}))
	}, [mapId])

	if (!layers) return null

	return layers.map(layer => (
		<ImageLayer layer={layer} visible={layer.id === (selLayerId ?? layers[0].id)} loaded key={layer.id} />
	))
}
