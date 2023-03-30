import { ComboboxControl, Button, Placeholder, BaseControl } from "@wordpress/components"
import { useEntityProp } from "@wordpress/core-data"
import { useSelect } from "@wordpress/data"
import { useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"
import { update } from "@wordpress/icons"

import blockMeta from "../block.json"

/**
 * Map selector to display when no map is selected
 *
 * @param {object} props
 * @param {string} props.mapId ID of the selected map.
 * @param {(mapId: string|null) => void} props.setAttr Setter for mapId.
 * @param {Object<string, any>|null} props.prevAttr Map Id of the previously selected map when replacing.
 * @param {(mapId: string|null) => void} props.setPrevAttr Setter for prevMapId.
 */
export default function MapSelector({ mapId, setAttr, prevAttr, setPrevAttr }) {
	// Use counter to ensure imagemaps are fetched from backend whenever counter is updated.
	const [updCount, setUpdCount] = useState(0)

	// Get imagemaps from backend
	const maps = useSelect(
		select => select('core').getEntityRecords('taxonomy', 'imagemap', { parent: 0, updCount }),
		[updCount]
	) ?? []

	const [baseUrl] = useEntityProp('root', 'site', 'url')

	/** Update mapId and clear previous mapId (disables cancel) */
	function handleSelectMap(newMapId) {
		setAttr({ mapId: newMapId })
		setPrevAttr(null)
	}

	/** Open Add Map page in new tab. */
	function handleAddMap() {
		if (!baseUrl) return
		const url = new URL('/wp-admin/admin.php', baseUrl)
		url.searchParams.set('page', 'image-map')
		url.searchParams.set('tab', 'maps')
		url.searchParams.set('map', 'new')
		window.open(url, '_blank').focus()
	}

	/** Set mapId back to what it was before replacing. */
	function handleCancelReplace() {
		setAttr(prevAttr)
		setPrevAttr(null)
	}

	return (
		<Placeholder
			icon="location-alt"
			label={__('Image map', blockMeta.textdomain)}
			instructions={__('Select a map or add a new map to display in this block.')}
		>
			<div className="flare-map-options">
				<div className="flare-select-map">
					<ComboboxControl
						label={__('Select map', blockMeta.textdomain)}
						value={mapId}
						onChange={handleSelectMap}
						options={maps.map(map => ({ label: map.name, value: map.id }))}
					/>
					<Button
						icon={update}
						onClick={() => setUpdCount(updCount + 1)}
						label={__('Refresh map list', blockMeta.textdomain)}
					/>
				</div>
				<BaseControl label={__('Or add new map', blockMeta.textdomain)} >
					<div>
						<Button
							variant="primary"
							onClick={handleAddMap}
							text={__('Add map', blockMeta.textdomain)}
						/>
					</div>
				</BaseControl>
				{prevAttr && (
					<BaseControl className="flare-cancel-replace">
						<Button
							variant="primary"
							isDestructive
							text={__('Cancel', blockMeta.textdomain)}
							onClick={handleCancelReplace}
						/>
					</BaseControl>
				)}
			</div>
		</Placeholder>
	)
}
