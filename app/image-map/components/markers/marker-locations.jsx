import { Card } from '@wordpress/components'
import { useEffect } from '@wordpress/element'
import { Controller, useForm } from 'react-hook-form'

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
 */
export default function MarkerLocations({ onMapLoaded, markers }) {
	const { query } = useRouter()
	const { setValue, watch } = useForm()

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

	const mapIcons = wpMap?.icon_details
	const icons = watch('marker-icons')

	// Select 1st icon by default on new markers.
	useEffect(() => {
		if (mapIcons && mapIcons.length && icons && !icons[0]) {
			setValue('marker-icons', [mapIcons[0].id])
		}
	}, [mapIcons, icons])



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
								{mapIcons && markers.list.map(mk => (
									(mk.id !== +query.marker) && <ListedMarkerPin key={mk.id} marker={mk} icons={mapIcons} />
								))}
								{mapIcons && !markers.loading && query.marker && (
									field.value && field.value.lat && field.value.lng
										? <SelectedMarkerPin icons={mapIcons} newPosition={field.value} onMove={field.onChange} />
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
