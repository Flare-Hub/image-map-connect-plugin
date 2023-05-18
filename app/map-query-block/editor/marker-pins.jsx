import { useEffect, useMemo } from "@wordpress/element"
import { useSelect } from "@wordpress/data"
import { useMap } from "common/components/ol/context"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Fill, Style, Text } from "ol/style"
import { Feature } from "ol"
import { Point } from "ol/geom"

import remixMap from "common/remix-unicode.json"

import "remixicon/fonts/remixicon.css"

/**
 * Add markers in query to map.
 *
 * @param {object} props
 * @param {number} props.mapId The Id of the selected map.
 * @param {number} props.markers List of WordPress markers.
 */
export default function MarkerPins({ mapId, markers }) {
	/** Icon settings for the selected map. */
	const markerIcons = useSelect(select => select('core')
		.getEntityRecords('taxonomy', 'marker-icon', { map: mapId }), [])

	/** Vector source containing the marker features. */
	const mkSource = useMemo(() => new VectorSource(), [])

	/** Vector layer containing the marker features. */
	const mkLayer = useMemo(() => new VectorLayer({
		source: mkSource,
		style: (feature) => {
			// Icon settings are passed to the feature below.
			const icon = feature.get('icon')
			return new Style({
				text: new Text({
					// Display marker icons using remix icon font characters.
					font: icon.size + "px remixicon",
					text: String.fromCharCode(parseInt(remixMap[icon.img.ref], 16)),
					fill: new Fill({ color: icon.colour }),
					offsetX: (0.5 - icon.img.iconAnchor.x) * icon.size,
					offsetY: (0.5 - icon.img.iconAnchor.y) * icon.size,
				})
			})
		},
	}), [])

	const { map } = useMap()

	// Create a point feature for each marker and add it to the map.
	useEffect(() => {
		if (!markerIcons || !markers) return

		// Create list of features from the list of markers, skipping the ones without an icon.
		const features = markers.reduce((fts, marker) => {
			const icon = markerIcons.find(mi => mi.id === marker['marker-icons'][0])
			if (icon) {
				fts.push(new Feature({
					geometry: new Point([marker.flare_loc.lng, marker.flare_loc.lat]),
					icon: { ...icon.meta }
				}))
			}
			return fts
		}, [])

		// Add all features to the OpenLayers marker source and refresh the layer.
		mkSource.clear()
		mkSource.addFeatures(features)
		map.removeLayer(mkLayer)
		map.addLayer(mkLayer)
	}, [markers, markerIcons])

	return null
}
