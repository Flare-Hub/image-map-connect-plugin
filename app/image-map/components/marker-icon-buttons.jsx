import { ToolbarButton, ToolbarGroup } from '@wordpress/components'
import { icons } from '../utils/marker-icons'

/**
 * A list of marker icons to choose from.
 *
 * @param {Object} props
 * @param {Function} props.onClick The callback to call when a button is clicked, passing the name of the icon.
 * @param {string} props.selected The name of the selected marker icon.
 * @param {string} props.colour The colour of the selected marker icon.
 */
export default function MarkerIconButtons({ onClick, selected, colour }) {
	return (
		<ToolbarGroup style={{ margin: '0 1px' }}>
			{icons.map(icon => (
				<ToolbarButton
					key={icon.icon}
					icon={icon.icon}
					onClick={() => onClick(icon)}
					isActive={selected === icon.icon}
					style={{ color: colour }}
				/>
			))}
		</ToolbarGroup>
	)
}
