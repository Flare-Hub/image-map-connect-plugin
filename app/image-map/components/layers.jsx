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
	const [loading, setSelected] = useLoader(
		'imagemaps',
		maps,
		dispatchLayer,
		{ page: layers.page, parent: maps.selected }
	)

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
