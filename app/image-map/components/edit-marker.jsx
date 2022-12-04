import { useState, useEffect } from '@wordpress/element'
import { SelectControl, TextControl } from '@wordpress/components'

import useSelected from '../hooks/useSelected'
import useCollection from '../hooks/useCollection';
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
	const [layers] = useCollection(wpLayers, { parent: query.map }, { list: [] })

	const [layer] = useSelected(wpLayers)

	const [marker, setMarker] = useSelected(markers, {
		status: 'publish',
		title: { raw: '' },
		imagemaps: [query[markers.parent]],
		'marker-icons': []
	})

	if (marker.title === undefined) return <div></div>

	return (
		<>
			<ImageMap layer={layer} className={cls.map} />
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
				<LifeCycleButtons identifiers={markers} item={marker} dispatch={dispatch} />
			</div>
		</>
	)
}
