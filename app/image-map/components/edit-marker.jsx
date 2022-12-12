import { BaseControl, TextControl, Card, CardBody, CardDivider } from '@wordpress/components'

import useSelected from '../hooks/useSelected'
import { useMarker } from '../contexts/marker';
import { wpLayers } from './layers';
import LifeCycleButtons from './lifecycle-buttons'
import MarkerIconSelect from './marker-icon-select';

import cls from './edit-form.module.scss'
import ButtonSelector from './button-selector';

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../hooks/useCollection').WpIdentifiers} props.markers
 * @param {import('../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditMarker({ markers, dispatch }) {
	const [layer] = useSelected(wpLayers, { _fields: 'id,name,meta' })

	const [marker, setMarker] = useMarker()

	if (marker.title === undefined) return <div></div>

	return (
		<Card>
			<CardBody>
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
					<ButtonSelector
						label="Type"
						items={[
							{ value: 'standalone', label: 'Standalone' },
							{ value: 'linked', label: 'Linked' }
						]}
						selected={marker.meta.type}
						onClick={type => setMarker(oldMarker => ({
							...oldMarker, meta: { ...oldMarker.meta, type }
						}))}
					/>
					<CardDivider />
				</div>
				<div className="col-xs-3">
					<LifeCycleButtons identifiers={markers} item={marker} dispatch={dispatch} />
				</div>
			</CardBody>
		</Card>
	)
}
