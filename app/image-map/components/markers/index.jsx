import { Button, Flex, FlexItem, Card } from '@wordpress/components'
import { useEffect, useState, useMemo } from '@wordpress/element'

import { useRouter } from '../../contexts/router'
import { MarkerProvider } from '../../contexts/marker'
import useCollection from '../../hooks/useCollection'
import useSelected from '../../hooks/useSelected'
import { getCollection } from '../../../common/utils/wp-fetch'
import transformModel from '../../utils/transform-model'
import { wpLayers } from '../layers';
import Layout from '../layout'
import EditMarker from './edit-marker'
import OlMap from 'common/components/ol/map'
import ListedMarkerPin from './listed-marker-pin'
import ImageLayer from 'common/components/ol/image-layer'
import SelectedMarkerPin from './selected-marker-pin'
import NewMarkerPin from './new-marker-pin'
import CreateMarkerModal from './create-marker-modal'

/** @typedef {import('ol').Map} Map */

/** @type {import('../../hooks/useCollection').WpIdentifiers} */
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
		useMemo(() => (
			{
				imagemaps: query[wpMarkers.parent],
				_fields: 'title,id,type,marker-icons,flare_loc',
				post_types: 'all'
			}
		), [query[wpMarkers.parent]]),
		{ list: [], page: 1 }
	)

	// Identify the selected marker.
	const selected = useMemo(
		() => {
			if (loading) return {}
			if (query[wpMarkers.model] === 'new') return { flare_loc: {} }
			return markers.list.find(mk => mk.id == query[wpMarkers.model]) ?? {}
		},
		[loading, markers, query[wpMarkers.model]]
	)

	// Fetch selected layer from Wordpress.
	const [layer] = useSelected(
		wpLayers.endpoint,
		query[wpLayers.model],
		{ _fields: 'id,name,meta', _embed: 1 },
		{}
	)

	// Fetch marker icons from Wordpress.
	const [markerIcons, setMarkerIcons] = useState([])

	useEffect(() => {
		if (!query.map) return
		getCollection('marker-icons', { map: query.map, meta: {} }).then(({ body }) => {
			setMarkerIcons(body)
		})
	}, [query.map])

	/** @type {[Map, React.Dispatch<React.SetStateAction<Map>>]} */
	const [map, setMap] = useState()

	function selectMarker(id) {
		navigate({ marker: id })
		const marker = markers.list.find(m => m.id === id)
		map.getView().animate({
			center: [marker.flare_loc.lng, marker.flare_loc.lat],
			duration: 500,
		})
	}

	// Control add new marker modal state
	const [showModal, setShowModal] = useState(false)

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
					onClick={() => setShowModal(true)}
				>Add Marker</Button>
			}
		>
			<MarkerProvider
				icons={markerIcons}
				selected={selected}
				layer={query[wpLayers.model]}
			>
				<Flex direction="column" gap="1px" className="full-height">
					<FlexItem>
						<Card>
							<OlMap oneTimeHandlers={{ postrender: e => setMap(e.map) }}>
								{layer.id && (<>
									<ImageLayer layer={layer} />
									{markerIcons.length && markers.list.map(mk => {
										if (mk.id == query.marker) {
											if (selected.flare_loc.lng && selected.flare_loc.lat) {
												return <SelectedMarkerPin key={query.marker} icons={markerIcons} selected={mk} />
											}
										} else {
											return <ListedMarkerPin key={mk.id} marker={mk} icons={markerIcons} />
										}
									})}
									{selected.flare_loc && !(selected.flare_loc.lng && selected.flare_loc.lat) && (
										<NewMarkerPin icons={markerIcons} />
									)}
								</>)}
							</OlMap>
						</Card>
					</FlexItem>
					<FlexItem isBlock>
						<EditMarker
							dispatch={action => dispatchMarkers(transformModel(action))}
							layer={layer}
						/>
					</FlexItem>
				</Flex>
				{showModal && <CreateMarkerModal
					onRequestClose={() => setShowModal(false)}
					layer={layer.id}
					map={query.map}
					dispatch={dispatchMarkers}
				/>}
			</MarkerProvider>
		</Layout>
	)
}
