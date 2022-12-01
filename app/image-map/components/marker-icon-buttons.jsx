import { ToolbarButton, ToolbarGroup } from '@wordpress/components'

const names = ['post-status', 'sticky', 'star-filled', 'star-empty', 'flag', 'location', 'marker']

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
			{names.map(name => (
				<ToolbarButton
					key={name}
					icon={name}
					onClick={() => onClick(name)}
					isActive={selected === name}
					style={{ color: colour }}
				/>
			))}
		</ToolbarGroup>
	)
}
