import {
	TextControl,
	Card,
	CardBody,
	Spinner,
	BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useForm, Controller } from 'react-hook-form';

import { useRouter } from '../../contexts/router';
import { cls, getControlClass } from '../../utils/form-control';
import useRecord from '../../hooks/useRecord';
import PostTypesSelect from '../forms/post-types-select';
import MarkerIconList from './marker-icon-list';
import LifeCycleButtons from '../forms/lifecycle-buttons';
import Label from '../forms/label';
import Form from '../forms/form';

/** Default values for a new map. */
const EMPTY_MAP = {
	title: { raw: '' },
	excerpt: { raw: '' },
	meta: { post_types: [] },
	icon_details: [],
	status: 'publish',
};

/** Map details form. */
export default function EditMap() {
	const { query } = useRouter();

	// Get map from WordPress.
	const {
		record: map,
		status: mapStatus,
		saveRecord: saveMap,
		delRecord: deleteMap,
	} = useRecord(
		query.map,
		'postType',
		'imc-map',
		{ _fields: 'id,title,excerpt,meta,icon_details,status' },
		EMPTY_MAP
	);

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		defaultValues: map,
	});

	const { isSubmitSuccessful, errors } = form.formState;

	// Reset form validator when a new map has been fetched or the map is saved.
	useEffect(() => {
		if (
			mapStatus === 'new' ||
			mapStatus === 'loaded' ||
			isSubmitSuccessful
		) {
			form.reset(map);
		}
	}, [form, isSubmitSuccessful, map, mapStatus]);

	// generate IDs for the base controls
	const postTypesId = useRef(
		'post-types-' + Math.floor(Math.random() * 100000000)
	);

	return (
		<Card className="full-height">
			<CardBody>
				{mapStatus === 'none' && (
					<h3>
						{__(
							'Select a map from the list or add a new one.',
							'image-map-connect'
						)}
					</h3>
				)}
				{mapStatus === 'loading' && (
					<Spinner style={{ width: '100px', height: '100px' }} />
				)}
				{(mapStatus === 'new' || mapStatus === 'loaded') && (
					<Form form={form}>
						<h2>
							{query.map === 'new'
								? __('Add Map', 'image-map-connect')
								: __('Edit Map', 'image-map-connect')}
						</h2>
						<div className="col-xs-9">
							<Controller
								name="title.raw"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<TextControl
										label={
											<Label
												name={__(
													'Map name',
													'image-map-connect'
												)}
												tooltip={__(
													'Used for internal clarification only.',
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
								name="excerpt.raw"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<TextControl
										label={
											<Label
												name={__(
													'Description',
													'image-map-connect'
												)}
												tooltip={__(
													'Used for internal clarification only.',
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
								name="meta.post_types"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<BaseControl
										label={
											<Label
												name={__(
													'Post Types',
													'image-map-connect'
												)}
												tooltip={__(
													'Select the types of posts that can be referenced on this image map.',
													'image-map-connect'
												)}
											/>
										}
										className={getControlClass(fieldState)}
										id={postTypesId.current}
									>
										<PostTypesSelect
											selected={field.value}
											onSelect={field.onChange}
											onBlur={field.onBlur}
											inputClass={cls.input}
											ref={field.ref}
											id={postTypesId.current}
										/>
									</BaseControl>
								)}
							/>
							<BaseControl
								label={
									<Label
										name={__(
											'Icon types',
											'image-map-connect'
										)}
										tooltip={__(
											'Icon options for each marker on the map.',
											'image-map-connect'
										)}
									/>
								}
								className={getControlClass({
									invalid:
										errors.icon_details &&
										errors.icon_details.root,
								})}
								id="no-input-to-focus-on"
							>
								<MarkerIconList name={'icon_details'} />
							</BaseControl>
						</div>
						<div className="col-xs-3">
							<LifeCycleButtons
								model="map"
								id={query.map}
								onSave={saveMap}
								onDelete={deleteMap}
								confirmDeleteText={__(
									'Are you sure you want to delete this map?',
									'image-map-connect'
								)}
							/>
						</div>
					</Form>
				)}
			</CardBody>
		</Card>
	);
}
