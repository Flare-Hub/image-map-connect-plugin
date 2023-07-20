/**
 * @typedef IconImg Marker icon
 * @property {string}                  ref        Location of the icon image.
 * @property {('remix'|'url'|'media')} type       of location.
 * @property {number}                  [size]     Size to display the icon at.
 * @property {{x: number, y: number}}  iconAnchor Position on the icon that the marker is located.
 */

/**
 * Style a marker icon according to it's settings.
 *
 * @param {{colour: string, size: number}} meta The metadata of the icon to style.
 */
export function getStyles( meta ) {
	/** @type {import('react').CSSProperties} */
	return {
		color: meta.colour,
		height: meta.size,
		lineHeight: meta.size + 'px',
		fontSize: meta.size,
	};
}

/** @type {IconImg} Available icons for markers. */
export const icons = [
	{
		ref: 'ri-checkbox-blank-circle-fill',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		ref: 'ri-checkbox-blank-circle-line',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		ref: 'ri-flag-fill',
		type: 'remix',
		iconAnchor: { x: 0.1, y: 0.9 },
	},
	{
		ref: 'ri-flag-line',
		type: 'remix',
		iconAnchor: { x: 0.1, y: 0.9 },
	},
	{
		ref: 'ri-heart-fill',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		ref: 'ri-heart-line',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 0.5 },
	},
	{
		ref: 'ri-map-pin-2-fill',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		ref: 'ri-map-pin-2-line',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		ref: 'ri-map-pin-3-fill',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		ref: 'ri-map-pin-3-line',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		ref: 'ri-pushpin-2-fill',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		ref: 'ri-pushpin-2-line',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 1 },
	},
	{
		ref: 'ri-star-fill',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 0.6 },
	},
	{
		ref: 'ri-star-line',
		type: 'remix',
		iconAnchor: { x: 0.5, y: 0.6 },
	},
];
