import { useState, useEffect } from '@wordpress/element'
import { BaseControl, TextControl } from '@wordpress/components'

import useSelected from '../hooks/useSelected'
import { useRouter } from '../contexts/router';
import { wpLayers } from './layers';
import LifeCycleButtons from './lifecycle-buttons'
import MarkerIconSelect from './marker-icon-select';
import ImageMap from './image-map';

import cls from './edit-form.module.scss'

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../hooks/useCollection').WpIdentifiers} props.markers
 * @param {import('../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditMarker({ markers, dispatch }) {
	const { query } = useRouter()

	const [layer] = useSelected(wpLayers, { _fields: 'id,name,meta' })

	const [marker, setMarker] = useSelected(
		markers,
		{ context: 'edit' },
		{
			status: 'publish',
			title: { raw: '' },
			imagemaps: [query[markers.parent]],
			'marker-icons': []
		}
	)

	if (marker.title === undefined) return <div></div>

	return (
		<>
			<ImageMap layer={layer} className={cls.map} />
			<div className='col-xs-9'>
				<BaseControl label="Layer" className={cls.field}>{layer.name}</BaseControl>
				<TextControl
					label="Name"
					value={marker.title.raw}
					onChange={val => setMarker(oldMarker => ({ ...oldMarker, title: { raw: val } }))}
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
				<LifeCycleButtons identifiers={markers} item={marker} dispatch={dispatch} />
			</div>
		</>
	)
}
