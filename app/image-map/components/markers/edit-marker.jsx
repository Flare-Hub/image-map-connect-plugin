import { BaseControl, TextControl, Card, CardBody, Spinner } from '@wordpress/components'

import { useMarker } from '../../contexts/marker';
import LifeCycleButtons from '../forms/lifecycle-buttons'
import MarkerIconSelect from '../forms/marker-icon-select';
import RichTextEditor from '../forms/rich-text-editor';
import ImageSelector from '../forms/image-selector';
import { wpMarkers } from '.';

import cls from '../forms/edit-form.module.scss'

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../../hooks/useCollection').Actions} props.actions
 * @param {Object<string, any>} props.layer
 */
export default function EditMarker({ actions, layer }) {
	const { marker, setMarker, loadStatus, postTypes } = useMarker()

	function onSave(data) {
		const mapId = actions.save(data)
		if (query[wpMarkers.model] === 'new') navigate({ [wpMarkers.model]: mapId })
	}

	function onDelete() {
		actions.delete(query[wpMarkers.model])
		navigate({ [wpMarkers.model]: undefined })
	}

	return (
		<Card className="full-height">
			{loadStatus === 'loading' && <Spinner style={{ width: '100px', height: '100px' }} />}
			{(loadStatus === 'new' || loadStatus === 'loaded') && (
				<CardBody>
					<div className="col-xs-9">
						<BaseControl label="Layer" className={cls.field}>{layer.name}</BaseControl>
						{postTypes && marker && (
							<BaseControl label="Type" className={cls.field}>
								{marker.type === 'marker' ? 'Standalone marker' : postTypes[marker.type].name}
							</BaseControl>
						)}
						{marker.type !== 'marker' && (
							<BaseControl label="Post" className={cls.field}>{marker.title.raw}</BaseControl>
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
						{marker.type === 'marker' && (
							<>
								<TextControl
									label="Title"
									value={marker.title.raw}
									onChange={val => setMarker(oldMarker => ({ ...oldMarker, title: { raw: val } }))}
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
						<LifeCycleButtons onSave={onSave} onDelete={onDelete} />
					</div>
				</CardBody>
			)}
		</Card>
	)
}
