import apiFetch from '@wordpress/api-fetch';

/**
 * @typedef WpResponse
 * @property {Array.<Object<string, unknown>>|Object<string, unknown>} body     Response body.
 * @property {Response}                                                response Full response.
 */

/**
 * @typedef CollectionResponse
 * @property {number} total      Total number of records in collection.
 * @property {number} totalPages Total number of pages in collection.
 */

/**
 * Interact wit the Wordpress rest API
 *
 * @param {string}                      path   Path to the endpoint
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method The http method.
 * @param {Object}                      body   The content of the message. Will be stringified.
 * @param {Object.<string, string>}     query  Query parameters to append to the endpoint.
 * @return {Promise<WpResponse>} The response from Wordpress.
 */
export async function wpFetch(path, method = 'GET', body, query = {}) {
	// Create the full query path
	const params = new URLSearchParams(query);

	// Send request
	const response = await apiFetch({
		path: path + '?' + params.toString(),
		parse: false,
		method,
		data: body,
	});

	// Return response parsed
	const data = await response.json();
	return {
		body: data,
		response,
	};
}

/**
 * Request a collection from the Wordpress rest API.
 *
 * @param {string}                  collection The type of wordpress objects to get.
 * @param {Object.<string, string>} query      Query parameters to append to the endpoint.
 * @return {Promise<WpResponse & CollectionResponse>} The response from Wordpress.
 */
export async function getCollection(collection, query) {
	const path = `/wp/v2/${collection}/`;
	const { body, response } = await wpFetch(path, 'GET', null, query);

	return {
		body,
		total: Number(response.headers.get('X-WP-TotalPages')),
		totalPages: Number(response.headers.get('X-WP-TotalPages')),
		response,
	};
}

/**
 * Request all pages of a collection from the Wordpress rest API.
 *
 * @param {string}                  collection The type of wordpress objects to get.
 * @param {Object.<string, string>} query      Query parameters to append to the endpoint.
 * @return {Promise<Array<object>>} The response from Wordpress.
 */
export async function getFullCollection(collection, query = {}) {
	/** @type {Array<Promise<WpResponse & CollectionResponse>>} */
	const requests = [];
	const q = { ...query };

	q.page = 1;
	if (!query.per_page) q.per_page = 100;
	const firstReq = getCollection(collection, q);
	requests.push(firstReq);

	const totalPages = (await firstReq).totalPages;

	while (q.page < totalPages) {
		q.page++;
		requests.push(getCollection(collection, q));
	}

	const responses = await Promise.all(requests);
	return responses.reduce((acc, res) => [...acc, ...res.body], []);
}

/**
 * Request a collection from the Wordpress rest API.
 *
 * @param {string}                  collection The type of wordpress object to get.
 * @param {string}                  id         The ID of the object.
 * @param {Object.<string, string>} query      Query parameters to append to the endpoint.
 */
export function getItem(collection, id, query) {
	const path = `/wp/v2/${collection}/${id}`;
	return wpFetch(path, 'GET', null, query);
}
