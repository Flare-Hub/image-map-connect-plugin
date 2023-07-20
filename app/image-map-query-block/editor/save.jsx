import { applyFilters } from '@wordpress/hooks';
import PopupContent from './popup-content';

/**
 * Generate block content html
 *
 * @param {Object}                           props
 * @param {import('./edit').BlockAttributes} props.attributes
 */
export default function Save({ attributes }) {
	/**
	 * Use WordPress hook to get marker popup content.
	 *
	 * @type {typeof PopupContent}
	 */
	const PopupTemplate = applyFilters('marker_popup', PopupContent);

	const tags = {
		date: '{{ date }}',
		link: '{{ link }}',
		imc_img_tag: '{{{ imc_img_tag }}}',
		title: { rendered: '{{ title.rendered }}' },
		excerpt: { rendered: '{{{ excerpt.rendered }}}' },
		_embedded: { author: [{ name: '{{ author.name }}' }] },
	};

	return (
		<template>
			<PopupTemplate
				mode="save"
				settings={attributes.popup}
				marker={tags}
			/>
		</template>
	);
}
