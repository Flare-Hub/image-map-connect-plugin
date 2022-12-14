import { Button, Flex, FlexItem, Card } from '@wordpress/components'
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
// import ImageMap from './image-map';
// import ListedMarkerPin from './listed-marker-pin'
// import SelectedMarkerPin from './selected-marker-pin'
// import NewMarkerPin from './new-marker-pin'

/** @type {import('../hooks/useCollection').WpIdentifiers} */
export const wpMarkers = {
	model: 'marker',
	endpoint: 'markers',
	parent: 'layer',
}

/**
 * List of maps with details of selected map.
 */
export default function Markers() {
	const { query, navigate } = useRouter()

	// Fetch markers from Wordpress.
	const [markers, dispatchMarkers, loading] = useCollection(
		wpMarkers,
		{ imagemaps: query[wpMarkers.parent], _fields: 'title,id,meta,marker-icons' },
		{ list: [], page: 1 }
	)

	// Fetch selected layer from Wordpress.
	const [layer] = useSelected(wpLayers, { _fields: 'id,meta' })

	// Fetch marker icons from Wordpress.
	const [markerIcons, setMarkerIcons] = useState([])

	useEffect(async () => {
		if (!query.map) return
		const res = await getCollection('marker-icons', { map: query.map, meta: {} })
		setMarkerIcons(res.body)
	}, [query.map])

	const [map, setMap] = useState()

	function selectMarker(marker) {
		navigate({ marker })
		const selected = markers.list.find(m => m.id === marker)
		map.panTo(selected.meta.coordinates, { animate: true, easeLinearity: 0.1, duration: 0.5 })
	}

	return (
		<Layout
			list={markers.list}
			titleAttr="title.rendered"
			selected={Number(query.marker)}
			selectItem={selectMarker}
			loading={loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate({ marker: 'new' })}
				>Add Marker</Button>
			}
		>
			<MarkerProvider icons={markerIcons}>
				<Flex direction="column" gap="1px" className="full-height">
					<FlexItem>
						<Card>
							{/* <ImageMap layer={layer} whenCreated={setMap}>
								{markers.list.map(mk => {
									if (mk.id == query.marker) {
										return <SelectedMarkerPin key={mk.id} icons={markerIcons} selected={mk} />
									} else {
										return <ListedMarkerPin key={mk.id} marker={mk} icons={markerIcons} />
									}
								})}
								{(query.marker === 'new') && <NewMarkerPin icons={markerIcons} />}
							</ImageMap> */}
						</Card>
					</FlexItem>
					<FlexItem isBlock>
						<EditMarker
							markers={wpMarkers}
							dispatch={action => dispatchMarkers(transformModel(action))}
						/>
					</FlexItem>
				</Flex>
			</MarkerProvider>
		</Layout>
	)
}
