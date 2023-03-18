import ImgLayer from 'ol/layer/Image'
import Static from 'ol/source/ImageStatic'
import Projection from 'ol/proj/Projection'
import { View } from 'ol'

/**
 * Get boundaries of a layer
 *
 * @param {Object<string, any>} layer WordPress layer.
 */
function getExtent(layer) {
	return [
		0,
		0,
		layer._embedded['flare:image'][0].media_details.width,
		layer._embedded['flare:image'][0].media_details.height
	]

}

/**
 * Create coordinate system to use.
 *
 * @param {Object<string, any>} layer WordPress layer.
 **/
export function createProjection(layer) {
	return new Projection({
		code: 'layer-image',
		units: 'pixels',
		extent: getExtent(layer),
	})
}

/**
 * Create a new static source based on the new image url.
 *
 * @param {Object<string, any>} layer WordPress layer.
 * @param {Projection} projection OpenLayer coordinate system.
 **/
export function createSource(layer, projection) {
	return new Static({
		url: layer._embedded['flare:image'][0].source_url,
		projection,
		imageExtent: projection.getExtent(),
	})
}

/**
 * Create image layer.
 *
 * @param {Object<string, any>} layer WordPress layer.
 * @param {Projection} projection OpenLayer coordinate system.
 */
export function createImgLayer(layer, projection, visible = true) {
	return new ImgLayer({
		source: createSource(layer, projection),
		title: layer.name,
		baseLayer: true,
		visible
	})
}

/**
 *
 */
export function createView(layer, projection) {
	const extent = getExtent(layer)

	return new View({
		center: layer.meta.initial_position.center ?? getCenter(extent),
		zoom: layer.meta.initial_position.zoom ?? layer.meta.min_zoom,
		minZoom: layer.meta.min_zoom,
		maxZoom: layer.meta.max_zoom,
		projection,
		extent,
		constrainOnlyCenter: true,
	})
}
