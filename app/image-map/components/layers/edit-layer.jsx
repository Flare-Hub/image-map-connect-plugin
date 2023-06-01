import { TextControl, BaseControl, RangeControl, Card, CardBody, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useEffect, useMemo } from '@wordpress/element';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { useRouter } from '../../contexts/router';
import { getControlClass, cls } from '../../utils/form-control';
import useRecord from '../../hooks/useRecord';
import OlMap from 'common/components/ol/map';
import ImageLayer from 'common/components/ol/image-layer';
import LifeCycleButtons from '../forms/lifecycle-buttons';
import SelectImage from './select-image';

import mapCls from '../map.module.scss'

/**
 * Map details form.
 *
 * @param {Object} props
 */
export default function EditLayer() {
	const { query } = useRouter()

	const emptyLayer = useMemo(() => ({
		name: '',
		description: '',
		meta: { initial_bounds: [] },
		map: +query.map,
	}), [query.map])

	// Fetch selected layer from Wordpress.
	const {
		record: layer,
		status,
		saveRecord: save,
		delRecord: del
	} = useRecord(
		query.layer,
		'taxonomy',
		'layer',
		{ _fields: 'id,name,meta,_links.flare:image,_embedded', _embed: 1 },
		emptyLayer
	)

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		defaultValues: layer,
	})

	// Reset form validator when a new layer has been fetched or layer map is saved.
	useEffect(() => {
		if (status === 'new' || status === 'loaded' || form.formState.isSubmitSuccessful) {
			form.reset(layer)
		}
	}, [status, query.layer, form.formState.isSubmitSuccessful])

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
							<BaseControl label={__('Initial position', 'flare')} className={`${cls.field} ${cls.map}`}>
								<OlMap className={`${cls.border} ${cls.input} ${mapCls.canvas}`}>
									<ImageLayer layer={form.watch()} />
								</OlMap>
							</BaseControl>
						</div>
						<div className="col-xs-3">
							<LifeCycleButtons model="layer" id={query.layer} onSave={save} onDelete={del} />
						</div>
					</CardBody>
				</FormProvider>
			)}
		</Card>
	)
}
