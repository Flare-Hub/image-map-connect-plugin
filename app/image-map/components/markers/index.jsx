import { Button, Flex, FlexItem, Card } from '@wordpress/components'
import { useState, useMemo } from '@wordpress/element'

import { useRouter } from '../../contexts/router'
import { MarkerProvider } from '../../contexts/marker'
import useCollection from '../../hooks/useCollection'
import useSelected from '../../hooks/useSelected'
import { wpLayers } from '../layers';
import Layout from '../layout'
import EditMarker from './edit-marker'
import OlMap from 'common/components/ol/map'
import ListedMarkerPin from './listed-marker-pin'
import ImageLayer from 'common/components/ol/image-layer'
import SelectedMarkerPin from './selected-marker-pin'
import NewMarkerPin from './new-marker-pin'
import CreateMarkerModal from './create-marker-modal'
import { mapRefs } from '../maps'

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
	const markers = useCollection(
		wpMarkers,
		{
			layers: query[wpMarkers.parent],
			_fields: 'title,id,type,marker-icons,flare_loc',
			post_types: 'all'
		},
		{ list: [], page: 1 },
		[query[wpMarkers.parent]]
	)

	// Identify the selected marker.
	const selected = useMemo(
		() => {
			if (markers.loading) return {}
			if (query[wpMarkers.model] === 'new') return { flare_loc: {} }
			return markers.list.find(mk => mk.id == query[wpMarkers.model]) ?? {}
		},
		[markers, query[wpMarkers.model]]
	)

	// Fetch selected layer from Wordpress.
	const [layer] = useSelected(
		wpLayers.endpoint,
		query[wpLayers.model],
		{ _fields: 'id,name,meta', _embed: 1 },
		{ meta: {} },
		[query[wpLayers.model]]
	)

	// Fetch marker icons from Wordpress.
	const [wpMap, _, loadingMap] = useSelected(mapRefs.endpoint, query[mapRefs.model], {}, {}, [])
	const icons = wpMap?.meta?.icons

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
			loading={markers.loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => setShowModal(true)}
				>Add Marker</Button>
			}
		>
			<MarkerProvider
				icons={icons}
				selected={selected}
				layer={query[wpLayers.model]}
			>
				<Flex direction="column" gap="1px" className="full-height">
					<FlexItem>
						<Card>
							<OlMap oneTimeHandlers={{ postrender: e => setMap(e.map) }}>
								<ImageLayer layer={layer} />
								{!loadingMap && markers.list.map(mk => {
									if (mk.id == query.marker) {
										if (selected.flare_loc.lng && selected.flare_loc.lat) {
											return <SelectedMarkerPin key={query.marker} icons={icons} selected={mk} />
										}
									} else {
										return <ListedMarkerPin key={mk.id} marker={mk} icons={icons} />
									}
								})}
								{selected.flare_loc && !(selected.flare_loc.lng && selected.flare_loc.lat) && (
									<NewMarkerPin icons={icons} />
								)}
							</OlMap>
						</Card>
					</FlexItem>
					<FlexItem isBlock>
						<EditMarker actions={markers.actions} layer={layer} />
					</FlexItem>
				</Flex>
				{showModal && layer.id && <CreateMarkerModal
					onRequestClose={() => setShowModal(false)}
					layer={layer.id}
					map={query.map}
					actions={markers.actions}
				/>}
			</MarkerProvider>
		</Layout>
	)
}
