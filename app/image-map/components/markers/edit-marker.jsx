import { BaseControl, TextControl, Card, CardBody, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n';
import { Controller, useFormContext } from 'react-hook-form';

import { useRouter } from '../../contexts/router';
import MarkerIconSelect from '../forms/marker-icon-select';
import RichTextEditor from '../forms/rich-text-editor';
import ImageSelector from '../forms/image-selector';
import { getControlClass, cls } from '../../utils/form-control';
import { wpMarkers } from '.';
import MarkerLifecycle from './marker-lifecycle';

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../../hooks/useCollection').Actions} props.actions
 * @param {Object<string, any>} props.layer
 * @param {Array.<Object<string, unknown>>} props.postTypes
 */
export default function EditMarker({ actions, layer, postTypes }) {
	const { query } = useRouter()
	const { watch } = useFormContext()

	const markerType = watch('type')
	const markerId = watch('id')

	return (
		<Card className="full-height">
			{(!isNaN(query[wpMarkers.model]) && !markerId) && <Spinner style={{ width: '100px', height: '100px' }} />}
			{(query[wpMarkers.model] === 'new' || markerId) && (
				<CardBody>
					<div className="col-xs-9">
						<BaseControl label={__('Layer', 'flare')} className={cls.field}>{layer.name}</BaseControl>
						{postTypes && markerType && (
							<BaseControl label={__('Type', 'flare')} className={cls.field}>
								{markerType === 'marker' ? 'Standalone marker' : postTypes[markerType].name}
							</BaseControl>
						)}
						{markerType !== 'marker' && (
							<BaseControl label={__('Post', 'flare')} className={cls.field}>{watch('title.raw')}</BaseControl>
						)}
						<Controller
							name='marker-icons.0'
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<MarkerIconSelect
									label={__('Icon', 'flare')}
									value={field.value}
									onSelect={field.onChange}
									onBlur={field.onBlur}
									className={getControlClass(fieldState)}
								/>
							)}
						/>
						{markerType === 'marker' && (
							<>
								<Controller
									name='title.raw'
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<TextControl
											label={__('Title', 'flare')}
											{...field}
											className={getControlClass(fieldState)}
										/>
									)}
								/>
								<Controller
									name='excerpt.raw'
									render={({ field, fieldState }) => (
										<RichTextEditor
											label={__('Content', 'flare')}
											{...field}
											className={getControlClass(fieldState)}
										/>
									)}
								/>
								<Controller
									name='featured_media'
									render={({ field, fieldState }) => (
										<ImageSelector
											label={__('Featured Image', 'flare')}
											{...field}
											className={getControlClass(fieldState)}
										/>
									)}
								/>
							</>
						)}
					</div>
					<div className="col-xs-3">
						<MarkerLifecycle actions={actions} />
					</div>
				</CardBody>
			)}
		</Card>
	)
}
