import { TextControl, Card, CardBody, Spinner, BaseControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useEffect } from '@wordpress/element'
import { FormProvider, useForm, Controller } from "react-hook-form"

import { useRouter } from '../../contexts/router'
import { cls, getControlClass } from '../../utils/form-control'
import useRecord from '../../hooks/useRecord'
import PostTypesSelect from '../forms/post-types-select'
import MarkerIconList from './marker-icon-list'
import MapLifecycle from './map-lifecycle'

/** Default values for a new map. */
const EMPTY_MAP = {
	title: { raw: '' },
	excerpt: { raw: '' },
	meta: { post_types: [] },
	icon_details: [],
	status: 'publish'
}

/**
 * Map details form.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollectionNew').WpIdentifiers} props.references
 */
export default function EditMap({ references }) {
	const { query } = useRouter()
	const mapId = query[references.model]

	// Get map from WordPress.
	const {
		record: map,
		status: mapStatus,
		saveRecord: saveMap,
		delRecord: deleteMap
	} = useRecord(
		mapId,
		references.type,
		references.model,
		{ _fields: 'id,title,excerpt,meta,icon_details,status' },
		EMPTY_MAP
	)

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		defaultValues: map
	})

	const { isSubmitSuccessful, errors } = form.formState

	// Reset form validator when a new map has been fetched or the map is saved.
	useEffect(() => {
		if (mapStatus === 'new' || mapStatus === 'loaded' || isSubmitSuccessful) {
			form.reset(map)
		}
	}, [mapStatus, mapId, isSubmitSuccessful])

	return (
		<Card className="full-height">
			{mapStatus === 'loading' && <Spinner style={{ width: '100px', height: '100px' }} />}
			{(mapStatus === 'new' || mapStatus === 'loaded') && (
				<CardBody>
					<FormProvider {...form}>
						<div className="col-xs-9">
							<Controller
								name="title.raw"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<TextControl
										label={__('Map name', 'flare')}
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
										label={__('Description', 'flare')}
										{...field}
										className={getControlClass(fieldState)}
									/>
								)}
							/>
							<Controller
								name="meta.post_types"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<BaseControl label={__('Post Types', 'flare')} className={getControlClass(fieldState)}>
										<PostTypesSelect
											selected={field.value}
											onSelect={field.onChange}
											onBlur={field.onBlur}
											inputClass={cls.input}
											ref={field.ref}
										/>
									</BaseControl>
								)}
							/>
							<BaseControl
								label={__('Marker icons', 'flare')}
								className={getControlClass({
									invalid: errors.icon_details && errors.icon_details.root
								})}
							>
								<MarkerIconList name={'icon_details'} />
							</BaseControl>
						</div>
						<div className="col-xs-3">
							<MapLifecycle save={saveMap} delete={deleteMap} id={mapId} />
						</div>
					</FormProvider>
				</CardBody>
			)}
		</Card>
	)
}
