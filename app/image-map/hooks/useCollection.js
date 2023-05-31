import { useSelect } from '@wordpress/data'
import { store } from '@wordpress/core-data'

import { useRouter } from '../contexts/router'

/**
 * @typedef WpIdentifiers
 * @prop {string} model
 * @prop {string} type
 * @prop {string} parent
 */

/**
 * @typedef Collection
 * @prop {Array<import('@wordpress/core-data').EntityRecord>} list List of WordPress records.
 * @prop {boolean} loading Whether the records are still being fetched.
 */

/**
 * Import collection from wordpress and dispatch it to global state.
 *
 * @param {WpIdentifiers} identifiers The name of the collection as registered in wordpress.
 * @param {object} query The query to use when fetching the collection.
 * @param {Array<unknown>} props.deps Dependencies that change the collection.
 * @returns {Collection}
 */
export default function useCollection(identifiers, query, deps = []) {
	const { query: appQuery } = useRouter()

	return useSelect(select => {
		const { getEntityRecords, hasFinishedResolution } = select(store)
		const fetchArgs = [identifiers.type, identifiers.model, query]

		const list = appQuery[identifiers.parent] === 'new'
			? null
			: getEntityRecords(...fetchArgs)

		const loading = !hasFinishedResolution('getEntityRecords', fetchArgs)

		return { list: list ?? [], loading }
	}, deps)
}

