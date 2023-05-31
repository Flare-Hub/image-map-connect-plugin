import { useEffect } from '@wordpress/element'
import { useSelect, useDispatch } from '@wordpress/data'
import { store as coreDataStore } from '@wordpress/core-data'
import useNotice from './useNotice'

/** @typedef {import('@wordpress/core-data').EntityRecord} EntityRecord */

/**
 * @typedef RecordHandler
 * @prop {EntityRecord} record Fetched WordPress record.
 * @prop {string} status Loading status for the record.
 * @prop {(values: EntityRecord) => Promise<void>} saveRecord Save record changes to WordPress.
 * @prop {() => Promise<void>} delRecord Delete record from WordPress.
 **/

/**
 * Get controlled state for an item selected from a collection.
 *
 * @param {number} id ID of the item to fetch from the collection.
 * @param {string} type Type of WP entity record.
 * @param {string} name Name of the WP entity record.
 * @param {EntityRecord} placeholder Empty object as placeholder for a new item.
 * @param {Array<unknown>} deps Dependencies other than id, type and name.
 * @returns {RecordHandler} Item state
 */
export default function useRecord(id, type, name, query, placeholder = {}, deps = []) {


	const {
		saveEntityRecord,
		deleteEntityRecord
	} = useDispatch(coreDataStore)

	// Get record details and loading status.
	const { record, status } = useSelect(select => {
		switch (id) {
			// No record selected.
			case undefined:
				return {
					status: 'none',
				}

			// New record.
			case 'new':
				return {
					status: 'new',
				}

			// Get record from WordPress.
			default:
				const { hasFinishedResolution, getEntityRecord } = select(coreDataStore)
				return {
					status: hasFinishedResolution('getEntityRecord', [type, name, id, query]) ? 'loaded' : 'loading',
					record: getEntityRecord(type, name, id, query),
				}
		}
	}, [type, name, id, ...deps])

	/** Save record changes to WordPress. */
	function saveRecord(values) {
		return saveEntityRecord(type, name, values)
	}

	/** Delete record from WordPress. */
	function delRecord() {
		return deleteEntityRecord(type, name, id);
	}

	/** Get syncing errors for the record. */
	const { saveError, delError } = useSelect(select => {
		const {
			getLastEntitySaveError,
			getLastEntityDeleteError,
		} = select(coreDataStore)

		return {
			saveError: getLastEntitySaveError(type, name, id),
			delError: getLastEntityDeleteError(type, name, id),
		}
	}, [type, name, id])

	// Notify user of any syncing errors.
	const notice = useNotice()

	useEffect(() => {
		if (saveError) notice({ message: saveError.message, style: 'error' })
	}, [saveError])

	useEffect(() => {
		if (delError) notice({ message: delError.message, style: 'error' })
	}, [delError])

	return { record: record ?? placeholder, status, saveRecord, delRecord }
}
