import { Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

import useCollection from '../../hooks/useCollection'
import { useRouter } from '../../contexts/router'
import Layout from '../layout'
import EditLayer from './edit-layer'

/** @type {import('../../hooks/useCollection').WpIdentifiers} */
export const LAYER_REFS = {
	model: 'layer',
	type: 'taxonomy',
	parent: 'map',
}

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { query, navigate } = useRouter()

	// Load layers into global state
	const { list, loading } = useCollection(
		LAYER_REFS,
		{ post: +query[LAYER_REFS.parent], _fields: 'name,id' },
		[query[LAYER_REFS.parent]]
	)

	return (
		<Layout
			list={list}
			titleAttr="name"
			selected={+query[LAYER_REFS.model]}
			selectItem={layer => navigate({ layer })}
			loading={loading && !(list && list.length)}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate({ layer: 'new' })}
				>{__('Add Layer')}</Button>
			}
		>
			<EditLayer references={LAYER_REFS} />
		</Layout>
	)
}
