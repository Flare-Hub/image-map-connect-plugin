import { useEffect, useMemo } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import LayerSwitcher from 'ol-ext/control/LayerSwitcher'

import { useMap } from './context'
import ImageLayer from './image-layer'

import 'ol-ext/dist/ol-ext.css'
import cls from './ol.module.scss'

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
	const layers = useSelect(
		select => select('core').getEntityRecords('taxonomy', 'layer', { post: mapId, per_page: 100, _embed: true }),
		[mapId]
	)

	// Layer switcher control to switch base layers.
	const switcher = useMemo(() => new LayerSwitcher({
		reordering: false,
		noScroll: true,
		displayInLayerSwitcher: layer => layer.get('baseLayer'),
		// Propagate the selected layer.
		onchangeCheck: layer => setSelLayerId(layer.get('wpId')),
	}), [])

	// Get the list of layers for the provided map.
	useEffect(() => {
		controlBar.element.classList.add(cls.oneLayer)
		controlBar.addControl(switcher)
	}, [mapId])

	// Conditionally hide the layer switcher through a class on the control bar.
	// Ticket raised to handle this properly: https://github.com/Viglino/ol-ext/issues/951
	useEffect(() => {
		if (controlBar.element) {
			if (layers && layers.length > 1) {
				controlBar.element.classList.remove(cls.oneLayer)
			} else {
				controlBar.element.classList.add(cls.oneLayer)
			}
		}
	}, [layers])

	if (!layers) return null

	return layers.map(layer => (
		<ImageLayer layer={layer} visible={layer.id === (selLayerId ?? layers[0].id)} loaded key={layer.id} />
	))
}
