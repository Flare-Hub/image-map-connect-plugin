import { BaseControl, ToolbarButton, ToolbarGroup } from '@wordpress/components'

import cls from './edit-form.module.scss'
import 'remixicon/fonts/remixicon.css'
/**
 * A list of marker icons to choose from.
 *
 * @param {Object} props
 * @param {string} props.label The label for the field.
 * @param {Array<import('../../utils/marker-icons').Icon>} props.icons A list of icons to select from.
 * @param {Function} props.onClick The callback to call when a button is clicked, passing the name of the icon.
 * @param {string} props.selected The name of the selected marker icon.
 * @param {string} props.colour The colour of the selected marker icon.
 */
export default function IconToolbarButtons({ label, icons, onClick, selected, colour }) {
	return (
		<BaseControl label={label} className={`${cls.field} ${cls.iconGroup}`}>
			<ToolbarGroup style={{ margin: '0 1px' }}>
				{icons.map(icon => (
					<ToolbarButton
						key={icon.loc}
						icon={<i className={icon.loc} style={{ fontSize: icon.size, color: colour }} />}
						onClick={() => onClick(icon)}
						isActive={selected === icon.loc}
					/>
				))}
			</ToolbarGroup>
		</BaseControl>
	)
}
