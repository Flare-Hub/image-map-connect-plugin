import { Button } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'

import { useRouter } from '../../contexts/router'
import { MarkerForm } from './marker-form'
import useCollection from '../../hooks/useCollection'
import { LAYER_REFS } from '../layers';
import Layout from '../layout'
import CreateMarkerModal from './create-marker-modal'
import { mapRefs } from '../maps'

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
export const MARKER_REFS = {
	model: 'marker',
	type: 'postType',
	parent: 'layer',
}

/**
 * List of maps with details of selected map.
 */
export default function Markers() {
	const { query, navigate } = useRouter()

	// Fetch markers from Wordpress.
	const markers = useCollection(
		MARKER_REFS,
		{
			layers: query[MARKER_REFS.parent],
			_fields: 'title,id,type,marker-icons,flare_loc',
			post_types: 'all',
			map: query[mapRefs.model],
		},
		[query[MARKER_REFS.parent]]
	)

	// Get selected marker from marker list or create marker popup.
	const [selected, setSelected] = useState()

	useEffect(() => {
		const marker = markers.list.find(mk => mk.id === +query[MARKER_REFS.model])
		if (marker) setSelected(marker)
	}, [markers.list, query[MARKER_REFS.model]])

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
			selected={+query[MARKER_REFS.model]}
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
			<MarkerForm
				selected={selected}
				markers={markers}
				onMapLoaded={setMap}
			/>
			{showModal && <CreateMarkerModal
				onRequestClose={() => setShowModal(false)}
				layer={+query[LAYER_REFS.model]}
				map={query[LAYER_REFS.parent]}
				onRegisterMarker={setSelected}
			/>}
		</Layout>
	)
}
