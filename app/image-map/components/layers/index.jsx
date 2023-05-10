import { Button, Card } from '@wordpress/components'

import useCollection from '../../hooks/useCollection'
import { useRouter } from '../../contexts/router'
import Layout from '../layout'
import EditLayer from './edit-layer'

/** @type {import('../../hooks/useCollection').WpIdentifiers} */
export const wpLayers = {
	model: 'layer',
	endpoint: 'layers',
	parent: 'map',
}

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { query, navigate } = useRouter()

	// Load layers into global state
	const layers = useCollection(
		wpLayers,
		{ post: Number(query[wpLayers.parent]), _fields: 'name,id' },
		{ list: [], page: 1 },
		[query[wpLayers.parent]]
	)

	return (
		<Layout
			list={layers.list}
			titleAttr="name"
			selected={Number(query.layer)}
			selectItem={layer => navigate({ layer })}
			loading={layers.loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate({ layer: 'new' })}
				>Add Layer</Button>
			}
		>
			{query[wpLayers.model]
				? <EditLayer references={wpLayers} layers={layers} />
				: <Card className="full-height" />
			}
		</Layout>
	)
}
