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

	// Load maps into global state
	const loading = useLoader(
		maps,
		{ page: maps.page, parent: 0 },
		false,
		dispatchMap
	)

	/** Set selected map */
	const setSelected = id => dispatchMap({ type: 'select', payload: id })

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
