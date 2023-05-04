import { Button, Card } from '@wordpress/components'

import Layout from '../layout'
import useCollection from '../../hooks/useCollection'
import EditMap from './edit-map'
import { useRouter } from '../../contexts/router'

/** @type {import('../../hooks/useCollection').WpIdentifiers} */
export const mapRefs = {
	model: 'map',
	endpoint: 'maps',
	parent: false,
}

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	// Load maps into global state
	const { query, navigate } = useRouter()
	const maps = useCollection(
		mapRefs,
		{ _fields: 'id,title' },
		{ list: [], page: 1 },
		[]
	)

	return (
		<Layout
			list={maps.list}
			titleAttr="title.rendered"
			selected={Number(query.map)}
			selectItem={map => navigate({ map })}
			loading={maps.loading}
			addButton={
				<Button
					variant='primary'
					className='medium'
					onClick={() => navigate({ map: 'new' })}
				>Add Map</Button>
			}
		>
			{query[mapRefs.model]
				? <EditMap references={mapRefs} maps={maps} />
				: <Card className="full-height" />
			}
		</Layout>
	)
}
