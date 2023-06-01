import { Flex, FlexItem, Card, CardBody, Spinner } from '@wordpress/components'
import { useEffect, useMemo } from '@wordpress/element'
import { FormProvider, useForm } from 'react-hook-form'

import { useRouter } from '../../contexts/router'
import useRecord from '../../hooks/useRecord'
import LifeCycleButtons from '../forms/lifecycle-buttons'
import EditMarker from './edit-marker'
import MarkerLocations from './marker-locations'

/**
 * Context provider for the selected marker state.
 *
 * @param {object} props
 * @param {import('.').MarkerListing} props.selected list fields from the selected marker.
 * @param {import('../../hooks/useCollection').Collection} props.markers Marker list.
 * @param {(map: import('ol').Map) => void} props.onMapLoaded Callback triggered when the map is rendered.
 */
export function MarkerForm({ selected = {}, markers, onMapLoaded }) {
	const { query } = useRouter()

	const emptyMarker = useMemo(() => ({
		status: 'publish',
		title: { raw: '' },
		excerpt: { raw: '' },
		layers: [+query.layer],
		'marker-icons': selected['marker-icons'] ?? [],
		flare_loc: selected.flare_loc ?? { lng: 0, lat: 0 },
		type: selected.type ?? 'marker',
	}), [selected, query.layer])

	// Fetch selected marker from Wordpress.
	const { record: marker, status, delRecord, saveRecord } = useRecord(
		query.marker,
		'postType',
		selected.type,
		{},
		emptyMarker
	)

	// Create form validation handler.
	const form = useForm({
		mode: 'onTouched',
		defaultValues: marker,
	})

	// Add current layer to post if it's not already connected.
	useEffect(() => {
		const sub = form.watch((value, { type }) => {
			if (!type && Array.isArray(value.layers) && !value.layers.includes(+query.layer)) {
				form.setValue('layers', [...value.layers, +query.layer])
			}
		})
		return () => sub.unsubscribe()
	}, [form.watch])

	// Reset form after successful submission.
	useEffect(() => {
		if (status === 'new' || status === 'loaded' || form.formState.isSubmitSuccessful) {
			form.reset(marker)
		}
	}, [status, query.marker, form.formState.isSubmitSuccessful])

	return (
		<FormProvider {...form}>
			<Flex direction="column" gap="1px" className="full-height">
				<FlexItem>
					<MarkerLocations onMapLoaded={onMapLoaded} markers={markers} />
				</FlexItem>
				<FlexItem isBlock>
					<Card className="full-height">
						{(!isNaN(query.marker) && status !== 'loaded') && <Spinner style={{ width: '100px', height: '100px' }} />}
						{(query.marker === 'new' || marker.id) && (
							<CardBody>
								<EditMarker markerType={marker.type} title={marker.title.rendered} layers={marker.layers} />
								<div className="col-xs-3">
									{query.marker && (
										<LifeCycleButtons
											model="marker"
											id={query.marker}
											onDelete={delRecord}
											onSave={saveRecord}
										/>
									)}
								</div>
							</CardBody>
						)}
					</Card>
				</FlexItem>
			</Flex>
		</FormProvider>
	)
}
