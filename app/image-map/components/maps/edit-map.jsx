import {
	TextControl,
	Card,
	CardBody,
} from '@wordpress/components'
import { Controller } from 'react-hook-form'
import { __ } from '@wordpress/i18n'

import PostTypesSelect from '../forms/post-types-select'
import MarkerIconList from './marker-icon-list'
import { useRouter } from '../../contexts/router'
import EditForm from '../forms/edit-form'
import { cls, getControlClass } from '../../utils/form-control'

/**
 * Map details form.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.maps
 * @param {import('../../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditMap({ maps, dispatch }) {
	const { query } = useRouter()

	return <Card className="full-height">
		<CardBody>
			<EditForm
				collection={maps}
				id={query[maps.model]}
				query={{ context: 'edit', _fields: 'id,name,description,meta', _embed: 1 }}
				placeholder={{ name: '', description: '', meta: { post_types: [], icons: [] } }}
				dispatch={dispatch}
			>
				<Controller
					name="name"
					rules={{ required: __('This field is required', 'flare') }}
					render={({ field, fieldState }) => (
						<TextControl
							label={__('Map name', 'flare')}
							{...field}
							className={cls.field + getControlClass(fieldState)}
						/>
					)}
				/>
				<Controller
					name={__('description', 'flare')}
					rules={{ required: __('This field is required', 'flare') }}
					render={({ field, fieldState }) => (
						<TextControl
							label="Description"
							{...field}
							className={cls.field + getControlClass(fieldState)}
						/>
					)}
				/>
				<Controller
					name="meta.post_types"
					rules={{
						validate: (value) => value.length || __('This field is required', 'flare')
					}
					}
					render={({ field, fieldState }) => (
						<PostTypesSelect
							selected={field.value}
							onSelect={field.onChange}
							onBlur={field.onBlur}
							baseClass={cls.field + getControlClass(fieldState)}
							inputClass={cls.input}
							ref={field.ref}
						/>
					)}
				/>
				<MarkerIconList />
			</EditForm>
		</CardBody>
	</Card>
}
