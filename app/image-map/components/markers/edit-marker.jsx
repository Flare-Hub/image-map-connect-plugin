import { BaseControl, TextControl, Card, CardBody, CardDivider } from '@wordpress/components'

import useSelected from '../../hooks/useSelected'
import { useMarker } from '../../contexts/marker';
import { wpLayers } from '../layers';
import LifeCycleButtons from '../forms/lifecycle-buttons'
import MarkerIconSelect from '../forms/marker-icon-select';
import ButtonSelector from '../forms/button-selector';
import RichTextEditor from '../forms/rich-text-editor';

import cls from '../forms/edit-form.module.scss'
import ImageSelector from '../forms/image-selector';

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.markers
 * @param {import('../../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditMarker({ markers, dispatch }) {
	const [layer] = useSelected(wpLayers, { _fields: 'id,name,meta' })

	const [marker, setMarker] = useMarker()

	if (marker.title === undefined) return <div></div>

	return (
		<Card>
			<CardBody>
				<div className="col-xs-9">
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
					<div className={cls.spacer} />
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
					<CardDivider className={cls.divider} />
					{marker.meta.type === 'standalone' && (
						<>
							<TextControl
								label="Title"
								value={marker.meta.popup_title}
								onChange={val => setMarker(oldMarker => ({
									...oldMarker,
									meta: { ...oldMarker.meta, popup_title: val }
								}))}
								className={cls.field}
							/>
							<RichTextEditor
								label="Content"
								content={marker.excerpt.raw}
								onChange={content => setMarker(oldMarker => ({
									...oldMarker, excerpt: { raw: content }
								}))}
							/>
							<ImageSelector
								label='Featured Image'
								imageId={marker.featured_media}
								onSelect={img => setMarker(oldMarker => ({ ...oldMarker, featured_media: img }))}
							/>
						</>
					)}
				</div>
				<div className="col-xs-3">
					<LifeCycleButtons identifiers={markers} item={marker} dispatch={dispatch} />
				</div>
			</CardBody>
		</Card>
	)
}
