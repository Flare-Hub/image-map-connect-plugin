import { Button } from '@wordpress/components'

import Layout from './layout'
import { useGlobalContext } from '../contexts/global'
import useLoader from '../hooks/useLoader'
import EditLayer from './edit-layer'

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { dispatchLayer, maps, layers } = useGlobalContext()

	// Load layers into global state
	const loading = useLoader(
		layers,
		{ page: layers.page, parent: maps.selected },
		maps,
		dispatchLayer
	)

	/** Set selected layer */
	const setSelected = id => dispatchLayer({ type: 'select', payload: id })

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
