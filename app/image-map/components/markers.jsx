import { Button } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'

import { useRouter } from '../contexts/router'
import { MarkerProvider } from '../contexts/marker'
import useCollection from '../hooks/useCollection'
import useSelected from '../hooks/useSelected'
import { getCollection } from '../utils/wp-fetch'
import transformModel from '../utils/transform-model'
import { wpLayers } from './layers';
import Layout from './layout'
import EditMarker from './edit-marker'
import ImageMap from './image-map';
import SelectedMarkerPin from './selected-marker-pin'
import MarkerPinList from './marker-pin-list'

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
		{ parent: query[wpMarkers.parent], _fields: 'title,id,meta,marker-icons' },
		{ list: [], page: 1 }
	)

	const [layer] = useSelected(wpLayers, { _fields: 'id,meta' })

	const [markerIcons, setMarkerIcons] = useState([])

	useEffect(async () => {
		if (!query.map) return
		const res = await getCollection('marker-icons', { map: query.map, meta: {} })
		setMarkerIcons(res.body)
	}, [query.map])

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
			<MarkerProvider>
				<ImageMap layer={layer}>
					<SelectedMarkerPin icons={markerIcons} />
					<MarkerPinList markers={markers.list} icons={markerIcons} />
				</ImageMap>
				<EditMarker
					markers={wpMarkers}
					dispatch={action => dispatchMarkers(transformModel(action))}
				/>
			</MarkerProvider>
		</Layout>
	)
}
