import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useCollection from '../../hooks/useCollection';
import { useRouter } from '../../contexts/router';
import Layout from '../layout';
import EditLayer from './edit-layer';

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { query, navigate } = useRouter();

	// Load layers into global state
	const { list, loading } = useCollection(
		'taxonomy',
		'layer',
		{ post: +query.map ?? 0, _fields: 'name,id' },
		[ query.map ]
	);

	/**
	 * Update layer in query attributes and unset marker.
	 *
	 * @param {string|null} layer
	 */
	function setLayer( layer ) {
		navigate( {
			layer,
			marker: null,
		} );
	}

	return (
		<Layout
			list={ list }
			titleAttr="name"
			selected={ +query.layer }
			selectItem={ setLayer }
			loading={ loading && ! ( list && list.length ) }
			addButton={
				<Button
					variant="primary"
					className="medium"
					onClick={ () => setLayer( 'new' ) }
				>
					{ __( 'Add Layer' ) }
				</Button>
			}
		>
			<EditLayer />
		</Layout>
	);
}
