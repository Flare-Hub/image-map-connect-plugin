import { Button } from '@wordpress/components'

import useCollection from '../hooks/useCollection'
import { useRouter } from '../contexts/router'
import Layout from './layout'
import EditLayer from './edit-layer'

/** @type {import('../hooks/useCollection').WpIdentifiers} */
export const wpLayers = {
	model: 'layer',
	endpoint: 'imagemaps',
	parent: 'map',
}

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { query, navigate } = useRouter()

	// Load layers into global state
	const [layers, dispatchLayers, loading] = useCollection(
		wpLayers,
		{ parent: Number(query[wpLayers.parent]), _fields: 'name,id' },
		{ list: [], page: 1 }
	)

	return (
		<Layout
			list={layers.list}
			titleAttr="name"
			selected={Number(query.layer)}
			selectItem={layer => navigate({ layer })}
			loading={loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate('new')}
				>Add Layer</Button>
			}
		>
			<EditLayer layers={wpLayers} dispatch={dispatchLayers} />
		</Layout>
	)
}
