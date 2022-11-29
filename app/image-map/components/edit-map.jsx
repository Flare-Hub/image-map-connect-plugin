import { TextControl, TextareaControl } from '@wordpress/components'

import { useGlobalContext } from "../contexts/global"
import LifeCycleButtons from './lifecycle-buttons'

import cls from './edit-form.module.scss'
import PostTypesSelect from './post-types-select'
import useSelected from '../hooks/useSelected'

/**
 * Map details form.
 *
 * @param props
 */
export default function EditMap() {
	const { maps, dispatchMap } = useGlobalContext()

	const [map, setMap] = useSelected(maps, { name: '', description: '', meta: { post_types: [] } })

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
				<LifeCycleButtons collection="imagemaps" item={map} dispatch={dispatchMap} />
			</div>
		</>
	)
}
