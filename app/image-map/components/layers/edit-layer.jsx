import { TextControl, BaseControl, RangeControl, Card, CardBody, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useEffect } from '@wordpress/element';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import useSelected from '../../hooks/useSelected'
import { useRouter } from '../../contexts/router';
import { getControlClass, cls } from '../../utils/form-control';
import OlMap from 'common/components/ol/map';
import ImageLayer from 'common/components/ol/image-layer';
import SelectImage from './select-image';
import LayerLifecycle from './layer-lifecycle';

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.references
 * @param {import('../../hooks/useCollection').Collection} props.layers
 */
export default function EditLayer({ references, layers }) {
	const { query } = useRouter()

	// Fetch selected layer from Wordpress.
	const [layer, setLayer, status] = useSelected(
		references.endpoint,
		query[references.model],
		{ context: 'edit', _embed: 1 },
		{
			name: '',
			description: '',
			meta: { initial_bounds: [] },
		},
		[references.endpoint, query[references.model]]
	)

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		values: layer,
	})

	// Reset form after successful submission.
	useEffect(() => {
		if (form.formState.isSubmitSuccessful) {
			setLayer(form.getValues())
		}
	}, [form.formState.isSubmitSuccessful])

	return (
		<Card className="full-height">
			{status === 'loading' && <Spinner style={{ width: '100px', height: '100px' }} />}
			{(status === 'new' || status === 'loaded') && (
				<FormProvider {...form}>
					<CardBody>
						<div className="col-xs-9">
							<Controller
								name="name"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<TextControl
										label={__('Name', 'flare')}
										{...field}
										className={getControlClass(fieldState)}
									/>
								)}
							/>
							<Controller
								name="meta.image"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<BaseControl label='Image' className={cls.field}>
										<SelectImage onChange={field.onChange} invalid={fieldState.invalid} />
									</BaseControl>
								)}
							/>
							<Controller
								name="meta.min_zoom"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<RangeControl
										label={__('Minimum zoom', 'flare')}
										min="0"
										max="10"
										{...field}
										className={`${getControlClass(fieldState)} ${cls.center}`}
									/>
								)}
							/>
							<Controller
								name="meta.max_zoom"
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<RangeControl
										label={__('Maximum zoom', 'flare')}
										min="0"
										max="10"
										{...field}
										className={`${getControlClass(fieldState)} ${cls.center}`}
									/>
								)}
							/>
							<BaseControl label="Initial position" className={`${cls.field} ${cls.map}`}>
								<OlMap className={`${cls.border} ${cls.input}`}>
									<ImageLayer layer={form.watch()} />
								</OlMap>
							</BaseControl>
						</div>
						<div className="col-xs-3">
							<LayerLifecycle layers={layers} references={references} />
						</div>
					</CardBody>
				</FormProvider>
			)}
		</Card>
	)
}
