import {
	TextControl,
	Card,
	CardBody,
	Spinner
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useMemo } from '@wordpress/element';
import { FormProvider, useForm, Controller } from "react-hook-form";

import useSelected from "../../hooks/useSelected";
import { useRouter } from '../../contexts/router'
import { cls, getControlClass } from '../../utils/form-control'
import PostTypesSelect from '../forms/post-types-select'
import MarkerIconList from './marker-icon-list'
import LifeCycleButtons from "../forms/lifecycle-buttons";
import useCollection from '../../hooks/useCollection';

/**
 * Map details form.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.references
 * @param {import('../../hooks/useCollection').Collection} props.maps
 */
export default function EditMap({ references, maps }) {
	const { query, navigate } = useRouter()
	const mapId = query[references.model]

	// Get map from WordPress.
	const [map, setMap, mapStatus] = useSelected(
		references.endpoint,
		mapId,
		{ context: 'edit', _fields: 'id,title,excerpt,meta,marker-icons', _embed: 1 },
		{
			title: { raw: '' },
			excerpt: { raw: '' },
			meta: { post_types: [], img: {}, colour: '' },
			status: 'publish'
		},
		[mapId]
	)

	// Get map's icons from WordPress.
	const icons = useCollection(
		{ model: 'icon', endpoint: 'marker-icons', parent: 'map' },
		{ post: mapId, context: 'edit', _fields: 'id,name,slug,meta', per_page: 100 },
		{ list: [], page: 1 },
		[mapId]
	)

	// Create form and update values when map or icons change.
	const formValues = useMemo(() => (
		{ map, icons: icons.list }
	), [map, icons])

	const form = useForm({
		mode: 'onTouched',
		values: formValues
	})

	/** Save the provided map and its icons. */
	async function onSave(data) {
		const wpId = await maps.actions.save(data.map)
		// TODO: Handle Icons
		if (mapId === 'new') navigate({ [references.model]: wpId })
	}

	/** Handle any errors when saving the map */
	function onError(err) {
		// TODO: Handle form submission errors.
		console.log(err);
	}

	/** Delete the provided map and its icons. */
	function onDelete() {
		maps.actions.delete(+mapId)
		// TODO: Handle Icons
		navigate({ [references.model]: undefined })
	}

	// Show a spinner until the map and icons have loaded.
	if (mapStatus === 'loading' || icons.loading) return (
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
							name="map.title.raw"
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
							name="map.excerpt.raw"
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
							name="map.meta.post_types"
							rules={{
								validate: (value) => value.length || __('This field is required', 'flare')
							}
							}
							render={({ field, fieldState }) => (
								<PostTypesSelect
									selected={field.value}
									onSelect={field.onChange}
									onBlur={field.onBlur}
									baseClass={getControlClass(fieldState)}
									inputClass={cls.input}
									ref={field.ref}
								/>
							)}
						/>
						<MarkerIconList name={'icons'} />
					</div>
					<div className="col-xs-3">
						<LifeCycleButtons onSave={form.handleSubmit(onSave, onError)} onDelete={onDelete} />
					</div>
				</FormProvider>
			</CardBody>
		</Card>
	)
}
