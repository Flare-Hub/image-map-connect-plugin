import {
	TextControl,
	BaseControl,
	Card,
	CardBody,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { Controller, useForm } from 'react-hook-form';

import { useRouter } from '../../contexts/router';
import { getControlClass, cls } from '../../utils/form-control';
import useRecord from '../../hooks/useRecord';
import OlMap from 'common/components/ol/map';
import ImageLayer from 'common/components/ol/image-layer';
import Form from '../forms/form';
import LifeCycleButtons from '../forms/lifecycle-buttons';
import SelectImage from './select-image';
import Label from '../forms/label';
import RangeSlider from '../forms/range-slider';

import mapCls from '../map.module.scss';

/** @typedef {import('./index').ImageSize} ImageSize */

/**
 * Map details form.
 *
 * @param {Object}    props
 * @param {ImageSize} props.imgSize
 */
export default function EditLayer({ imgSize }) {
	const { query } = useRouter();

	const emptyLayer = useMemo(
		() => ({
			name: '',
			description: '',
			meta: { initial_bounds: [], zoom: { min: 1, max: 2 } },
			map: +query.map,
		}),
		[query.map]
	);

	// Fetch selected layer from Wordpress.
	const {
		record: layer,
		status,
		saveRecord: saveLayer,
		delRecord: delLayer,
	} = useRecord(
		query.layer,
		'taxonomy',
		'imc-layer',
		{ _fields: 'id,name,meta,image_source' },
		emptyLayer
	);

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		defaultValues: layer,
	});

	// Reset form validator when a new layer has been fetched or layer map is saved.
	useEffect(() => {
		if (
			status === 'new' ||
			status === 'loaded' ||
			form.formState.isSubmitSuccessful
		) {
			form.reset(layer);
		}
	}, [status, form.formState.isSubmitSuccessful, form, layer]);

	// Latest selected zoom level
	const [zoomLevel, setZoomLevel] = useState();

	// Define ids to map the base controls to.
	const imgId = useRef('img-' + Math.floor(Math.random() * 100000000));
	const mapDivId = useRef('map-' + Math.floor(Math.random() * 100000000));

	return (
		<Card className="full-height">
			<CardBody>
				{status === 'none' && (
					<h3>
						{__(
							'Select a layer from the list or add a new one.',
							'image-map-connect'
						)}
					</h3>
				)}
				{status === 'loading' && (
					<Spinner style={{ width: '100px', height: '100px' }} />
				)}
				{(status === 'new' || status === 'loaded') && (
					<Form form={form}>
						<h2>
							{query.layer === 'new'
								? __('Add Layer', 'image-map-connect')
								: __('Edit Layer', 'image-map-connect')}
						</h2>
						<div className="col-xs-9">
							<Controller
								name="name"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<TextControl
										label={
											<Label
												name={__(
													'Name',
													'image-map-connect'
												)}
												tooltip={__(
													'If the map has multiple layers, this name will show for the users in the layer selector.',
													'image-map-connect'
												)}
											/>
										}
										{...field}
										className={getControlClass(fieldState)}
									/>
								)}
							/>
							<Controller
								name="meta.image"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<BaseControl
										label={
											<Label
												name={__(
													'Image',
													'image-map-connect'
												)}
												tooltip={__(
													'If the map has multiple layers, make sure all the layer images are the same size.',
													'image-map-connect'
												)}
											/>
										}
										className={cls.field}
										id={imgId.current}
									>
										<SelectImage
											onChange={field.onChange}
											invalid={fieldState.invalid}
											id={imgId.current}
											matchSize={imgSize}
										/>
									</BaseControl>
								)}
							/>
							<Controller
								name="meta.zoom"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<RangeSlider
										baseClass={getControlClass(fieldState)}
										label={
											<Label
												name={__(
													'Zoom range',
													'image-map-connect'
												)}
												tooltip={
													<>
														{__(
															'The zoom range defines the amount you can zoom in and out on the image.',
															'image-map-connect'
														)}
														<br />
														{__(
															'The initial zoom level, will be set in each block where this map is used, along with the center.',
															'image-map-connect'
														)}
													</>
												}
											/>
										}
										min={0}
										max={10}
										allowCross={false}
										value={{
											low: field.value.min,
											high: field.value.max,
										}}
										onChange={(val) => {
											field.onChange({
												min: val.low ?? field.value.min,
												max:
													val.high ?? field.value.max,
											});
											setZoomLevel(Object.values(val)[0]);
										}}
										onBlur={field.onBlur}
										ref={field.ref}
									/>
								)}
							/>
							<BaseControl
								label={
									<Label
										name={__(
											'Preview',
											'image-map-connect'
										)}
										tooltip={
											<>
												{__(
													'You can pan and zoom the image preview to validate the current settings.',
													'image-map-connect'
												)}
												<br />
												{__(
													'When you change the minimum or maximum zoom, this preview will automatically update.',
													'image-map-connect'
												)}
											</>
										}
									/>
								}
								className={`${cls.field} ${cls.map}`}
								id={mapDivId.current}
							>
								<OlMap
									className={`${cls.border} ${cls.input} ${mapCls.canvas}`}
									id={mapDivId.current}
								>
									<ImageLayer
										layer={form.watch()}
										watchZoom={zoomLevel}
									/>
								</OlMap>
							</BaseControl>
						</div>
						<div className="col-xs-3">
							<LifeCycleButtons
								model="layer"
								id={query.layer}
								onSave={saveLayer}
								onDelete={delLayer}
								confirmDeleteText={__(
									'Are you sure you want to delete this layer?'
								)}
							/>
						</div>
					</Form>
				)}
			</CardBody>
		</Card>
	);
}
