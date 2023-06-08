import { CustomSelectControl, BaseControl } from '@wordpress/components'
import { useEffect, useMemo } from '@wordpress/element'

import { useRouter } from '../../contexts/router'
import useRecord from '../../hooks/useRecord'

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
	const { record, status } = useRecord(query.map, 'postType', 'map', { _fields: 'icon_details' })

	// Format icon for dropdown.
	const icons = useMemo(() => record?.icon_details?.map(icon => ({
		key: icon.id,
		name: <span>
			<i className={icon.img.ref} style={{ color: icon.colour }} />
			<span className={cls.iconName}>{icon.name}</span>
		</span>
	})) ?? [], [record])

	// Set first icon in list by default if no icon is provided.
	useEffect(() => {
		if (!value && icons && icons.length) {
			onSelect(icons[0].key)
		}
	}, [value, icons])

	return (
		<BaseControl label={label} className={className}>
			<CustomSelectControl
				value={icons.find(icon => icon.key === value)}
				onChange={item => onSelect(item.selectedItem.key)}
				onBlur={onBlur}
				options={status === 'loading' ? { name: 'Loading...' } : icons}
				__nextUnconstrainedWidth
				className={cls.select}
			/>
		</BaseControl>
	)
}
