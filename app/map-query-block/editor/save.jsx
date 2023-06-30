import { applyFilters } from '@wordpress/hooks';

/** Generate block content html */
export default function Save() {
	// Use WordPress hook to get marker popup content.
	const PopupTemplate = applyFilters( 'marker_popup' );

	return (
		<template>
			<PopupTemplate />
		</template>
	);
}
