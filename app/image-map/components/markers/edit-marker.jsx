import { BaseControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Controller, useFormContext } from 'react-hook-form';

import MarkerIconSelect from '../forms/marker-icon-select';
import RichTextEditor from '../forms/rich-text-editor';
import ImageSelector from '../forms/image-selector';
import { getControlClass, cls } from '../../utils/form-control';
import Label from '../forms/label';

/**
 * Marker details form.
 *
 * @param {Object} props
 * @param {string} props.markerType Post Type of the marker.
 * @param {string} props.title      Marker title.
 */
export default function EditMarker( { markerType, title } ) {
	// Get all post types applicable to markers.
	const postTypes = useSelect( ( select ) =>
		select( 'core' ).getPostTypes()
	);
	const { watch } = useFormContext();

	return (
		<>
			<h2>{ __( 'Edit Marker', 'flare' ) }</h2>
			<div className="col-xs-9">
				{ /* <BaseControl label={__('Layer', 'flare')} className={cls.field}>{watch('layers')}</BaseControl> */ }
				{ postTypes && markerType && (
					<BaseControl
						label={
							<Label
								name={ __( 'Type', 'flare' ) }
								tooltip={ __(
									'Post type linked to the marker, or standalone marker if not linked.',
									'flare'
								) }
							/>
						}
						className={ cls.field }
						id="no-input-to-focus-on"
					>
						{ markerType === 'marker'
							? __( 'Standalone marker', 'flare' )
							: postTypes.find( ( pt ) => pt.slug === markerType )
									?.name }
					</BaseControl>
				) }
				{ markerType !== 'marker' && (
					<BaseControl
						label={ __( 'Post', 'flare' ) }
						className={ cls.field }
						id="no-input-to-focus-on"
					>
						{ title }
					</BaseControl>
				) }
				<Controller
					name="marker-icons.0"
					rules={ { required: true } }
					render={ ( { field, fieldState } ) => (
						<MarkerIconSelect
							label={
								<Label
									name={ __( 'Icon', 'flare' ) }
									tooltip={ __(
										'Select from the icon types defined on the map.',
										'flare'
									) }
								/>
							}
							value={ field.value }
							onSelect={ field.onChange }
							onBlur={ field.onBlur }
							className={ getControlClass( fieldState ) }
						/>
					) }
				/>
				{ markerType === 'marker' && (
					<>
						<Controller
							name="title.raw"
							rules={ { required: true } }
							render={ ( { field, fieldState } ) => (
								<TextControl
									label={
										<Label
											name={ __( 'Title', 'flare' ) }
											tooltip={ __(
												'Shows in the popup when selecting the marker on the public user interface.',
												'flare'
											) }
										/>
									}
									{ ...field }
									className={ getControlClass( fieldState ) }
								/>
							) }
						/>
						<Controller
							name="excerpt.raw"
							render={ ( { field, fieldState } ) => (
								<RichTextEditor
									label={
										<Label
											name={ __( 'Content', 'flare' ) }
											tooltip={ __(
												'Shows in the popup when selecting the marker on the public user interface.',
												'flare'
											) }
										/>
									}
									{ ...field }
									className={ getControlClass( fieldState ) }
									dependencies={ [
										watch( 'id' ),
										field.onChange,
									] }
								/>
							) }
						/>
						<Controller
							name="featured_media"
							render={ ( { field, fieldState } ) => (
								<ImageSelector
									label={
										<Label
											name={ __(
												'Featured Image',
												'flare'
											) }
											tooltip={ __(
												'Shows in the popup when selecting the marker on the public user interface. Note that the image will be cropped in the popup as shown here.',
												'flare'
											) }
										/>
									}
									{ ...field }
									className={ getControlClass( fieldState ) }
								/>
							) }
						/>
					</>
				) }
			</div>
		</>
	);
}
