import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import OlMap from 'common/components/ol/map';
import BaseLayerGroup from 'common/components/ol/base-layer-group';
import ControlBar from 'common/components/ol/control-bar';
import SaveView from './save-view';
import MarkerPins from './marker-pins';
import useMarkerPosts from './use-marker-posts';
import useMarkers from './use-markers';
import MapSize from './map-size';

import cls from './map.module.scss';

/** @typedef {import('./save-view').MapView} MapView */

/**
 * Show preview of the map with markers.
 *
 * @param {Object}                     props
 * @param {number}                     props.mapId             Id of the map to display.
 * @param {Object}                     [props.queryParams]     Parameters provided by the Query Loop block.
 * @param {string}                     [props.templateSlug]    Slug of the current FSE template.
 * @param {string}                     [props.previewPostType] Post type to show in the inherited query loop.
 * @param {string}                     props.queryType         Whether to use pagination.
 * @param {boolean}                    props.showStandAlone    Whether to show standalone markers.
 * @param {number}                     [props.page]            Current page in the query loop.
 * @param {MapView}                    [props.initialViews]    Initial settings for the map view.
 * @param {(mapView: MapView) => void} props.setView           Update the initialView attribute.
 */
export default function Map({
	mapId,
	queryParams,
	templateSlug,
	previewPostType,
	queryType,
	showStandAlone,
	page,
	initialViews,
	setView,
}) {
	const preview = useSelect((select) => {
		const editPost = select('core/edit-post');
		return editPost ? editPost.__experimentalGetPreviewDeviceType() : null;
	});

	const deviceView = initialViews[preview ?? 'Desktop'];

	const [selLayer, setSelLayer] = useState(deviceView?.layer);
	const posts = useMarkerPosts(
		queryParams,
		templateSlug,
		previewPostType,
		queryType,
		page
	);

	const markers = useMarkers(mapId, selLayer, posts, showStandAlone);

	return (
		<OlMap
			center={deviceView?.center}
			zoom={deviceView?.zoom}
			className={cls.canvas}
		>
			<ControlBar position="top-right" className={cls.withSwitcher}>
				<MapSize />
				<BaseLayerGroup
					mapId={mapId}
					title={__('Initial layer', 'flare-imc')}
					selLayerId={selLayer}
					setSelLayerId={setSelLayer}
				/>
				<SaveView
					layer={selLayer}
					setView={(val) =>
						setView({
							...initialViews,
							[preview ?? 'Desktop']: val,
						})
					}
					preview={preview}
				/>
			</ControlBar>
			<MarkerPins mapId={mapId} markers={markers} />
		</OlMap>
	);
}
