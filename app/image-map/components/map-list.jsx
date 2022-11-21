import { useState, useEffect } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'

import ListHeader from "./list-header";
import ListRow from "./list-row";
import ListRowSkeleton from './list-row-skeleton';
// import cls from 'map-list.module.scss'

/**
 * Table with list of all image maps.
 */
export default function MapList() {
	const [maps, setMaps] = useState([])
	const [errorMgs, setErrorMsg] = useState(null)

	useEffect(async () => {
		try {
			const newMaps = await apiFetch({
				path: '/wp/v2/imagemaps/',
				method: 'GET',
			})

			setMaps(newMaps)
		} catch (e) {
			setErrorMsg(e.message)
		}
	}, [])

	return (
		<table className='wp-list-table widefat fixed striped table-view-list tags'>
			<thead>
				<tr>
					<ListHeader name="Name" slug="name" />
					<ListHeader name="Description" slug="description" />
					<ListHeader name="Markers" slug="posts" />
				</tr>
			</thead>
			<tbody id="the-list" data-wp-lists="list:tag">
				{maps.length
					? maps.map(map => <ListRow key={map.id} map={map} />)
					: <ListRowSkeleton />
				}
			</tbody>
		</table>
	)
}
