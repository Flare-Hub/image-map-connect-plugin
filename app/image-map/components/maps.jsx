import { useEffect } from '@wordpress/element'

import Layout from './layout'
import { useGlobalContext } from '../contexts/global'
import { getCollection } from '../utils/wp-fetch'

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	const { dispatch, maps } = useGlobalContext()

	useEffect(async () => {
		// Get image maps from rest api and store the results
		const { body, totalPages } = await getCollection('/wp/v2/imagemaps/', { page: maps.page })

		dispatch({
			type: 'setMapList',
			payload: { list: body, totalPages }
		})
	}, [])

	const setSelected = map => dispatch({ type: 'selectMap', payload: map })

	return (
		<Layout
			list={maps.list}
			titleAttr="name"
			selected={maps.selected}
			selectItem={setSelected}
		>
			<p>Details here!</p>
		</Layout>
	)
}
