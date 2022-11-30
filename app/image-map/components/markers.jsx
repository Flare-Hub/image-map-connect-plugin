import { Button } from '@wordpress/components'

import Layout from './layout'
import { useGlobalContext } from '../contexts/global'
import useLoader from '../hooks/useLoader'
import EditMarker from './edit-marker'

/**
 * List of maps with details of selected map
 */
export default function Markers() {
	const { dispatchMarker, markers, layers } = useGlobalContext()

	// Load markers into global state
	const loading = useLoader(
		markers,
		{ page: markers.page, imagemaps: layers.selected },
		layers,
		dispatchMarker
	)

	/** Set selected marker */
	const setSelected = id => dispatchMarker({ type: 'select', payload: id })

	return (
		<Layout
			list={markers.list}
			titleAttr="title.rendered"
			selected={markers.selected}
			selectItem={setSelected}
			loading={loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => setSelected('new')}
				>Add Marker</Button>
			}
		>
			<EditMarker />
		</Layout>
	)
}
