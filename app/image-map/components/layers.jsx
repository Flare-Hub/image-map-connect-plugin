import { useEffect, useState } from '@wordpress/element'
import { Button } from '@wordpress/components'

import Layout from './layout'
import { useGlobalContext } from '../contexts/global'
import { getCollection } from '../utils/wp-fetch'
import EditLayer from './edit-layer'

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { dispatch, maps, layers } = useGlobalContext()
	const [loading, setLoading] = useState(true)

	useEffect(async () => {
		if (!layers.parent || layers.parent !== maps.selected) {
			// Get image maps from rest api and store the results
			const { body, totalPages } = maps.selected
				? await getCollection(
					'imagemaps',
					{ page: layers.page, parent: maps.selected }
				)
				: { body: [] }

			dispatch({
				type: 'setLayerList',
				payload: { list: body, totalPages, parent: maps.selected }
			})
		}

		setLoading(false)
	}, [])

	const setSelected = layerId => { dispatch({ type: 'selectLayer', payload: layerId }) }

	return (
		<Layout
			list={layers.list}
			titleAttr="name"
			selected={layers.selected}
			selectItem={setSelected}
			loading={loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => setSelected('new')}
				>Add Layer</Button>
			}
		>
			<EditLayer />
		</Layout>
	)
}
