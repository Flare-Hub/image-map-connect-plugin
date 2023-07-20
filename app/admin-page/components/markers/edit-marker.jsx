import { BaseControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { Controller, useFormContext } from 'react-hook-form';

import MarkerIconSelect from '../forms/marker-icon-select';
import RichTextEditor from '../forms/rich-text-editor';
import ImageSelector from '../forms/image-selector';
import { getControlClass, cls } from '../../utils/form-control';
import Label from '../forms/label';
import { useRouter } from '../../contexts/router';

/**
 * Marker details form.
 *
 * @param {Object}                     props
 * @param {string}                     props.markerType Post Type of the marker.
 * @param {string}                     props.title      Marker title.
 * @param {Array<Object<string, any>>} props.icons      Icon types for the map.
 */
export default function EditMarker({ markerType, title, icons }) {
	// Get all post types applicable to markers.
	const postTypes = useSelect((select) => select('core').getPostTypes());
	const { watch } = useFormContext();
	const { query } = useRouter();

	const placeMarkerRef = useRef(
		'place-marker-' + Math.floor(Math.random() * 100000000)
	);

	return (
		<>
			<h2>
				{query.marker === 'new'
					? __('Add Marker', 'flare-imc')
					: __('Edit Marker', 'flare-imc')}
			</h2>
			<div className="col-xs-9">
				{/* <BaseControl label={__('Layer', 'flare-imc')} className={cls.field}>{watch('imc_layers')}</BaseControl> */}
				{postTypes && markerType && (
					<BaseControl
						label={
							<Label
								name={__('Type', 'flare-imc')}
								tooltip={__(
									'Post type linked to the marker, or standalone marker if not linked.',
									'flare-imc'
								)}
							/>
						}
						className={cls.field}
						id="no-input-to-focus-on"
					>
						{markerType === 'imc-marker'
							? __('Standalone marker', 'flare-imc')
							: postTypes.find((pt) => pt.slug === markerType)
									?.name}
					</BaseControl>
				)}
				<BaseControl
					className={cls.field}
					label={
						<Label
							name={__('Marker placement', 'flare-imc')}
							tooltip={__(
								'Marker position can be updated at any time.',
								'flare-imc'
							)}
						/>
					}
					id={placeMarkerRef}
				>
					<div id={placeMarkerRef}>
						{watch('imc_loc.lat')
							? __(
									"Drag the marker to change it's position.",
									'flare-imc'
							  )
							: __(
									'Click on the image to set the location of the marker',
									'flare-imc'
							  )}
					</div>
				</BaseControl>
				{markerType !== 'imc-marker' && (
					<BaseControl
						label={
							<Label
								name={__('Title', 'flare-imc')}
								tooltip={__(
									'Post title, can be shown in the popup when selecting a marker on the public user interface.',
									'flare-imc'
								)}
							/>
						}
						className={cls.field}
						id="no-input-to-focus-on"
					>
						{title}
					</BaseControl>
				)}
				<Controller
					name="imc_icons.0"
					rules={{ required: true }}
					render={({ field, fieldState }) => (
						<MarkerIconSelect
							label={
								<Label
									name={__('Icon', 'flare-imc')}
									tooltip={__(
										'Select from the icon types defined on the map.',
										'flare-imc'
									)}
								/>
							}
							value={field.value}
							onSelect={field.onChange}
							onBlur={field.onBlur}
							icons={icons}
							className={getControlClass(fieldState)}
						/>
					)}
				/>
				{markerType === 'imc-marker' && (
					<>
						<Controller
							name="title.raw"
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<TextControl
									label={
										<Label
											name={__('Title')}
											tooltip={__(
												'Can be shown in the popup when selecting a marker on the public user interface.',
												'flare-imc'
											)}
										/>
									}
									{...field}
									className={getControlClass(fieldState)}
								/>
							)}
						/>
						<Controller
							name="excerpt.raw"
							render={({ field, fieldState }) => (
								<RichTextEditor
									label={
										<Label
											name={__('Content', 'flare-imc')}
											tooltip={__(
												'Can be shown in the popup when selecting the marker on the public user interface.',
												'flare-imc'
											)}
										/>
									}
									{...field}
									className={getControlClass(fieldState)}
									dependencies={[watch('id'), field.onChange]}
								/>
							)}
						/>
						<Controller
							name="featured_media"
							render={({ field, fieldState }) => (
								<ImageSelector
									label={
										<Label
											name={__(
												'Featured Image',
												'flare-imc'
											)}
											tooltip={__(
												'Can be shown in the popup when selecting a marker on the public user interface.',
												'flare-imc'
											)}
										/>
									}
									{...field}
									className={getControlClass(fieldState)}
								/>
							)}
						/>
					</>
				)}
			</div>
		</>
	);
}
