import { Card } from '@wordpress/components'
import { Controller } from 'react-hook-form'

import { useRouter } from '../../contexts/router'
import useRecord from '../../hooks/useRecord'
import OlMap from 'common/components/ol/map'
import ListedMarkerPin from './listed-marker-pin'
import ImageLayer from 'common/components/ol/image-layer'
import SelectedMarkerPin from './selected-marker-pin'
import NewMarkerPin from './new-marker-pin'

import cls from './markers.module.scss'
import mapCls from '../map.module.scss'

/**
 * Map displaying icons for all markers in the list.
 *
 * @param {object} props
 * @param {(map: import('ol').Map) => void} props.onMapLoaded Callback triggered when the map is rendered.
 * @param {import('../../hooks/useCollection').Collection} props.markers Marker list.
 * @param {import('.').MarkerListing} props.selected List fields from the selected marker.
 */
export default function MarkerLocations({ onMapLoaded, markers, selected }) {
	const { query } = useRouter()

	// Fetch selected layer from Wordpress.
	const { record: layer, status } = useRecord(
		[query.layer],
		'taxonomy',
		'layer',
		{ _fields: 'id,name,meta,_links.flare:image,_embedded', _embed: 1 },
		{ meta: {} }
	)

	// Fetch marker icons from Wordpress.
	const { record: wpMap } = useRecord(query.map, 'postType', 'map', { _fields: 'icon_details' })
	const icons = wpMap?.icon_details

	return (
		<Controller
			name='flare_loc'
			rules={{ validate: val => val && val.lat > 0 && val.lng > 0 }}
			render={({ field, fieldState }) => (
				<Card className={fieldState.invalid && cls.invalid}>
					<OlMap oneTimeHandlers={{ postrender: e => onMapLoaded(e.map) }} className={mapCls.canvas}>
						{status === 'loaded' && (
							<>
								<ImageLayer layer={layer} />
								{icons && markers.list.length && markers.list.map(mk => (mk.id !== +selected.id)
									? <ListedMarkerPin key={mk.id} marker={mk} icons={icons} />
									: <SelectedMarkerPin
										key={mk.id}
										icons={icons}
										newPosition={mk.flare_loc}
										onMove={field.onChange}
									/>
								)}
								{icons && query.marker === 'new' && (
									(field.value && field.value.lat && field.value.lng)
										? <SelectedMarkerPin
											icons={icons}
											newPosition={field.value}
											onMove={field.onChange}
										/>
										: <NewMarkerPin onSet={field.onChange} />
								)}
							</>
						)}
					</OlMap>
				</Card>
			)}
		/>
	)
}
