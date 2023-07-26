import { useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useEntityRecords } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import useNotice from 'common/utils/use-notice';

/**
 * Fetch post IDs for posts to show on the map.
 *
 * @param {Object} [queryParams]     Parameters provided by the Query Loop block.
 * @param {string} [templateSlug]    Slug of the current FSE template.
 * @param {string} [previewPostType] Post type to show in the inherited query loop.
 * @param {string} queryType         Whether to use pagination.
 * @param {number} [page]            Current page in the query loop.
 * @return {string|false} Comma separated list of posts.
 */
export default function useMarkerPosts(
	queryParams,
	templateSlug,
	previewPostType,
	queryType,
	page
) {
	const {
		inherit,
		postType,
		perPage,
		offset,
		order,
		orderBy,
		search,
		author,
		exclude = [],
		sticky,
		taxQuery,
	} = queryParams ?? {};

	// Get query post type.
	const tplPostType = templateSlug && templateSlug.replace('archive-', '');
	const entityPostType = previewPostType ?? inherit ? tplPostType : postType;

	// Get all taxonomies that can be applied to the entity's post type.
	const taxonomies = useSelect(
		(select) => {
			// Only needed if there is a tax query.
			if (!taxQuery) return false;

			return select('core').getTaxonomies({
				type: entityPostType,
				per_page: -1,
				context: 'view',
			});
		},
		[entityPostType, taxQuery]
	);

	// Contruct the query used to fetch the post IDs to include in the map.
	const postQuery = useMemo(() => {
		// Only relevant in there are query parameters
		// and there is no mismatch between the taxonomies and tax query.
		if (!queryParams || (taxQuery && !taxonomies)) {
			return false;
		}

		// Base query
		const query = { _fields: ['id'], context: 'view' };

		// Add pagination if needed, ensuring correct ordering.
		if (queryType === 'page') {
			if (perPage) query.per_page = perPage;
			if (offset) query.offset = offset;
			if (order) query.order = order;
			if (orderBy) query.orderby = orderBy;
			query.page = page ?? 1;
		} else {
			query.per_page = -1;
		}

		// If the query is not inherited from the main query, set the query parameters
		// as defined in the query loop block.
		if (!inherit) {
			if (search) query.search = search;
			if (author) query.author = author;
			if (exclude.length) query.exclude = exclude;
			if (sticky) query.sticky = sticky === 'only';

			// taxQuery contains an entry with terms to query for each slug.
			// This should be transformed to use the taxonomy rest base instead of slug in the query.
			if (taxQuery) {
				Object.entries(taxQuery).forEach(([querySlug, terms]) => {
					const tax =
						taxonomies &&
						taxonomies.find(({ slug }) => slug === querySlug);
					if (tax && tax.rest_base) query[tax.rest_base] = terms;
				});
			}
		}

		return query;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		inherit,
		postType,
		queryType,
		perPage,
		offset,
		order,
		orderBy,
		page,
		search,
		author,
		exclude.length,
		sticky,
		taxonomies,
		taxQuery,
	]);

	// Get all post IDs matching the query above.
	const { records, status } = useEntityRecords(
		'postType',
		entityPostType,
		postQuery
	);

	// Notify user if there is an issue fetching the posts.
	useNotice(
		postQuery && status === 'ERROR',
		__(
			'Error loading correct markers. Please refresh the application to try again.',
			'image-map-connect'
		),
		[postQuery, status]
	);

	return records ? records.reduce((acc, p) => acc + ',' + p.id, '') : false;
}
