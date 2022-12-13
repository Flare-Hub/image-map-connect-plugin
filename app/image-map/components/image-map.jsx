import { useRef, useEffect, useMemo, useState } from '@wordpress/element'
import { Map, View } from 'ol'
import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic'; import { getCenter } from 'ol/extent'

import 'ol/ol.css'
import cls from './image-map.module.scss'

/**
 * Map with image overlay.
 *
 * @param {object} props
 * @param {object} props.layer The layer to display in the map.
 * @param {object} props.className Class for the map container.
 */
export default function ImageMap({ layer, className, children }) {
	const mapTarget = useRef()

	const layerExtent = [
		0,
		0,
		layer._embedded['flare:image'][0].media_details.width,
		layer._embedded['flare:image'][0].media_details.height,
	]

	const projection = new Projection({
		code: 'layer-image',
		units: 'pixels',
		extent: layerExtent,
	});

	function refreshSource() {
		return new Static({
			url: layer._embedded['flare:image'][0].source_url,
			projection,
			imageExtent: layerExtent,
		})
	}

	const [source, setSource] = useState(refreshSource())

	function refreshLayer() {
		return new ImageLayer({ source })
	}

	const [imgLayer, setImgLayer] = useState(refreshLayer())

	const map = useMemo(() => {
		if (!layer) return null

		return new Map({
			view: new View({
				center: getCenter(layerExtent),
				zoom: 1,
				minZoom: layer.meta.min_zoom,
				maxZoom: layer.meta.max_zoom,
				projection,
				extent: layerExtent,
				constrainOnlyCenter: true,
			}),
			layers: [imgLayer]
		})
	}, [layer.id])

	useEffect(() => {
		if (!map) return
		map.setTarget(mapTarget.current)

	}, [layer.id])

	useEffect(() => {
		const newSource = refreshSource()
		console.log(newSource)
		imgLayer.setSource(newSource)
		setSource(newSource)
	}, [layer.meta.image])

	return (
		<div className={`${className} ${cls.map}`} ref={mapTarget} />
	)
}
