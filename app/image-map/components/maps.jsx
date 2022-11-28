import { useEffect, useState } from '@wordpress/element'
import { Button } from '@wordpress/components'

import Layout from './layout'
import { useGlobalContext } from '../contexts/global'
import { getCollection } from '../utils/wp-fetch'
import EditMap from './edit-map'

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	const { dispatch, maps } = useGlobalContext()
	const [loading, setLoading] = useState(true)

	useEffect(async () => {
		if (!maps.list.length) {
			// Get image maps from rest api and store the results
			const { body, totalPages } = await getCollection(
				'imagemaps',
				{ page: maps.page, parent: 0 }
			)

			dispatch({
				type: 'setMapList',
				payload: { list: body, totalPages }
			})
		}

		setLoading(false)
	}, [])

	const setSelected = mapId => { dispatch({ type: 'selectMap', payload: mapId }) }

	return (
		<Layout
			list={maps.list}
			titleAttr="name"
			selected={maps.selected}
			selectItem={setSelected}
			loading={loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => setSelected('new')}
				>Add Map</Button>
			}
		>
			<EditMap />
		</Layout>
	)
}
