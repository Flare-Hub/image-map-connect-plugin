import { Flex, FlexItem, Card, CardBody, Spinner } from '@wordpress/components'
import { useEffect, useMemo } from '@wordpress/element'
import { FormProvider, useForm } from 'react-hook-form'

import { useRouter } from '../../contexts/router'
import useRecord from '../../hooks/useRecord'
import LifeCycleButtons from '../forms/lifecycle-buttons'
import EditMarker from './edit-marker'
import MarkerLocations from './marker-locations'
import { select } from '@wordpress/data'
import { store as dataStore } from '@wordpress/core-data'

/**
 * Context provider for the selected marker state.
 *
 * @param {object} props
 * @param {import('.').MarkerListing} props.selected List fields from the selected marker.
 * @param {import('../../hooks/useCollection').Collection} props.markers Marker list.
 * @param {(map: import('ol').Map) => void} props.onMapLoaded Callback triggered when the map is rendered.
 */
export function MarkerForm({ selected = {}, markers, onMapLoaded }) {
	const { query } = useRouter()

	const newMarker = useMemo(() => ({
		status: 'publish',
		title: { raw: '' },
		excerpt: { raw: '' },
		layers: [+query.layer],
		'marker-icons': selected['marker-icons'] ?? [0],
		flare_loc: selected.flare_loc ?? { lng: 0, lat: 0 },
		type: selected.type ?? 'marker',
	}), [selected, query.layer])

	// Fetch selected marker from Wordpress.
	const { record: marker, status, delRecord, saveRecord } = useRecord(
		selected.id,
		'postType',
		newMarker.type,
		{},
		newMarker,
	)

	// Save marker and force marker list update for connected posts.
	async function save(fields) {
		const post = await saveRecord(fields)

		if (post.type !== 'marker') {
			select(dataStore).getEntityRecords('postType', 'marker', {
				layers: +query.layer ?? 0,
				_fields: 'title,id,type,marker-icons,flare_loc',
				post_types: 'all',
				map: query.map,
				per_page: -1,
			}, {}, true)
		}

		return post
	}

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

	// Reset form if the marker is updated
	useEffect(() => form.reset(marker), [marker.id])

	// Reset form after successful submission.
	useEffect(() => {
		if (form.formState.isSubmitSuccessful) form.reset(marker)
	}, [form.formState.isSubmitSuccessful])

	return (
		<FormProvider {...form}>
			<Flex direction="column" gap="1px" className="full-height">
				<FlexItem>
					<MarkerLocations onMapLoaded={onMapLoaded} markers={markers} selected={selected} />
				</FlexItem>
				<FlexItem isBlock>
					<Card className="full-height">
						{status === 'loading' && <Spinner style={{ width: '100px', height: '100px' }} />}
						{(status === 'new' || status === 'loaded') && (
							<CardBody>
								<EditMarker markerType={marker.type} title={marker.title.raw} layers={marker.layers} />
								<div className="col-xs-3">
									<LifeCycleButtons
										model="marker"
										id={query.marker}
										onDelete={delRecord}
										onSave={save}
									/>
								</div>
							</CardBody>
						)}
					</Card>
				</FlexItem>
			</Flex>
		</FormProvider>
	)
}
