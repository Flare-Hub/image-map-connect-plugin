import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import useCollection from '../../hooks/useCollection';
import { useRouter } from '../../contexts/router';
import Layout from '../layout';
import EditMap from './edit-map';

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	// Load maps into global state
	const { query, navigate } = useRouter();
	const { list, loading } = useCollection(
		'postType',
		'imc-map',
		{ _fields: 'id,title' },
		[]
	);

	/**
	 * Update layer in query attributes and unset marker.
	 *
	 * @param {string|null} map
	 */
	function setMap( map ) {
		navigate( {
			map,
			layer: null,
			marker: null,
		} );
	}

	return (
		<Layout
			list={ list }
			titleAttr="title.rendered"
			selected={ Number( query.map ) }
			selectItem={ setMap }
			loading={ loading && ! ( list && list.length ) }
			addButton={
				<Button
					variant="primary"
					className="medium"
					onClick={ () => setMap( 'new' ) }
				>
					{ __( 'Add Map' ) }
				</Button>
			}
		>
			<EditMap />
		</Layout>
	);
}
