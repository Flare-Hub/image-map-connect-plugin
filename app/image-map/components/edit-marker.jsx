import { useState, useEffect } from '@wordpress/element'
import { SelectControl } from '@wordpress/components'
import { MapContainer, ImageOverlay } from 'react-leaflet'
import { CRS } from 'leaflet';

import { useGlobalContext } from "../contexts/global"
import useSelected from '../hooks/useSelected'
import LifeCycleButtons from './lifecycle-buttons'

import cls from './edit-form.module.scss'
import useImgOverlay from '../hooks/useImgOverlay';

/**
 * Map details form.
 *
 * @param props
 */
export default function EditMarker() {
	const { markers, dispatchMarker, layers } = useGlobalContext()

	const [marker, setMarker] = useSelected(markers, { title: '', description: '' })
	const [layer] = useSelected(layers)

	const overlay = useImgOverlay(layer.meta.image)

	if (marker.title === undefined) return <div></div>

	return (
		<>
			{overlay &&
				<MapContainer
					crs={CRS.Simple}
					className={cls.map}
					center={overlay.center}
					bounds={overlay.bounds}
					maxZoom={layer.meta.max_zoom}
					minZoom={layer.meta.min_zoom}
					maxBounds={overlay.bounds}
				>
					<ImageOverlay url={overlay.url} bounds={overlay.bounds} />
				</MapContainer>
			}
			<div className='col-xs-9'>
				<SelectControl
					label="Layer"
					options={layers.list.map(layer => ({ label: layer.name, value: layer.id }))}
					value={marker.imagemaps[0]}
					onChange={val => setMarker(oldMarker => ({ ...oldMarker, imagemaps: [val] }))}
					labelPosition="side"
					className={cls.field}
				/>
			</div>
			<div className="col-xs-3">
				<LifeCycleButtons collection={markers.wp} item={marker} dispatch={dispatchMarker} />
			</div>
		</>
	)
}
