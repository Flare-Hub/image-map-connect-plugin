import { BaseControl, ToolbarButton, ToolbarGroup, Dropdown } from '@wordpress/components'
import { forwardRef } from '@wordpress/element'

import cls from './edit-form.module.scss'
import 'remixicon/fonts/remixicon.css'

/** @typedef {import('../../utils/marker-icons').IconImg} Icon */

/**
 * A list of marker icons to choose from.
 *
 * @param {Object} props
 * @param {string} props.label The label for the field.
 * @param {Array<Icon>} props.icons A list of icons to select from.
 * @param {string} props.selected The name of the selected marker icon.
 * @param {string} props.colour The selected colour.
 * @param {number} props.size The default icon size.
 * @param {(icon: Icon) => void} props.onSelect The callback to call when a button is clicked, passing the name of the icon.
 * @param {() => void} props.onBlur Triggered when a button looses focus
 * @param {string} props.className
 */
function IconToolbarButtons(
	{ label, icons, selected, colour, size, onSelect, onBlur, className },
	ref
) {
	return (
		<BaseControl label={label} className={`${cls.iconGroup} ${className}`}>
			<Dropdown
				renderToggle={({ isOpen, onToggle }) => (
					<ToolbarButton
						icon={<i className={selected.ref} style={{ fontSize: size, color: colour }} />}
						onClick={onToggle}
						aria-expanded={isOpen}
						className={cls.iconBtn}
						ref={ref}
					/>
				)}
				renderContent={() => (
					<ToolbarGroup className={cls.iconDropdown}>
						{
							icons.map(icon => (
								<ToolbarButton
									key={icon.ref}
									icon={<i className={icon.ref} style={{ fontSize: size, color: colour }} />}
									onClick={() => onSelect(icon)}
									isActive={selected.ref === icon.ref}
									onBlur={onBlur}
								/>
							))
						}
					</ToolbarGroup>
				)}
				expandOnMobile
			/>

		</BaseControl>
	)
}

export default forwardRef(IconToolbarButtons)
