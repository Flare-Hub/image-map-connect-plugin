import { TextControl, Button, BaseControl, RangeControl, Card, CardBody } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'

import useSelected from '../../hooks/useSelected'
import { useRouter } from '../../contexts/router';
import LifeCycleButtons from '../forms/lifecycle-buttons'
import OlMap from '../ol/map';
import ImageLayer from '../ol/image-layer';
import PositionGetter from '../ol/position-getter';

import cls from '../forms/edit-form.module.scss'

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.layers
 * @param {import('../../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditLayer({ layers, dispatch }) {
	const { query } = useRouter()

	// Fetch selected layer from Wordpress.
	const [layer, setLayer] = useSelected(
		layers,
		{ context: 'edit', _embed: 1 },
		{
			name: '',
			description: '',
			parent: query[layers.parent],
			meta: { initial_bounds: [] },
		}
	)

	// Initialise media manager
	const [mediaMgr, setMediaMgr] = useState()

	// Load media manager
	useEffect(() => {
		// Create media manager
		const mm = window.wp.media({
			title: 'Select image',
			button: { text: 'Select image' },
			multiple: false,
		})
		setMediaMgr(mm)

		// Update image and set the new image ID in the layer
		function getImage() {
			const newImage = mm.state().get('selection').first()
			setLayer(oldLayer => ({
				...oldLayer,
				meta: { ...oldLayer.meta, image: newImage.attributes.id, initial_position: {} },
				_embedded: {
					'flare:image': [{
						source_url: newImage.attributes.url,
						media_details: {
							width: newImage.attributes.width,
							height: newImage.attributes.height,
						},
					}],
				}
			}))
		}

		// Action to take when selecting an image.
		mm.on('select', getImage)

		// Unregister media manager action.
		return () => mm.off('select', getImage)
	}, [])

	if (layer.name === undefined) return <div></div>

	return (
		<Card className="full-height">
			<CardBody>
				<div className="col-xs-9">
					<TextControl
						label="Name"
						value={layer.name}
						onChange={val => setLayer(oldLayer => ({ ...oldLayer, name: val }))}
						className={cls.field}
					/>
					<BaseControl label='Image' className={cls.field}>
						<Button variant='secondary' onClick={() => mediaMgr.open()}>Select image</Button>
					</BaseControl>
					<RangeControl
						label="Maximum zoom"
						value={layer.meta.max_zoom}
						onChange={val => setLayer(oldLayer => ({ ...oldLayer, meta: { ...oldLayer.meta, max_zoom: val } }))}
						min="0"
						max="10"
						className={`${cls.field} ${cls.center}`}
					/>
					<RangeControl
						label="Minimum zoom"
						value={layer.meta.min_zoom}
						onChange={val => setLayer(oldLayer => ({ ...oldLayer, meta: { ...oldLayer.meta, min_zoom: val } }))}
						min="0"
						max="10"
						className={`${cls.field} ${cls.center}`}
					/>
					<BaseControl label="Initial position" className={`${cls.field} ${cls.map}`}>
						<OlMap layer={layer} className={cls.map} >
							{layer._embedded && (<>
								<ImageLayer url={layer._embedded['flare:image'][0].source_url} />
								<PositionGetter onMoveEnd={pos => setLayer(oldLayer => ({
									...oldLayer,
									meta: { ...oldLayer.meta, initial_position: pos }
								}))} />
							</>
							)}
						</OlMap>
					</BaseControl>
				</div>
				<div className="col-xs-3">
					<LifeCycleButtons identifiers={layers} item={layer} dispatch={dispatch} />
				</div>
			</CardBody>
		</Card>
	)
}
