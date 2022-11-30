import { TextControl, Button, BaseControl, RangeControl } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'
import { MapContainer, ImageOverlay } from 'react-leaflet'
import { CRS } from 'leaflet';

import { useGlobalContext } from "../contexts/global"
import useSelected from '../hooks/useSelected'
import LifeCycleButtons from './lifecycle-buttons'

import cls from './edit-form.module.scss'
import useImgOverlay from '../hooks/useImgOverlay'
import useForceUpdate from '../hooks/useForceUpdate';
import BoundsGetter from './BoundsGetter';

/**
 * Map details form.
 *
 * @param props
 */
export default function EditLayer() {
	const { layers, dispatchLayer } = useGlobalContext()

	const [layer, setLayer] = useSelected(layers, { name: '', description: '', meta: { initial_bounds: [] } })
	const [mediaMgr, setMediaMgr] = useState()
	const overlay = useImgOverlay(layer.meta.image)

	const mapKey = useForceUpdate([layer.meta, overlay])

	// Load media manager
	useEffect(() => {
		// Create media manager
		const mm = window.wp.media({
			title: 'Select image',
			button: { text: 'Select image' },
			multiple: false,
		})
		setMediaMgr(mm)

		// Update image and set the new image ID in the layer
		function getImage() {
			const newImage = mm.state().get('selection').first()
			setLayer(oldLayer => ({
				...oldLayer,
				meta: { ...oldLayer.meta, image: newImage.attributes.id }
			}))
		}

		// Action to take when selecting an image.
		mm.on('select', getImage)

		// Unregister media manager action.
		return () => mm.off('select', getImage)
	}, [])

	if (layer.name === undefined) return <div></div>

	return (
		<>
			<div className='col-xs-9'>
				<TextControl
					label="Name"
					value={layer.name}
					onChange={val => setLayer(oldLayer => ({ ...oldLayer, name: val }))}
					className={cls.field}
				/>
				<BaseControl label='Image' className={cls.field}>
					<Button variant='secondary' onClick={() => mediaMgr.open()}>Select image</Button>
				</BaseControl>
				<RangeControl
					label="Maximum zoom"
					value={layer.meta.max_zoom}
					onChange={val => setLayer(oldLayer => ({ ...oldLayer, meta: { ...oldLayer.meta, max_zoom: val } }))}
					min="-10"
					max="2"
					className={`${cls.field} ${cls.center}`}
				/>
				<RangeControl
					label="Minimum zoom"
					value={layer.meta.min_zoom}
					onChange={val => setLayer(oldLayer => ({ ...oldLayer, meta: { ...oldLayer.meta, min_zoom: val } }))}
					min="-10"
					max="2"
					className={`${cls.field} ${cls.center}`}
				/>
				{overlay &&
					<BaseControl label="Initial position" className={`${cls.field} ${cls.start}`}>
						<MapContainer
							key={mapKey}
							crs={CRS.Simple}
							className={cls.map}
							bounds={layer.meta.initial_bounds.length ? layer.meta.initial_bounds : overlay.bounds}
							maxZoom={layer.meta.max_zoom}
							minZoom={layer.meta.min_zoom}
							maxBounds={overlay.bounds}
						>
							<BoundsGetter onChange={bounds => setLayer(oldLayer => ({
								...oldLayer,
								meta: { ...oldLayer.meta, initial_bounds: bounds }
							}))} />
							<ImageOverlay url={overlay.url} bounds={overlay.bounds} />
						</MapContainer>
					</BaseControl>
				}
			</div>
			<div className="col-xs-3">
				<LifeCycleButtons collection={layers.wp} item={layer} dispatch={dispatchLayer} />
			</div>
		</>
	)
}
