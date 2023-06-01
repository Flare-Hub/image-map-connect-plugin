import { CustomSelectControl, BaseControl } from '@wordpress/components'
import { useMemo } from '@wordpress/element'

import { useRouter } from '../../contexts/router'
import useCollection from '../../hooks/useCollection'

import cls from './edit-form.module.scss'

/**
 * Marker icon selector.
 *
 * @param {object} props
 * @param props.label The label for the field.
 * @param {number} props.value The selected marker icon.
 * @param {(icon: number) => any} props.onSelect Callback that is called when a post type is selected.
 * @param {(event: FocusEvent<HTMLSelectElement, Element>) => void} props.onBlur Callback that is called when the dropdown is blurred.
 * @param {string} props.className
 */
export default function MarkerIconSelect({ label, value, onSelect, onBlur, className }) {
	const { query } = useRouter()

	// Get icons from WordPress.
	const { list, loading } = useCollection(
		'taxonomy',
		'marker-icon',
		{ post: +query.map ?? 0 },
		[query.map]
	)

	// Format icon for dropdown.
	const icons = useMemo(() => list.map(icon => ({
		key: icon.id,
		name: <span>
			<i className={icon.meta.img.ref} style={{ color: icon.meta.colour }} />
			<span className={cls.iconName}>{icon.name}</span>
		</span>
	})), [list])

	return (
		<BaseControl label={label} className={className}>
			<CustomSelectControl
				value={icons.find(icon => icon.key === value)}
				onChange={item => onSelect(item.selectedItem.key)}
				onBlur={onBlur}
				options={loading ? { name: 'Loading...' } : icons}
				__nextUnconstrainedWidth
				className={cls.select}
			/>
		</BaseControl>
	)
}
