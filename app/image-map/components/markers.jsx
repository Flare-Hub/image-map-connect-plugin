import { Button } from '@wordpress/components'

import Layout from './layout'
import useCollection from '../hooks/useCollection'
import EditMarker from './edit-marker'
import { useRouter } from '../contexts/router'

/** @type {import('../hooks/useCollection').WpIdentifiers} */
export const wpMarkers = {
	model: 'marker',
	endpoint: 'markers',
	parent: 'layer',
}

/**
 * List of maps with details of selected map
 */
export default function Markers() {
	const { query, navigate } = useRouter()

	// Load markers into global state
	const [markers, dispatchMarkers, loading] = useCollection(
		wpMarkers,
		{ parent: query[wpMarkers.parent], _fields: 'title,id' },
		{ list: [], page: 1 }
	)

	return (
		<Layout
			list={markers.list}
			titleAttr="title.rendered"
			selected={Number(query.marker)}
			selectItem={marker => navigate({ marker })}
			loading={loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate({ marker: 'new' })}
				>Add Marker</Button>
			}
		>
			<EditMarker markers={wpMarkers} dispatch={dispatchMarkers} />
		</Layout>
	)
}
