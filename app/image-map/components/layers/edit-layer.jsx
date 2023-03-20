import { TextControl, Button, BaseControl, RangeControl, Card, CardBody } from '@wordpress/components'

import useSelected from '../../hooks/useSelected'
import useMediaMgr from '../../hooks/useMediaMgr';
import { useRouter } from '../../contexts/router';
import LifeCycleButtons from '../forms/lifecycle-buttons'
import OlMap from 'common/components/ol/map';
import ImageLayer from 'common/components/ol/image-layer';

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
	const [layer, setLayer, loaded] = useSelected(
		layers.endpoint,
		query[layers.model],
		{ context: 'edit', _embed: 1 },
		{
			name: '',
			description: '',
			parent: query[layers.parent],
			meta: { initial_bounds: [] },
		}
	)

	// Initiate Wordpress media manager to select layer image
	const mediaMgr = useMediaMgr(false, selImages => setLayer(oldLayer => {
		// Get selected image
		const selImg = selImages.first()
		// Mimic rest API structure for image details.
		return {
			...oldLayer,
			meta: { ...oldLayer.meta, image: selImg.attributes.id, initial_position: {} },
			_embedded: {
				'flare:image': [{
					source_url: selImg.attributes.url,
					media_details: {
						width: selImg.attributes.width,
						height: selImg.attributes.height,
					},
				}],
			}
		}
	}))

	if (!loaded) return <div></div>

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
						<OlMap
							className={`${cls.border} ${cls.input}`}
						>
							{layer.id && <ImageLayer layer={layer} />}
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
