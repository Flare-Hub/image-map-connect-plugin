import { CustomSelectControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import cls from './edit-form.module.scss';

/**
 * Marker icon selector.
 *
 * @param {Object}                                                  props
 * @param {string}                                                  props.label     The label for the field.
 * @param {number}                                                  props.value     The selected marker icon.
 * @param {(icon: number) => any}                                   props.onSelect  Callback that is called when a post type is selected.
 * @param {(event: FocusEvent<HTMLSelectElement, Element>) => void} props.onBlur    Callback that is called when the dropdown is blurred.
 * @param {Array<Object<string, any>>}                              props.icons     Icon types for the map.
 * @param {string}                                                  props.className
 */
export default function MarkerIconSelect({
	label,
	value,
	onSelect,
	onBlur,
	icons,
	className,
}) {
	// Format icon for dropdown.
	const iconOptions = useMemo(
		() =>
			icons?.map((icon) => ({
				key: icon.id,
				name: (
					<span>
						<i
							className={icon.img.ref}
							style={{ color: icon.colour }}
						/>
						<span className={cls.iconName}>{icon.name}</span>
					</span>
				),
			})) ?? [],
		[icons]
	);

	return (
		<div className={className}>
			<CustomSelectControl
				label={label}
				value={iconOptions.find((icon) => icon.key === value)}
				onChange={(item) => onSelect(item.selectedItem.key)}
				onBlur={onBlur}
				options={iconOptions ?? { name: 'Loading...' }}
				__nextUnconstrainedWidth
			/>
		</div>
	);
}
