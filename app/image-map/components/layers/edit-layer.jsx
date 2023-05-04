import { TextControl, Button, BaseControl, RangeControl, Card, CardBody, Spinner } from '@wordpress/components'

import useSelected from '../../hooks/useSelected'
import useMediaMgr from '../../hooks/useMediaMgr';
import { useRouter } from '../../contexts/router';
import LifeCycleButtons from '../forms/lifecycle-buttons'
import OlMap from 'common/components/ol/map';
import ImageLayer from 'common/components/ol/image-layer';
import { postItem } from 'common/utils/wp-fetch';
import { mapRefs } from '../maps';

import cls from '../forms/edit-form.module.scss'

/**
 * Map details form.
 *
 * @param {Object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.references
 * @param {import('../../hooks/useCollection').Collection} props.layers
 */
export default function EditLayer({ references, layers }) {
	const { query, navigate } = useRouter()

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

	// Initiate Wordpress media manager to select layer image
	const mediaMgr = useMediaMgr(false, async (selImages) => {
		// Get selected image
		const selImg = await selImages.first()

		setLayer(oldLayer => {
			// Mimic rest API structure for image details.
			return {
				...oldLayer,
				meta: { ...oldLayer.meta, image: selImg.attributes.id },
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
		})
	})

	/** Save layer */
	async function onSave(data) {
		const layerId = await layers.actions.save(data)
		await postItem(mapRefs.endpoint, query[references.parent], { layers: [layerId] })
		if (query[references.model] === 'new') navigate({ [references.model]: layerId })
	}

	function onDelete() {
		layers.actions.delete(+query[references.model])
		navigate({ [references.model]: undefined })
	}

	return (
		<Card className="full-height">
			{status === 'loading' && <Spinner style={{ width: '100px', height: '100px' }} />}
			{(status === 'new' || status === 'loaded') && (
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
								<ImageLayer layer={layer} />
							</OlMap>
						</BaseControl>
					</div>
					<div className="col-xs-3">
						<LifeCycleButtons onSave={() => onSave(layer)} onDelete={onDelete} />
					</div>
				</CardBody>
			)}
		</Card>
	)
}
