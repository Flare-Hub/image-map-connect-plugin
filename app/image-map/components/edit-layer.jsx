import { TextControl, Button, BaseControl } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'

import { useGlobalContext } from "../contexts/global"
import useSelected from '../hooks/useSelected'
import LifeCycleButtons from './lifecycle-buttons'

import cls from './edit-form.module.scss'

/**
 * Map details form.
 *
 * @param props
 */
export default function EditLayer() {
	const { layers, dispatchLayer } = useGlobalContext()

	const [layer, setLayer] = useSelected(layers, { name: '', description: '', meta: {} })
	const [mediaMgr, setMediaMgr] = useState()
	const [image, setImage] = useState({})

	// Set image at mount.
	useEffect(async () => {
		// Get image for the stored image ID.
		const newImage = layer && layer.meta.image
			? await window.wp.media.attachment(layer.meta.image).fetch()
			: {}
		setImage(newImage)
	}, [layer])

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
			setImage(newImage.attributes)
			setLayer(oldLayer => ({
				...oldLayer,
				meta: { ...oldLayer.meta, image: newImage.attributes.id }
			}))
		}

		// Action to take when selecting an image.
		mm.on('select', getImage)

		// Unregister media manager action.
		return () => mm.off('select', getImage)
	}, [])

	if (layer.name === undefined) return <div></div>

	return (
		<>
			<div className='col-xs-9'>
				<TextControl
					label="Name"
					value={layer.name}
					onChange={val => setLayer({ ...layer, name: val })}
					className={cls.field}
				/>
				<BaseControl label='Image' className={cls.field}>
					<Button variant='secondary' onClick={() => mediaMgr.open()}>Select image</Button>
				</BaseControl>
				<div className={cls.field}>
					<div>
						<div className={cls.label}></div>
						<div className={cls.input}>
							<img src={image.url} alt={image.alt} width="100%" />
						</div>
					</div>
				</div>
			</div>
			<div className="col-xs-3">
				<LifeCycleButtons collection="imagemaps" item={layer} dispatch={dispatchLayer} />
			</div>
		</>
	)
}
