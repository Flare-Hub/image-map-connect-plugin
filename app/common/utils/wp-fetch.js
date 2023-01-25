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
 * @returns {Promise<WpResponse>} The response from Wordpress.
 */
export async function wpFetch(path, method = 'GET', body, query = {}) {
	// Create the full query path
	const params = new URLSearchParams(query)

	// Send request
	const response = await apiFetch({
		path: path + '?' + params.toString(),
		parse: false,
		method,
		data: body,
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
 * @param {string} collection The type of wordpress objects to get.
 * @param {Object.<string, string>} query Query parameters to append to the endpoint.
 * @returns {Promise<WpResponse & CollectionResponse>} The response from Wordpress.
 */
export async function getCollection(collection, query) {
	const path = `/wp/v2/${collection}/`
	const { body, response } = await wpFetch(path, 'GET', null, query)

	return {
		body,
		total: Number(response.headers.get('X-WP-TotalPages')),
		totalPages: Number(response.headers.get('X-WP-TotalPages')),
		response
	}
}

/**
 * Request a collection from the Wordpress rest API.
 *
 * @param {string} collection The type of wordpress object to get.
 * @param {string} id The ID of the object.
 * @param {Object.<string, string>} query Query parameters to append to the endpoint.
 */
export function getItem(collection, id, query) {
	const path = `/wp/v2/${collection}/${id}`
	return wpFetch(path, 'GET', null, query)
}

/**
 * Add an object to Wordpress through the rest API.
 *
 * @param {string} collection The type of wordpress object to get.
 * @param {string} id The ID of the object.
 * @param {object} body The content of the message. Will be stringified.
 * @param {Object.<string, string>} query Query parameters to append to the endpoint.
 */
export function createItem(collection, body, query) {
	const path = `/wp/v2/${collection}/`
	return wpFetch(path, 'POST', body, query)
}

/**
 * Update an object to Wordpress through the rest API.
 *
 * @param {string} collection The type of wordpress object to get.
 * @param {string} id The ID of the object.
 * @param {object} body The content of the message. Will be stringified.
 * @param {Object.<string, string>} query Query parameters to append to the endpoint.
 */
export function postItem(collection, id, body, query) {
	const path = `/wp/v2/${collection}/${id}`
	return wpFetch(path, 'POST', body, query)
}

/**
 * Remove an object from Wordpress through the rest API.
 *
 * @param {string} collection The type of wordpress object to get.
 * @param {string} id The ID of the object.
 * @param {object} body The content of the message. Will be stringified.
 */
export function deleteItem(collection, id, body) {
	const path = `/wp/v2/${collection}/${id}`
	return wpFetch(path, 'DELETE', body)
}
