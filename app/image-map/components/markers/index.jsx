import { Button } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

import { useRouter } from '../../contexts/router'
import { MarkerForm } from './marker-form'
import useCollection from '../../hooks/useCollection'
import Layout from '../layout'
import CreateMarkerModal from './create-marker-modal'

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

/**
 * List of maps with details of selected map.
 */
export default function Markers() {
	const { query, navigate } = useRouter()

	// Fetch markers from Wordpress.
	const markers = useCollection('postType', 'marker', {
		layers: +query.layer ?? 0,
		_fields: 'title,id,type,marker-icons,flare_loc',
		post_types: 'all',
		map: query.map,
	}, [query.layer, query.map])

	// Get selected marker from marker list or create marker popup.
	const [selected, setSelected] = useState()

	useEffect(() => {
		const marker = markers.list.find(mk => mk.id === +query.marker)
		if (marker) setSelected(marker)
	}, [markers.list, query.marker])

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
			selected={+query.marker}
			selectItem={selectMarker}
			loading={markers.loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => setShowModal(true)}
				>{__('Add Marker', 'flare')}</Button>
			}
		>
			<MarkerForm
				selected={selected}
				markers={markers}
				onMapLoaded={setMap}
			/>
			{showModal && <CreateMarkerModal
				onRequestClose={() => setShowModal(false)}
				layer={+query.marker}
				map={+query.map}
				onRegisterMarker={setSelected}
			/>}
		</Layout>
	)
}
