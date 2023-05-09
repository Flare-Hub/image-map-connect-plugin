import { TextControl, Card, CardBody, Spinner, BaseControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useEffect } from '@wordpress/element';
import { FormProvider, useForm, Controller } from "react-hook-form";

import useSelected from "../../hooks/useSelected";
import { useRouter } from '../../contexts/router'
import { cls, getControlClass } from '../../utils/form-control'
import PostTypesSelect from '../forms/post-types-select'
import MarkerIconList from './marker-icon-list'
import MapLifecycle from './map-lifecycle';

/**
 * Map details form.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.references
 * @param {import('../../hooks/useCollection').Collection} props.maps
 */
export default function EditMap({ references, maps }) {
	const { query } = useRouter()
	const mapId = query[references.model]

	// Get map from WordPress.
	const [map, setMap, mapStatus] = useSelected(
		references.endpoint,
		mapId,
		{ context: 'edit', _fields: 'id,title,excerpt,meta,icon_details,status' },
		{ title: { raw: '' }, excerpt: { raw: '' }, meta: { post_types: [] }, icon_details: [], status: 'publish' },
		[mapId]
	)

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		values: map
	})

	// Reset form after successful submission.
	useEffect(() => {
		if (form.formState.isSubmitSuccessful) {
			setMap(form.getValues())
		}
	}, [form.formState.isSubmitSuccessful])

	// Show a spinner until the map and icons have loaded.
	if (mapStatus === 'loading') return (
		<Card className="full-height">
			<Spinner style={{ width: '100px', height: '100px' }} />
		</Card>
	)

	return (
		<Card className="full-height">
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
							label={__('Icon categories', 'flare')}
							className={cls.field +
								(form.formState.errors.icon_details && form.formState.errors.icon_details.root
									? ' ' + cls.invalid
									: '')
							}
						>
							<MarkerIconList name={'icon_details'} />
						</BaseControl>
					</div>
					<div className="col-xs-3">
						<MapLifecycle maps={maps} references={references} />
					</div>
				</FormProvider>
			</CardBody>
		</Card>
	)
}
