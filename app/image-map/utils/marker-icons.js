/**
 * Style a marker icon according to it's settings.
 * @param {Object<string, any} icon The metadata of the icon to style.
 * @param {boolean} setPosition Whether to position the icon to show the accurate location.
 * @returns {React.CSSProperties}
 */
export function getStyles(icon, setPosition = true) {
	/** @type {React.CSSProperties} */
	const styles = {
		color: icon.colour,
		height: icon.size.y,
		width: icon.size.x,
		fontSize: icon.size.x,
	}

	if (setPosition) {
		styles.marginLeft = -(icon.size.x * icon.iconAnchor.x)
		styles.marginTop = -(icon.size.y * icon.iconAnchor.y)
	}

	return styles
}

/** Available icons for markers. */
export const icons = [
	{
		icon: 'post-status',
		size: { x: 24, y: 24 },
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		icon: 'sticky',
		size: { x: 24, y: 24 },
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		icon: 'star-filled',
		size: { x: 24, y: 24 },
		iconAnchor: { x: 0.5, y: 0.6 },
	},
	{
		icon: 'star-empty',
		size: { x: 24, y: 24 },
		iconAnchor: { x: 0.5, y: 0.6 },
	},
	{
		icon: 'flag',
		size: { x: 24, y: 24 },
		iconAnchor: { x: 0.2, y: 0.9 },
	},
	{
		icon: 'location',
		size: { x: 24, y: 24 },
		iconAnchor: { x: 0.5, y: 0.9 },
	},
	{
		icon: 'marker',
		size: { x: 24, y: 24 },
		iconAnchor: { x: 0.5, y: 0.5 },
	},
]
