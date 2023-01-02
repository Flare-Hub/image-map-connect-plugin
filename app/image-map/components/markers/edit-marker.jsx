import { BaseControl, TextControl, Card, CardBody, CardDivider } from '@wordpress/components'
import { useMemo } from '@wordpress/element'

import useSelected from '../../hooks/useSelected'
import useCollection from '../../hooks/useCollection';
import { useMarker } from '../../contexts/marker';
import { wpLayers } from '../layers';
import LifeCycleButtons from '../forms/lifecycle-buttons'
import MarkerIconSelect from '../forms/marker-icon-select';
import RichTextEditor from '../forms/rich-text-editor';
import ImageSelector from '../forms/image-selector';

import cls from '../forms/edit-form.module.scss'

const typesQuery = {}

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.markers
 * @param {import('../../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditMarker({ markers, dispatch }) {
	const [layer] = useSelected(wpLayers, { _fields: 'id,name' })

	const [marker, setMarker] = useMarker()

	const [postTypes] = useCollection({ endpoint: 'types' }, typesQuery, {})

	if (marker.title === undefined) return <div></div>

	return (
		<Card>
			<CardBody>
				<div className="col-xs-9">
					<BaseControl label="Layer" className={cls.field}>{layer.name}</BaseControl>
					{postTypes.list && marker && (
						<BaseControl label="Type" className={cls.field}>
							{marker.type === 'marker' ? 'Standalone marker' : postTypes.list[marker.type].name}
						</BaseControl>
					)}
					<MarkerIconSelect
						label="Icon"
						value={marker['marker-icons'][0]}
						onSelect={val => {
							setMarker(oldMarker => ({
								...oldMarker, 'marker-icons': [val]
							}))
						}}
					/>
					<TextControl
						label="Name"
						value={marker.title.raw}
						onChange={val => setMarker(oldMarker => ({ ...oldMarker, title: { raw: val } }))}
						className={cls.field}
					/>
					{marker.type === 'marker' && (
						<>
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
