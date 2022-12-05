import { Button } from '@wordpress/components'
import { useState } from '@wordpress/element'

import { useRouter } from '../contexts/router'
import useCollection from '../hooks/useCollection'
import useSelected from '../hooks/useSelected'
import transformModel from '../utils/transform-model'
import { wpLayers } from './layers';
import Layout from './layout'
import EditMarker from './edit-marker'
import ImageMap from './image-map';

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

	const [map, setMap] = useState()

	// Load markers into global state
	const [markers, dispatchMarkers, loading] = useCollection(
		wpMarkers,
		{ parent: query[wpMarkers.parent], _fields: 'title,id' },
		{ list: [], page: 1 }
	)

	const [layer] = useSelected(wpLayers, { _fields: 'id,meta' })

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
			<ImageMap layer={layer} whenCreated={setMap} />
			<EditMarker
				markers={wpMarkers}
				dispatch={action => dispatchMarkers(transformModel(action))}
				map={map} />
		</Layout>
	)
}
