import { CustomSelectControl, Icon, BaseControl } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'

import { getCollection } from '../../../common/utils/wp-fetch'
import { useRouter } from '../../contexts/router'

import cls from './edit-form.module.scss'

/**
 * Marker icon selector.
 *
 * @param {object} props
 * @param props.label The label for the field.
 * @param {number} props.value The selected marker icon.
 * @param {(icon: number) => any} props.onSelect Callback that is called when a post type is selected.
 */
export default function MarkerIconSelect({ label, value, onSelect }) {
	const { query } = useRouter()
	const [icons, setIcons] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getCollection('marker-icons', { post: query.map }).then(({ body }) => {
			const newIcons = body.map(icon => ({
				key: icon.id,
				name: <span>
					<i className={icon.meta.img.ref} style={{ color: icon.meta.colour }} />
					<span className={cls.iconName}>{icon.name}</span>
				</span>
			}))
			setIcons(Object.values(newIcons))
			setLoading(false)
		})
	}, [query.map])

	return (
		<BaseControl label={label} className={cls.field}>
			<CustomSelectControl
				value={icons.find(icon => icon.key === value)}
				onChange={item => onSelect(item.selectedItem.key)}
				options={loading ? { name: 'Loading...' } : icons}
				__nextUnconstrainedWidth
				className={cls.select}
			/>
		</BaseControl>
	)
}
