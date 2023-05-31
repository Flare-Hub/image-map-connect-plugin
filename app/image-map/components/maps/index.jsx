import { Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

import useCollection from '../../hooks/useCollection'
import { useRouter } from '../../contexts/router'
import Layout from '../layout'
import EditMap from './edit-map'

/** @type {import('../../hooks/useCollection').WpIdentifiers} */
export const mapRefs = {
	model: 'map',
	type: 'postType',
	parent: false,
}

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	// Load maps into global state
	const { query, navigate } = useRouter()
	const { list, loading } = useCollection(
		mapRefs,
		{ _fields: 'id,title' },
		[]
	)

	return (
		<Layout
			list={list}
			titleAttr="title.rendered"
			selected={Number(query.map)}
			selectItem={map => navigate({ map })}
			loading={loading && !(list && list.length)}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate({ map: 'new' })}
				>{__('Add Map')}</Button>
			}
		>
			<EditMap references={mapRefs} />
		</Layout>
	)
}
