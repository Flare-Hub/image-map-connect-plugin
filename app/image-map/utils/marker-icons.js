/**
 * Style a marker icon according to it's settings.
 * @param {Object<string, any} icon The metadata of the icon to style.
 * @param {boolean} setPosition Whether to position the icon to show the accurate location.
 * @returns {React.CSSProperties}
 */
export function getStyles(icon) {
	/** @type {React.CSSProperties} */
	return {
		color: icon.colour,
		height: icon.size,
		width: icon.size,
		fontSize: icon.size,
	}
}

/** Available icons for markers. */
export const icons = [
	{
		icon: 'post-status',
		size: 24,
		iconAnchor: { x: '50%', y: '100%' },
	},
	{
		icon: 'sticky',
		size: 24,
		iconAnchor: { x: '50%', y: '100%' },
	},
	{
		icon: 'star-filled',
		size: 24,
		iconAnchor: { x: '50%', y: '60%' },
	},
	{
		icon: 'star-empty',
		size: 24,
		iconAnchor: { x: '50%', y: '60%' },
	},
	{
		icon: 'flag',
		size: 24,
		iconAnchor: { x: '20%', y: '90%' },
	},
	{
		icon: 'location',
		size: 24,
		iconAnchor: { x: '50%', y: '90%' },
	},
	{
		icon: 'marker',
		size: 24,
		iconAnchor: { x: '50%', y: '50%' },
	},
]
