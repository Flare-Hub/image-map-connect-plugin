/* eslint-disable camelcase */
import { Flex, FlexItem, Card, CardBody, Spinner } from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { FormProvider, useForm } from 'react-hook-form';

import { useRouter } from '../../contexts/router';
import useRecord from '../../hooks/useRecord';
import MarkerLifecycle from './marker-lifecycle';
import EditMarker from './edit-marker';
import MarkerLocations from './marker-locations';

import cls from '../forms/edit-form.module.scss';

/**
 * Context provider for the selected marker state.
 *
 * @param {Object}                                         props
 * @param {import('.').WpMarker}                           props.selected    List fields from the selected marker.
 * @param {import('../../hooks/useCollection').Collection} props.markers     Marker list.
 * @param {Object<string, unknown>}                        props.listQuery   Query for refreshing the markers list.
 * @param {(map: import('ol').Map) => void}                props.onMapLoaded Callback triggered when the map is rendered.
 */
export function MarkerForm( {
	selected = {},
	markers,
	onMapLoaded,
	listQuery,
} ) {
	const { query } = useRouter();
	const [ showForm, setShowForm ] = useState( false );

	// Get icons from WordPress.
	const {
		record: { icon_details },
	} = useRecord( query.map, 'postType', 'imc-map', {
		_fields: 'icon_details',
	} );

	const newMarker = useMemo(
		() => ( {
			status: 'publish',
			title: { raw: '' },
			excerpt: { raw: '' },
			imc_layers: [ +query.layer ],
			imc_icons: selected.imc_icons ?? [
				icon_details ? icon_details[ 0 ].id : 0,
			],
			imc_loc: selected.imc_loc ?? { lng: 0, lat: 0 },
			type: selected.type ?? 'imc-marker',
		} ),
		[ selected, query.layer, icon_details ]
	);

	// Fetch selected marker from Wordpress.
	const {
		record: marker,
		status,
		delRecord,
		saveRecord,
	} = useRecord( selected.id, 'postType', newMarker.type, {}, newMarker );

	// Create form validation handler.
	const form = useForm( {
		mode: 'onTouched',
		defaultValues: marker,
	} );

	// Add current layer to post if it's not already connected.
	useEffect( () => {
		const sub = form.watch( ( value, { type } ) => {
			if (
				! type &&
				Array.isArray( value.imc_layers ) &&
				! value.imc_layers.includes( +query.layer )
			) {
				form.setValue( 'imc_layers', [
					...value.imc_layers,
					+query.layer,
				] );
			}
		} );
		return () => sub.unsubscribe();
	}, [ form, form.watch, query.layer ] );

	// Reset form if the marker is updated
	useEffect( () => {
		if ( status === 'new' || status === 'loaded' ) {
			setShowForm( true );
			form.reset( marker );
		}
	}, [ form, marker, status ] );

	useEffect( () => {
		if ( status === 'loading' ) setShowForm( false );
	}, [ status ] );

	// Reset form after successful submission.
	useEffect( () => {
		if ( form.formState.isSubmitSuccessful ) form.reset( marker );
	}, [ form.formState.isSubmitSuccessful ] ); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<FormProvider { ...form }>
			<Flex direction="column" gap="1px" className="full-height">
				<FlexItem>
					<MarkerLocations
						onMapLoaded={ onMapLoaded }
						markers={ markers }
						selected={ selected }
					/>
				</FlexItem>
				<FlexItem isBlock>
					<Card className="full-height">
						<CardBody>
							{ status === 'none' && (
								<h3 className={ cls.noSelection }>
									{ __(
										'Select a map from the list or add a new one.',
										'flare-imc'
									) }
								</h3>
							) }

							{ status === 'loading' && (
								<Spinner
									style={ {
										width: '100px',
										height: '100px',
									} }
								/>
							) }
							{ showForm && (
								<>
									<EditMarker
										markerType={ marker.type }
										title={ marker.title.raw }
										icons={ icon_details }
									/>
									<div className="col-xs-3">
										<MarkerLifecycle
											marker={ marker }
											save={ saveRecord }
											delete={ delRecord }
											listQuery={ listQuery }
										/>
									</div>
								</>
							) }
						</CardBody>
					</Card>
				</FlexItem>
			</Flex>
		</FormProvider>
	);
}
