import { Button } from '@wordpress/components'

import Layout from './layout'
import { useGlobalContext } from '../contexts/global'
import useLoader from '../hooks/useLoader'
import EditMap from './edit-map'

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	const { dispatchMap, maps } = useGlobalContext()
	const [loading, setSelected] = useLoader(
		'imagemaps',
		false,
		dispatchMap,
		{ page: maps.page, parent: 0 }
	)

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
