import { useSelect } from '@wordpress/data';
import { store } from '@wordpress/core-data';

/**
 * @typedef Collection
 * @property {Array<import('@wordpress/core-data').EntityRecord>} list    List of WordPress records.
 * @property {boolean}                                            loading Whether the records are still being fetched.
 */

/**
 * Import collection from wordpress and dispatch it to global state.
 *
 * @param {'postType' | 'taxonomy'}                    type  The type of WordPress object that the collection consists of.
 * @param {'map' | 'layer' | 'marker' | 'marker-icon'} model The name of the collection as registered in WordPress.
 * @param {Object}                                     query The query to use when fetching the collection.
 * @param {Array<unknown>}                             deps  Dependencies that change the collection.
 */
export default function useCollection( type, model, query, deps = [] ) {
	return useSelect( ( select ) => {
		const { getEntityRecords, hasFinishedResolution } = select( store );
		const fetchArgs = [ type, model, query ];

		return {
			list: getEntityRecords( ...fetchArgs ) ?? [],
			loading: ! hasFinishedResolution( 'getEntityRecords', fetchArgs ),
		};
	}, deps ); // eslint-disable-line react-hooks/exhaustive-deps
}
