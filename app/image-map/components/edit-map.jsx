import { TextControl, TextareaControl } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'

import { useGlobalContext } from "../contexts/global"
import { postItem, deleteItem, createItem } from '../utils/wp-fetch'
import LifeCycleButtons from './lifecycle-buttons'

import cls from './edit-form.module.scss'
import PostTypesSelect from './post-types-select'

/** Default values for an empty map */

/**
 * Map details form.
 *
 * @param props
 */
export default function EditMap() {
	const { maps, dispatchMap } = useGlobalContext()

	function getSelected() {
		if (maps.selected === 'new') return { name: '', description: '', meta: { post_types: [] } }
		const foundMap = maps.list.find(map => map.id === maps.selected)
		return foundMap ? foundMap : {}
	}

	const [map, setMap] = useState({})

	useEffect(() => {
		setMap(getSelected())
	}, [maps])

	async function onSave() {
		if (map.id) {
			const res = await postItem('imagemaps', map.id, map)
			dispatchMap({ type: 'update', payload: res.body })
		} else {
			const res = await createItem('imagemaps', map)
			dispatchMap({ type: 'add', payload: { item: res.body, select: true } })
		}
	}

	async function onDelete() {
		const res = await deleteItem('imagemaps', map.id, { force: true })
		if (!res.body.deleted) throw new Error('To do: handle this!')
		dispatchMap({ type: 'delete', payload: map.id })
	}

	if (map.name === undefined) return <div></div>

	return (
		<>
			<div className='col-xs-9'>
				<TextControl
					label="Name"
					value={map.name}
					onChange={val => setMap({ ...map, name: val })}
					className={cls.field}
				/>
				<TextareaControl
					label="Description"
					value={map.description}
					className={cls.field}
					onChange={val => setMap({ ...map, description: val })}
				/>
				{map.meta &&
					<PostTypesSelect
						selected={map.meta.post_types}
						onSelect={types => setMap(map => ({ ...map, meta: { ...map.meta, post_types: types } }))}
						baseClass={cls.field}
						inputClass={cls.input}
					/>
				}
			</div>
			<div className="col-xs-3">
				<LifeCycleButtons onSave={onSave} onDelete={onDelete} />
			</div>
		</>
	)
}
