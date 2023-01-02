import { Button } from '@wordpress/components'
import { useMemo } from '@wordpress/element'

import Layout from '../layout'
import useCollection from '../../hooks/useCollection'
import EditMap from './edit-map'
import { useRouter } from '../../contexts/router'

/** @type {import('../../hooks/useCollection').WpIdentifiers} */
export const wpMaps = {
	model: 'map',
	endpoint: 'imagemaps',
	parent: false,
}

const collectionQuery = { parent: 0, _fields: 'name,id' }

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	// Load maps into global state
	const { query, navigate } = useRouter()
	const [maps, dispatchMaps, loading] = useCollection(
		wpMaps,
		collectionQuery,
		{ list: [], page: 1 }
	)

	return (
		<Layout
			list={maps.list}
			titleAttr="name"
			selected={Number(query.map)}
			selectItem={map => navigate({ map })}
			loading={loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate({ map: 'new' })}
				>Add Map</Button>
			}
		>
			<EditMap maps={wpMaps} dispatch={dispatchMaps} />
		</Layout>
	)
}
