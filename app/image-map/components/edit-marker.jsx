import { useState, useEffect } from '@wordpress/element'
import { SelectControl, TextControl } from '@wordpress/components'
import { MapContainer, ImageOverlay } from 'react-leaflet'
import { CRS } from 'leaflet';

import { useGlobalContext } from "../contexts/global"
import useSelected from '../hooks/useSelected'
import LifeCycleButtons from './lifecycle-buttons'

import cls from './edit-form.module.scss'
import useImgOverlay from '../hooks/useImgOverlay';
import MarkerIconSelect from './marker-icon-select';

/**
 * Map details form.
 *
 * @param props
 */
export default function EditMarker() {
	const { markers, dispatchMarker, layers } = useGlobalContext()

	const [marker, setMarker] = useSelected(markers, {
		status: 'publish',
		title: { raw: '' },
		imagemaps: [layers.selected],
		'marker-icons': []
	})
	const [layer] = useSelected(layers)

	const overlay = useImgOverlay(layer.meta.image)

	if (marker.title === undefined) return <div></div>

	return (
		<>
			{overlay &&
				<MapContainer
					crs={CRS.Simple}
					className={cls.map}
					bounds={layer.meta.initial_bounds}
					maxZoom={layer.meta.max_zoom}
					minZoom={layer.meta.min_zoom}
					maxBounds={overlay.bounds}
				>
					<ImageOverlay url={overlay.url} bounds={overlay.bounds} />
				</MapContainer>
			}
			<div className='col-xs-9'>
				<TextControl
					label="Name"
					value={marker.title.raw}
					onChange={val => setMarker(oldMarker => ({ ...oldMarker, title: { raw: val } }))}
					className={cls.field}
				/>
				<SelectControl
					label="Layer"
					options={layers.list.map(layer => ({ label: layer.name, value: layer.id }))}
					value={marker.imagemaps[0]}
					onChange={val => setMarker(oldMarker => ({ ...oldMarker, imagemaps: [val] }))}
					labelPosition="side"
					className={cls.field}
				/>
				<MarkerIconSelect
					label="Icon"
					value={marker['marker-icons'][0]}
					onSelect={val => {
						setMarker(oldMarker => ({
							...oldMarker, 'marker-icons': [val]
						}))
					}}
				/>
			</div>
			<div className="col-xs-3">
				<LifeCycleButtons collection={markers.wp} item={marker} dispatch={dispatchMarker} />
			</div>
		</>
	)
}
