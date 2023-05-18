import { __ } from "@wordpress/i18n"
import { useEffect, useState } from "@wordpress/element"

import OlMap from "common/components/ol/map"
import BaseLayerGroup from "common/components/ol/base-layer-group"
import ControlBar from "common/components/ol/control-bar"

import blockMeta from "../block.json"
import cls from "./map.module.scss"
import SaveView from "./save-view"
import MarkerPins from "./marker-pins"
import useMarkerPosts from "./use-marker-posts"
import useMarkers from "./use-markers"

/**
 * Show preview of the map with markers.
 *
 * @param {object} props
 * @param {number} props.mapId Id of the map to display.
 * @param {object} [props.queryParams] Parameters provided by the Query Loop block.
 * @param {string} [props.templateSlug] Slug of the current FSE template.
 * @param {string} [props.previewPostType] Post type to show in the inherited query loop.
 * @param {string} props.queryType Whether to use pagination.
 * @param {boolean} props.showStandAlone Whether to show standalone markers.
 * @param {number} [props.page] Current page in the query loop.
 * @param {string} [props.height] Height of the map container.
 * @param {import('./save-view').MapView} [props.initialView] Initial settings for the map view.
 * @param {(mapView: MapView) => void} props.setView Update the initialView attribute.
 */
export default function Map({
	mapId,
	queryParams,
	templateSlug,
	previewPostType,
	queryType,
	showStandAlone,
	page,
	height,
	initialView,
	setView
}) {
	const [selLayer, setSelLayer] = useState(initialView.layer)
	const posts = useMarkerPosts(queryParams, templateSlug, previewPostType, queryType, page)
	const markers = useMarkers(mapId, selLayer, posts, showStandAlone)

	return (
		<OlMap center={initialView.center} zoom={initialView.zoom} style={{ height }}>
			<ControlBar position="top-right" className={cls.withSwitcher}>
				<BaseLayerGroup
					mapId={mapId}
					title={__('Initial layer', blockMeta.textdomain)}
					selLayerId={selLayer}
					setSelLayerId={setSelLayer}
				/>
				<SaveView view={initialView} setView={setView} />
			</ControlBar>
			<MarkerPins mapId={mapId} markers={markers} />
		</OlMap>
	)
}
