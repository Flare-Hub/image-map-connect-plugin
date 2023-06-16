import {
	TextControl,
	BaseControl,
	RangeControl,
	Card,
	CardBody,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { useRouter } from '../../contexts/router';
import { getControlClass, cls } from '../../utils/form-control';
import useRecord from '../../hooks/useRecord';
import OlMap from 'common/components/ol/map';
import ImageLayer from 'common/components/ol/image-layer';
import LifeCycleButtons from '../forms/lifecycle-buttons';
import SelectImage from './select-image';

import mapCls from '../map.module.scss';

/** Map details form. */
export default function EditLayer() {
	const { query } = useRouter();

	const emptyLayer = useMemo(
		() => ( {
			name: '',
			description: '',
			meta: { initial_bounds: [] },
			map: +query.map,
		} ),
		[ query.map ]
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
		'layer',
		{ _fields: 'id,name,meta,image_source' },
		emptyLayer
	);

	// Create form validation handler.
	const form = useForm( {
		mode: 'onTouched',
		defaultValues: layer,
	} );

	// Reset form validator when a new layer has been fetched or layer map is saved.
	useEffect( () => {
		if (
			status === 'new' ||
			status === 'loaded' ||
			form.formState.isSubmitSuccessful
		) {
			form.reset( layer );
		}
	}, [ status, form.formState.isSubmitSuccessful, form, layer ] );

	// Define ids to map the base controls to.
	const imgId = useRef( 'img-' + Math.floor( Math.random() * 100000000 ) );
	const mapDivId = useRef( 'map-' + Math.floor( Math.random() * 100000000 ) );

	return (
		<Card className="full-height">
			{ status === 'loading' && (
				<Spinner style={ { width: '100px', height: '100px' } } />
			) }
			{ ( status === 'new' || status === 'loaded' ) && (
				<FormProvider { ...form }>
					<CardBody>
						<div className="col-xs-9">
							<Controller
								name="name"
								rules={ { required: true } }
								render={ ( { field, fieldState } ) => (
									<TextControl
										label={ __( 'Name', 'flare' ) }
										{ ...field }
										className={ getControlClass(
											fieldState
										) }
									/>
								) }
							/>
							<Controller
								name="meta.image"
								rules={ { required: true } }
								render={ ( { field, fieldState } ) => (
									<BaseControl
										label="Image"
										className={ cls.field }
										id={ imgId.current }
									>
										<SelectImage
											onChange={ field.onChange }
											invalid={ fieldState.invalid }
											id={ imgId.current }
										/>
									</BaseControl>
								) }
							/>
							<Controller
								name="meta.min_zoom"
								rules={ { required: true } }
								render={ ( { field, fieldState } ) => (
									<RangeControl
										label={ __( 'Minimum zoom', 'flare' ) }
										min="0"
										max="10"
										{ ...field }
										className={ `${ getControlClass(
											fieldState
										) } ${ cls.center }` }
									/>
								) }
							/>
							<Controller
								name="meta.max_zoom"
								rules={ { required: true } }
								render={ ( { field, fieldState } ) => (
									<RangeControl
										label={ __( 'Maximum zoom', 'flare' ) }
										min="0"
										max="10"
										{ ...field }
										className={ `${ getControlClass(
											fieldState
										) } ${ cls.center }` }
									/>
								) }
							/>
							<BaseControl
								label={ __( 'Initial position', 'flare' ) }
								className={ `${ cls.field } ${ cls.map }` }
								id={ mapDivId.current }
							>
								<OlMap
									className={ `${ cls.border } ${ cls.input } ${ mapCls.canvas }` }
									id={ mapDivId.current }
								>
									<ImageLayer layer={ form.watch() } />
								</OlMap>
							</BaseControl>
						</div>
						<div className="col-xs-3">
							<LifeCycleButtons
								model="layer"
								id={ query.layer }
								onSave={ saveLayer }
								onDelete={ delLayer }
								confirmDeleteText={ __(
									'Are you sure you want to delete this layer?'
								) }
							/>
						</div>
					</CardBody>
				</FormProvider>
			) }
		</Card>
	);
}
