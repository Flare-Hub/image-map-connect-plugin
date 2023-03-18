import { useMemo } from "@wordpress/element"
import { useSelect } from "@wordpress/data"
import { __ } from "@wordpress/i18n"

import OlMap from "common/components/ol/map"
import BaseLayerGroup from "common/components/ol/base-layer-group"
// import Control from "common/components/ol/control"
import ControlBar from "common/components/ol/control-bar"

import blockMeta from "../block.json"
import cls from "./map.module.scss"

/**
 * Show preview of the map with markers.
 *
 * @param {object} props
 * @param {number} props.mapId Id of the map to display.
 * @param {object} [props.queryParams] Parameters provided by the Query Loop block.
 * @param {string} [props.templateSlug] Slug of the current FSE template.
 * @param {string} [props.previewPostType] Post type to show in the inherited query loop.
 * @param {string} props.queryType Whether to use pagination.
 * @param {number} [props.page] Current page in the query loop.
 * @param {string} [props.height] Height of the map container.
 */
export default function Map({ mapId, queryParams, templateSlug, previewPostType, queryType, page, height }) {
	const {
		inherit, postType, perPage, offset, order, orderBy, search, author, exclude = [], sticky, taxQuery
	} = queryParams ?? {}

	// Get query post type.
	const tplPostType = templateSlug && templateSlug.replace('archive-', '')
	const entityPostType = previewPostType ?? inherit ? tplPostType : postType

	// Get all taxonomies that can be applied to the entity's post type.
	const taxonomies = useSelect(select => {
		// Only needed if there is a tax query.
		if (!queryParams || !taxQuery) return false

		return select('core').getTaxonomies({
			type: entityPostType,
			per_page: -1,
			context: 'view',
		})
	}, [entityPostType])

	// Contruct the query used to fetch the post IDs to include in the map.
	const postQuery = useMemo(() => {
		// Only relevant in there are query parameters
		// and there is no mismatch between the taxonomies and tax query.
		if (!queryParams || (taxQuery && !taxonomies)) {
			return false
		}

		// Base query
		const query = { _fields: ['id'], context: 'view' }

		// Add pagination if needed, ensuring correct ordering.
		if (queryType === 'page') {
			if (perPage) query.per_page = perPage
			if (offset) query.offset = offset
			if (order) query.order = order
			if (orderBy) query.orderby = orderBy
			query.page = page ?? 1
		} else {
			query.page = -1
		}

		// If the query is not inherited from the main query, set the query parameters
		// as defined in the query loop block.
		if (!inherit) {
			if (search) query.search = search
			if (author) query.author = author
			if (exclude && exclude.length) query.exclude = exclude
			if (sticky) query.sticky = sticky === 'only'

			// taxQuery contains an entry with terms to query for each slug.
			// This should be transformed to use the taxonomy rest base instead of slug in the query.
			if (taxQuery) {
				Object.entries(taxQuery).forEach(([querySlug, terms]) => {
					const tax = taxonomies && taxonomies.find(({ slug }) => (
						slug === querySlug
					))
					if (tax && tax.rest_base) query[tax.rest_base] = terms
				})
			}
		}

		return query
	}, [
		templateSlug, inherit, postType, queryType, perPage, offset,
		order, orderBy, page, search, author, exclude.length, sticky,
		taxonomies, taxQuery
	])

	// Get all post IDs matching the query above.
	const postIds = useSelect(
		select => !postQuery ?
			false :
			select('core').getEntityRecords('postType', entityPostType, postQuery),
		[postQuery]
	)

	return (
		<OlMap style={{ height }}>
			<ControlBar position="top-right" className={cls.withSwitcher}>
				<BaseLayerGroup
					mapId={mapId}
					title={__('Initial layer', blockMeta.textdomain)}
				/>
				{/* <Control>
					<button onClick={() => console.log('Test')}>S</button>
				</Control> */}
			</ControlBar>
		</OlMap>
	)
}
