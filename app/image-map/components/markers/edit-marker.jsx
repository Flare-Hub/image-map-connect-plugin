import { BaseControl, TextControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Controller, useFormContext } from 'react-hook-form';

import MarkerIconSelect from '../forms/marker-icon-select';
import RichTextEditor from '../forms/rich-text-editor';
import ImageSelector from '../forms/image-selector';
import { getControlClass, cls } from '../../utils/form-control';

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {string} props.markerType
 * @param {string} props.title
 * @param {Object<string, any>} props.layers
 */
export default function EditMarker({ markerType, title }) {
	// Get all post types applicable to markers.
	const postTypes = useSelect(select => select('core').getPostTypes())
	const { watch } = useFormContext()

	return (
		<div className="col-xs-9">
			{/* <BaseControl label={__('Layer', 'flare')} className={cls.field}>{watch('layers')}</BaseControl> */}
			{postTypes && markerType && (
				<BaseControl label={__('Type', 'flare')} className={cls.field}>
					{markerType === 'marker'
						? __('Standalone marker', 'flare')
						: postTypes.find(pt => pt.slug === markerType)?.name}
				</BaseControl>
			)}
			{markerType !== 'marker' && (
				<BaseControl label={__('Post', 'flare')} className={cls.field}>{title}</BaseControl>
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
								dependencies={[watch('id'), field.onChange]}
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
	)
}
