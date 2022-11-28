import { TextControl, Button, BaseControl } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'

import { useGlobalContext } from "../contexts/global"
import { postItem, deleteItem, createItem } from '../utils/wp-fetch'
import LifeCycleButtons from './lifecycle-buttons'

import cls from './edit-form.module.scss'

/**
 * Map details form.
 *
 * @param props
 */
export default function EditLayer() {
	const { layers, maps, dispatch } = useGlobalContext()

	// Get the currently selected layer.
	function getSelected() {
		if (layers.selected === 'new') return { name: '', description: '', parent: maps.selected }
		return layers.list.find(layer => layer.id === layers.selected)
	}
	const [layer, setLayer] = useState()
	const [mediaMgr, setMediaMgr] = useState()
	const [image, setImage] = useState({})

	// Set layer and image as mount.
	useEffect(async () => {
		// Update layer to the selected layer.
		const newLayer = getSelected()
		setLayer(newLayer)

		// Get image for the stored image ID.
		if (newLayer && newLayer.meta.image) {
			const newImage = await window.wp.media.attachment(newLayer.meta.image).fetch()
			setImage(newImage)
		}
	}, [layers])

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

	// Save the new or udpated layer to the backend and the global state.
	async function onSave() {
		if (layer.id) {
			const res = await postItem('imagemaps', layer.id, layer)
			dispatch({ type: 'updateLayer', payload: res.body })
		} else {
			const res = await createItem('imagemaps', layer)
			dispatch({ type: 'addLayer', payload: { layer: res.body, select: true } })
		}
	}

	// Remove the layer from the backend and the global state.
	async function onDelete() {
		const res = await deleteItem('imagemaps', layer.id, { force: true })
		if (!res.body.deleted) throw new Error('To do: handle this!')
		dispatch({ type: 'deleteLayer', payload: layer.id })
	}

	if (!layer) return <div></div>

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
				<LifeCycleButtons onSave={onSave} onDelete={onDelete} />
			</div>
		</>
	)
}
