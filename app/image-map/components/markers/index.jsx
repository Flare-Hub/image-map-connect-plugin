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
import { Controller } from 'react-hook-form'

import cls from './markers.module.scss'

/** @typedef {import('ol').Map} Map */

/** @typedef {{lng: number, lat: number}} Position */

/**
 * @typedef MarkerListing
 * @prop {string} id
 * @prop {{raw: string}} title
 * @prop {string} type
 * @prop {Array<number>} marker-icons
 * @prop {Position} flare_loc
 */

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

	/** @type {Array<MarkerListing>} Fetch markers from Wordpress. */
	const markers = useCollection(
		wpMarkers,
		{
			layers: query[wpMarkers.parent],
			_fields: 'title,id,type,marker-icons,flare_loc',
			post_types: 'all',
			map: query[mapRefs.model],
		},
		{ list: [], page: 1 },
		[query[wpMarkers.parent]]
	)

	/** @type {MarkerListing} Identify the selected marker. */
	const selected = useMemo(
		() => {
			if (markers.loading || query[wpMarkers.model] === 'new') return {}
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
	const [wpMap] = useSelected(
		mapRefs.endpoint,
		query[mapRefs.model],
		{ _fields: 'icon_details' },
		{},
		[]
	)
	const icons = wpMap?.icon_details

	// Get all post types applicable to markers.
	const postTypes = useCollection({ endpoint: 'types' }, {}, { list: {} }, [])

	// Center map when selecting a marker from the list.
	/**@type {[Map, React.Dispatch<React.SetStateAction<Map>>]} */
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
			selected={+query[wpMarkers.model]}
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
				layer={+query[wpLayers.model]}
				postTypes={postTypes.list}
			>
				<Flex direction="column" gap="1px" className="full-height">
					<FlexItem>
						<Controller
							name='flare_loc'
							rules={{ validate: val => val && val.lat > 0 && val.lng > 0 }}
							render={({ field, fieldState }) => (
								<Card className={fieldState.invalid && cls.invalid}>
									<OlMap oneTimeHandlers={{ postrender: e => setMap(e.map) }}>
										<ImageLayer layer={layer} />
										{icons && markers.list.map(mk => (
											(mk.id !== +query.marker) && <ListedMarkerPin key={mk.id} marker={mk} icons={icons} />
										))}
										{!markers.loading && query[wpMarkers.model] && (
											field.value && field.value.lat && field.value.lng
												? <SelectedMarkerPin icons={icons} newPosition={field.value} onMove={field.onChange} />
												: <NewMarkerPin onSet={field.onChange} />
										)}
									</OlMap>
								</Card>
							)}
						/>
					</FlexItem>
					<FlexItem isBlock>
						<EditMarker actions={markers.actions} layer={layer} postTypes={postTypes.list} />
					</FlexItem>
				</Flex>
				{showModal && layer.id && <CreateMarkerModal
					onRequestClose={() => setShowModal(false)}
					layer={+layer.id}
					map={query.map}
					actions={markers.actions}
				/>}
			</MarkerProvider>
		</Layout>
	)
}
