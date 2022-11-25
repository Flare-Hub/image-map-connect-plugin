import { TextControl, TextareaControl } from '@wordpress/components'
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
export default function EditMap() {
	const { maps, dispatch } = useGlobalContext()

	function getSelected() {
		if (maps.selected === 'new') return { name: '', description: '' }
		return maps.list.find(map => map.id === maps.selected)
	}
	const [map, setMap] = useState()

	useEffect(() => {
		setMap(getSelected())
	}, [maps])

	async function onSave() {
		if (map.id) {
			const res = await postItem('imagemaps', map.id, map)
			dispatch({ type: 'updateMap', payload: res.body })
		} else {
			const res = await createItem('imagemaps', map)
			dispatch({ type: 'addMap', payload: { map: res.body, select: true } })
		}
	}

	async function onDelete() {
		const res = await deleteItem('imagemaps', map.id, { force: true })
		if (!res.body.deleted) throw new Error('To do: handle this!')
		dispatch({ type: 'deleteMap', payload: map.id })
	}

	if (!map) return <div></div>

	return (
		<>
			<div className='col-xs-9'>
				<TextControl
					label="Name"
					value={map.name}
					onChange={val => setMap({ ...map, name: val })}
					className={cls.input}
				/>
				<TextareaControl
					label="Description"
					value={map.description}
					className={cls.input}
					onChange={val => setMap({ ...map, description: val })}
				/>
			</div>
			<div className="col-xs-3">
				<LifeCycleButtons onSave={onSave} onDelete={onDelete} />
			</div>
		</>
	)
}
