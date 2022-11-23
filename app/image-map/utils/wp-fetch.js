import apiFetch from '@wordpress/api-fetch'

/**
 * @typedef WpResponse
 * @prop {Array.<object>} body
 * @prop {Response} response
 */

/**
 * @typedef CollectionResponse
 * @prop {number} total
 * @prop {number} totalPages
 */

/**
 * Interact wit the Wordpress rest API
 *
 * @param {string} path Path to the endpoint
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method The http method.
 * @param {object} body The content of the message. Will be stringified.
 * @param {Object.<string, string>} query Query parameters to append to the endpoint.
 * @returns {WpResponse} The response from Wordpress.
 */
export async function wpFetch(path, method = 'GET', body, query = {}) {
	// Create the full query path
	const params = new URLSearchParams()
	for (const param in query) {
		params.set(param, query[param])
	}

	// Send request
	const response = await apiFetch({
		path: path + '?' + query.toString(),
		parse: false,
		method,
		body,
	})

	// Return response parsed
	const data = await response.json()
	return {
		body: data,
		response,
	}
}

/**
 * Request a collection from the Wordpress rest API.
 *
 * @param {string} path Path to the endpoint
 * @param {Object.<string, string>} query Query parameters to append to the endpoint.
 * @returns {WpResponse & CollectionResponse} The response from Wordpress.
 */
export async function getCollection(path, query) {
	const { body, response } = await wpFetch(path, 'GET', null, query)

	return {
		body,
		total: Number(response.headers.get('X-WP-TotalPages')),
		totalPages: Number(response.headers.get('X-WP-TotalPages')),
		response
	}
}
