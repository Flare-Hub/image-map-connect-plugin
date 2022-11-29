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
	const { dispatchLayer, maps, layers } = useGlobalContext()
	const [loading, setLoading] = useState(true)

	useEffect(async () => {
		if (maps.selected) {
			// Get image maps from rest api and store the results
			const { body, totalPages } = maps.selected
				? await getCollection(
					'imagemaps',
					{ page: layers.page, parent: maps.selected }
				)
				: { body: [] }

			dispatchLayer({
				type: 'updateAll',
				payload: { list: body, totalPages }
			})
		}

		setLoading(false)
	}, [maps.selected])

	const setSelected = layerId => { dispatchLayer({ type: 'select', payload: layerId }) }

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
