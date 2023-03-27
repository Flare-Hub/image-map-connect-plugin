/**
 * @typedef Icon Marker icon
 * @prop {string} loc Location of the icon image.
 * @prop {('remix'|'url'|'media')} type of location.
 * @prop {number} size Size to display the icon at.
 * @prop {{x: number, y: number}} iconAnchor Position on the icon that the marker is located.
 */

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
		lineHeight: icon.size + 'px',
		fontSize: icon.size,
	}
}

/** Available icons for markers. */
export const icons = [
	{
		loc: 'ri-checkbox-blank-circle-fill',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		loc: 'ri-checkbox-blank-circle-line',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		loc: 'ri-flag-fill',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.1, y: 0.9 },
	},
	{
		loc: 'ri-flag-line',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.1, y: 0.9 },
	},
	{
		loc: 'ri-heart-fill',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		loc: 'ri-heart-line',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		loc: 'ri-map-pin-2-fill',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		loc: 'ri-map-pin-2-line',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		loc: 'ri-map-pin-3-fill',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		loc: 'ri-map-pin-3-line',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		loc: 'ri-pushpin-2-fill',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		loc: 'ri-pushpin-2-line',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		loc: 'ri-star-fill',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 0.6 },
	},
	{
		loc: 'ri-star-line',
		type: 'remix',
		size: 24,
		iconAnchor: { x: 0.5, y: 0.6 },
	},
]
