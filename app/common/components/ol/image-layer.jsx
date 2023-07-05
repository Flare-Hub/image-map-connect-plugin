import { useMemo, useLayoutEffect, useEffect } from '@wordpress/element';
import { View } from 'ol';
import Static from 'ol/source/ImageStatic';
import Projection from 'ol/proj/Projection';
import ImgLayer from 'ol/layer/Image';

import { useMap, MapProvider } from './context';

/**
 * Add Image layer to map.
 *
 * @param {Object}                    props
 * @param {Object<string, any>}       props.layer     The Wordpress layer.
 * @param {boolean}                   props.visible   Whether to show the layer.
 * @param {number}                    props.watchZoom Zoom level to zoom to when changed.
 * @param {import('react').ReactNode} props.children  Child nodes.
 */
export default function ImageLayer({
	layer = {},
	visible = true,
	watchZoom,
	children,
}) {
	// Get OpenLayer objects
	const context = useMap();

	/* Get boundaries of the layer */
	const extent = useMemo(
		() => [
			0,
			0,
			layer.image_source?.width ?? 0,
			layer.image_source?.height ?? 0,
		],
		[layer.image_source?.height, layer.image_source?.width]
	);

	// OpenLayers image layer for source.
	const imgLayer = useMemo(
		() =>
			new ImgLayer({
				title: layer.name,
				baseLayer: true,
				visible,
				wpId: layer.id,
			}),
		[] // eslint-disable-line react-hooks/exhaustive-deps
	);

	// Add the layer to the map after mounting.
	useLayoutEffect(
		() => context.map?.addLayer(imgLayer),
		[context.map, imgLayer]
	);

	useLayoutEffect(() => {
		imgLayer.setProperties({
			title: layer.name,
			wpId: layer.id,
		});
	}, [imgLayer, layer.id, layer.name]);

	// Coordinate system to use in the map.
	const projection = useMemo(
		() =>
			layer.image_source?.url
				? new Projection({
						code: 'layer-image',
						units: 'pixels',
						extent,
				  })
				: null,
		[extent, layer.image_source?.url]
	);

	// Set static source based on the image url.
	useLayoutEffect(() => {
		const img = projection
			? new Static({
					url: layer.image_source?.url,
					projection,
					imageExtent: extent,
			  })
			: null;
		imgLayer.setSource(img);
	}, [extent, imgLayer, layer.image_source?.url, projection]);

	// Provide a new view using the current props and zoom.
	useEffect(() => {
		const zoom = context.map?.getView().getZoom();

		if (visible)
			context.map.setView(
				new View({
					projection,
					extent,
					constrainOnlyCenter: true,
					zoom,
				})
			);
	}, [visible, projection, context.map, extent]);

	// Update min and max zoom based on layer.
	useEffect(() => {
		if (visible) {
			const view = context.map?.getView();
			view?.setMinZoom(layer.meta.zoom?.min);
			view?.setMaxZoom(layer.meta.zoom?.max);
		}
	}, [layer.meta.zoom, visible, context.map]);

	// Allow manual zooming but overwrite it when it is changed in the props.
	useEffect(() => {
		if (typeof watchZoom === 'number') {
			context.map?.getView().setZoom(watchZoom);
		}
	}, [context.map, watchZoom]);

	return (
		<MapProvider value={{ ...context, projection, imgLayer }}>
			{children}
		</MapProvider>
	);
}
