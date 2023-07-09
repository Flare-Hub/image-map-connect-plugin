import { useEffect, useState, createPortal, useRef } from '@wordpress/element';
import { store as dataStore } from '@wordpress/core-data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { Select } from 'ol/interaction';
import Popup from 'ol-ext/overlay/Popup';
import { useMap } from 'common/components/ol/context';
import { useSelect } from '@wordpress/data';

/** @typedef {import('ol-ext/overlay/Popup').default} Popup */

/**
 * Add ol-ext popup to an OpenLayers layer.
 *
 * @param {Object}                    props
 * @param {import('ol/layer').Vector} props.layer OpenLayers layer to add the popup to.
 */
export default function MarkerPopup({ layer }) {
	const { map } = useMap();

	/**
	 * The ol-ext popup object.
	 *
	 * @type {[Popup, import('react').Dispatch<Popup>]}
	 */
	const [popup, setPopup] = useState();

	/** The target container for the popup content. */
	const content = useRef(document.createElement('div'));

	// Ge the marker from WordPress.
	const [{ postType, id }, setMarker] = useState({});

	/** @type {import('../../admin-page/components/markers/marker-form').Marker} */
	const marker = useSelect(
		(select) =>
			select(dataStore).getEntityRecord('postType', postType, id, {
				_fields:
					'id,type,status,title,excerpt,date,modified,featured_media,meta,imc_img_tag,_embedded',
				_embed: true,
			}),
		[postType, id]
	);

	// Set the popup and popup state based on the selected marker
	useEffect(() => {
		/** Interaction to select markers. */
		const selector = new Select({
			style: null,
			layers: [layer],
			hitTolerance: 6,
		});

		map.addInteraction(selector);

		/** Marker popup. */
		const newPopup = new Popup({
			popupClass: 'flare-marker-popup',
			closeBox: true,
			positioning: 'auto',
			onclose: () => selector.getFeatures().clear(),
			autoPan: { animation: { duration: 500 } },
		});

		map.addOverlay(newPopup);

		setPopup(newPopup);

		/**
		 * Open popup for selected feature and update selected marker props.
		 *
		 * @param {{element: import('ol').Feature<import('ol/geom').Point>}} e
		 */
		function handleSelect(e) {
			// Show loading indicator.
			const point = e.element?.getGeometry()?.getCoordinates();
			if (point) newPopup.show(point, content.current);

			setMarker({
				postType: e.element?.get('postType'),
				id: e.element?.get('markerId'),
			});
		}

		/** Clear selected marker on closing popup. */
		function handleDeselect() {
			setMarker({});
			newPopup.hide();
		}

		const features = selector.getFeatures();
		features.on('add', handleSelect);
		features.on('remove', handleDeselect);

		return () => {
			features.un('add', handleSelect);
			features.un('remove', handleDeselect);
			features.clear();
			map.removeOverlay(newPopup);
		};
	}, [layer, map]);

	// Set the popup content based on the selected marker
	useEffect(() => {
		if (marker?.status) {
			popup?.performAutoPan();
		} else {
			popup?.hide();
		}
	}, [marker?.status, popup]);

	/**
	 * Use WordPress hook to get marker popup content.
	 *
	 * @type {import('./popup-content').PopupContent}
	 */
	const PopupTemplate = applyFilters('edit_marker_popup');

	return createPortal(
		marker?.status ? (
			<PopupTemplate marker={marker} />
		) : (
			<p className="flare-popup-desc flare-popup-title">
				<strong>{__('Loading')}...</strong>
			</p>
		),
		content.current
	);
}
