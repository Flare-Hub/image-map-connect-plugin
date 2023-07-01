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
 * @param {Object}                     props
 * @param {string}                     props.markerType Post Type of the marker.
 * @param {string}                     props.title      Marker title.
 * @param {Array<Object<string, any>>} props.icons      Icon types for the map.
 */
export default function EditMarker( { markerType, title, icons } ) {
	// Get all post types applicable to markers.
	const postTypes = useSelect( ( select ) =>
		select( 'core' ).getPostTypes()
	);
	const { watch } = useFormContext();

	return (
		<>
			<h2>{ __( 'Edit Marker', 'flare-imc' ) }</h2>
			<div className="col-xs-9">
				{ /* <BaseControl label={__('Layer', 'flare-imc')} className={cls.field}>{watch('imc_layers')}</BaseControl> */ }
				{ postTypes && markerType && (
					<BaseControl
						label={
							<Label
								name={ __( 'Type', 'flare-imc' ) }
								tooltip={ __(
									'Post type linked to the marker, or standalone marker if not linked.',
									'flare-imc'
								) }
							/>
						}
						className={ cls.field }
						id="no-input-to-focus-on"
					>
						{ markerType === 'imc-marker'
							? __( 'Standalone marker', 'flare-imc' )
							: postTypes.find( ( pt ) => pt.slug === markerType )
									?.name }
					</BaseControl>
				) }
				{ markerType !== 'imc-marker' && (
					<BaseControl
						label={ __( 'Post', 'flare-imc' ) }
						className={ cls.field }
						id="no-input-to-focus-on"
					>
						{ title }
					</BaseControl>
				) }
				<Controller
					name="imc_icons.0"
					rules={ { required: true } }
					render={ ( { field, fieldState } ) => (
						<MarkerIconSelect
							label={
								<Label
									name={ __( 'Icon', 'flare-imc' ) }
									tooltip={ __(
										'Select from the icon types defined on the map.',
										'flare-imc'
									) }
								/>
							}
							value={ field.value }
							onSelect={ field.onChange }
							onBlur={ field.onBlur }
							icons={ icons }
							className={ getControlClass( fieldState ) }
						/>
					) }
				/>
				{ markerType === 'imc-marker' && (
					<>
						<Controller
							name="title.raw"
							rules={ { required: true } }
							render={ ( { field, fieldState } ) => (
								<TextControl
									label={
										<Label
											name={ __( 'Title', 'flare-imc' ) }
											tooltip={ __(
												'Shows in the popup when selecting the marker on the public user interface.',
												'flare-imc'
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
											name={ __(
												'Content',
												'flare-imc'
											) }
											tooltip={ __(
												'Shows in the popup when selecting the marker on the public user interface.',
												'flare-imc'
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
												'flare-imc'
											) }
											tooltip={ __(
												'Shows in the popup when selecting the marker on the public user interface. Note that the image will be cropped in the popup as shown here.',
												'flare-imc'
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
