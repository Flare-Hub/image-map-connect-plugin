import { useEffect, useMemo } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';
import useNotice from 'common/utils/use-notice';
import { useMap } from 'common/components/ol/context';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Style, Text } from 'ol/style';
import { Feature } from 'ol';
import { Point } from 'ol/geom';

import remixMap from 'common/remix-unicode.json';
import MarkerPopup from './marker-popup';

/**
 * Add markers in query to map.
 *
 * @param {Object} props
 * @param {number} props.mapId   The Id of the selected map.
 * @param {number} props.markers List of WordPress markers.
 */
export default function MarkerPins({ mapId, markers }) {
	/** Icon settings for the selected map. */
	const { records: markerIcons, status } = useEntityRecords(
		'taxonomy',
		'imc-icon',
		{ post: mapId }
	);

	useNotice(
		status === 'ERROR',
		__(
			'Error loading icons. Please refresh the application to try again.',
			'image-map-connect'
		),
		[status]
	);

	/** Vector source containing the marker features. */
	const mkSource = useMemo(() => new VectorSource(), []);

	/** Vector layer containing the marker features. */
	const mkLayer = useMemo(
		() =>
			new VectorLayer({
				source: mkSource,
				style: (feature) => {
					// Icon settings are passed to the feature below.
					const icon = feature.get('icon');
					if (!icon) return;
					return new Style({
						text: new Text({
							// Display marker icons using remix icon font characters.
							font: (icon.size ?? 24) + 'px remixicon',
							text:
								icon.img?.ref &&
								String.fromCharCode(
									parseInt(remixMap[icon.img.ref], 16)
								),
							fill:
								icon.colour && new Fill({ color: icon.colour }),
							offsetX:
								icon.img?.iconAnchor?.x &&
								icon.size &&
								(0.5 - icon.img.iconAnchor.x) * icon.size,
							offsetY:
								icon.img?.iconAnchor?.y &&
								icon.size &&
								(0.5 - icon.img.iconAnchor.y) * icon.size,
						}),
					});
				},
			}),
		[mkSource]
	);

	const { map } = useMap();

	// Create a point feature for each marker and add it to the map.
	useEffect(() => {
		if (!markerIcons || !markers) return;

		// Create list of features from the list of markers, skipping the ones without an icon.
		const features = markers.reduce((fts, marker) => {
			const icon = markerIcons.find(
				(mi) => mi.id === marker.imc_icons[0]
			);
			if (icon) {
				fts.push(
					new Feature({
						geometry: new Point([
							marker.imc_loc.lng,
							marker.imc_loc.lat,
						]),
						icon: { ...icon.meta },
						postType: marker.type,
						markerId: marker.id,
					})
				);
			}
			return fts;
		}, []);

		// Add all features to the OpenLayers marker source and refresh the layer.
		mkSource.clear();
		mkSource.addFeatures(features);
		map.removeLayer(mkLayer);
		map.addLayer(mkLayer);
	}, [markers, markerIcons, mkSource, map, mkLayer]);

	return <MarkerPopup layer={mkLayer} />;
}
