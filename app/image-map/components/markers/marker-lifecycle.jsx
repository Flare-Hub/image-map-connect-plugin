import { select } from '@wordpress/data';
import { store as dataStore } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

import { useRouter } from '../../contexts/router';
import LifeCycleButtons from '../forms/lifecycle-buttons';

/** @typedef {import('@wordpress/core-data').EntityRecord} EntityRecord */

/**
 * Buttons to save or delete a marker
 *
 * @param {Object}                                  props
 * @param {EntityRecord}                            props.marker    Selected marker.
 * @param {(values: EntityRecord) => Promise<void>} props.save      Action to take when clicking save.
 * @param {() => Promise<void>}                     props.delete    Action to take when clicking delete
 * @param {Object<string, unknown>}                 props.listQuery Query for refreshing the markers list.
 */
export default function MarkerLifecycle( {
	marker,
	save,
	delete: delMarker,
	listQuery,
} ) {
	const { query } = useRouter();

	/**
	 * Save marker and force marker list update for connected posts.
	 *
	 * @param {Object<string, any>} fields
	 */
	async function handleSave( fields ) {
		const post = await save( fields );

		if ( post?.type !== 'marker' ) {
			select( dataStore ).getEntityRecords(
				'postType',
				'marker',
				listQuery,
				{},
				true
			);
		}

		return post;
	}

	/** Delete standalone marker or unlink a post from the map. */
	async function handleDelete() {
		let success;

		if ( marker.type === 'marker' ) {
			// Delete marker from WordPress.
			success = await delMarker();
		} else {
			// Remove marker fields from post in WordPress.
			success = await handleSave( {
				id: marker.id,
				flare_loc: {},
				'marker-icons': [],
				layers: [],
			} );
		}

		// Return WordPress response.
		return success;
	}

	return (
		<LifeCycleButtons
			model="marker"
			id={ query.marker }
			onDelete={ handleDelete }
			onSave={ handleSave }
			confirmDeleteText={
				__(
					'Are you sure you want to delete this marker?',
					'flare-imc'
				) +
				' ' +
				( marker.type === 'marker'
					? __(
							'This will remove the marker and all its content.',
							'flare-imc'
					  )
					: __(
							'This will remove the marker. The related post will not be removed',
							'flare-imc'
					  ) )
			}
		/>
	);
}
