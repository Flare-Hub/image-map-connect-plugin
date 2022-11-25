import { TextControl, Button } from '@wordpress/components'
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

	// Update layer to the selected layer
	useEffect(() => {
		setLayer(getSelected())
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

		function getImage() {
			console.log(mm.state().get('selection').first())
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
					className={cls.input}
				/>
				<Button variant='secondary' onClick={() => mediaMgr.open()}>Select image</Button>
			</div>
			<div className="col-xs-3">
				<LifeCycleButtons onSave={onSave} onDelete={onDelete} />
			</div>
		</>
	)
}
