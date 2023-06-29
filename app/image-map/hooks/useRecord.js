import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import useNotice from './useNotice';

/** @typedef {import('@wordpress/core-data').EntityRecord} EntityRecord */

/**
 * @typedef RecordHandler
 * @property {EntityRecord}                                    record     Fetched WordPress record.
 * @property {'none'|'new'|'loading'|'loaded'}                 status     Loading status for the record.
 * @property {(values: EntityRecord) => Promise<EntityRecord>} saveRecord Save record changes to WordPress.
 * @property {() => Promise<boolean>}                          delRecord  Delete record from WordPress.
 */

/**
 * Get controlled state for an item selected from a collection.
 *
 * @param {number}                                              id          ID of the item to fetch from the collection.
 * @param {'postType' | 'taxonomy'}                             type        Type of WP entity record.
 * @param {'imc-map' | 'imc-layer' | 'imc-marker' | 'imc-icon'} name        Name of the WP entity record.
 * @param {Object<string, unknown>}                             query       Search query passed to the REST API.
 * @param {EntityRecord}                                        placeholder Empty object as placeholder for a new item.
 * @param {Array<unknown>}                                      deps        Dependencies other than id, type and name.
 * @return {RecordHandler} Item state
 */
export default function useRecord(
	id,
	type,
	name,
	query,
	placeholder = {},
	deps = []
) {
	// Get record details and loading status.
	const { record, status } = useSelect(
		( select ) => {
			switch ( id ) {
				// No record selected.
				case undefined:
					return {
						status: 'none',
						record: placeholder,
					};

				// New record.
				case 'new':
					return {
						status: 'new',
						record: placeholder,
					};

				// Get record from WordPress.
				default:
					const { hasFinishedResolution, getEntityRecord } =
						select( coreDataStore );
					return {
						status: hasFinishedResolution( 'getEntityRecord', [
							type,
							name,
							id,
							query,
						] )
							? 'loaded'
							: 'loading',
						record:
							getEntityRecord( type, name, id, query ) ??
							placeholder,
					};
			}
		},
		[ type, name, id, ...deps ] // eslint-disable-line react-hooks/exhaustive-deps
	);

	const { saveEntityRecord, deleteEntityRecord } =
		useDispatch( coreDataStore );

	/**
	 * Save record changes to WordPress.
	 *
	 * @param {Object<string, any>} values
	 */
	function saveRecord( values ) {
		return saveEntityRecord( type, name, values );
	}

	/** Delete record from WordPress. */
	function delRecord() {
		return deleteEntityRecord( type, name, id, { force: true } );
	}

	/** Get syncing errors for the record. */
	const { saveError, delError } = useSelect(
		( select ) => {
			const { getLastEntitySaveError, getLastEntityDeleteError } =
				select( coreDataStore );

			return {
				saveError: getLastEntitySaveError( type, name, id ),
				delError: getLastEntityDeleteError( type, name, id ),
			};
		},
		[ type, name, id ]
	);

	// Notify user of any syncing errors.
	const notice = useNotice();

	useEffect( () => {
		if ( saveError )
			notice( { message: saveError.message, style: 'error' } );
	}, [ notice, saveError ] );

	useEffect( () => {
		if ( delError ) notice( { message: delError.message, style: 'error' } );
	}, [ delError, notice ] );

	return { record, status, saveRecord, delRecord };
}
