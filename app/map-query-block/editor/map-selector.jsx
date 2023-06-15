import { ComboboxControl, Button, Placeholder, BaseControl } from "@wordpress/components"
import { useEntityProp, useEntityRecords } from "@wordpress/core-data"
import { useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"
import { update } from "@wordpress/icons"

import blockMeta from "../block.json"
import cls from "./map-selector.module.scss"
import useNotice from "common/utils/use-notice"

/**
 * Get Combobox options from a list of entity records.
 * @param {ReturnType<import('@wordpress/core-data').useEntityRecords>} maps
 */
function getMapOptions({ status, records: maps }) {
	switch (status) {
		case 'ERROR':
			return []

		case 'SUCCESS':
			return maps.map(map => ({ label: map.title.rendered, value: map.id }))

		default:
			return [{ label: __('Loading...', 'flare'), value: '' }]
	}
}


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
	const [fetchCount, setFetchCount] = useState(1)

	// Get maps from backend
	const maps = useEntityRecords('postType', 'map', { enabled: fetchCount })

	// Display error if maps cannot be fetched
	useNotice(
		maps.status === 'ERROR',
		__('An error occurred retrieving the maps. Please refresh the page to try again.', 'flare'),
		[maps.status]
	)

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
			<div className={cls.controls}>
				<div className={cls.select}>
					<ComboboxControl
						label={__('Select map', blockMeta.textdomain)}
						value={mapId}
						onChange={handleSelectMap}
						options={getMapOptions(maps)}
					/>
					<Button
						icon={update}
						onClick={() => setFetchCount(fetchCount + 1)}
						label={__('Refresh map list', blockMeta.textdomain)}
					/>
				</div>
				<BaseControl label={__('Or add new map', blockMeta.textdomain)} >
					<div className={cls.buttons}>
						<Button
							variant="primary"
							onClick={handleAddMap}
							text={__('Add map', blockMeta.textdomain)}
						/>
						{prevAttr && (
							<Button
								variant="primary"
								isDestructive
								text={__('Cancel', blockMeta.textdomain)}
								onClick={handleCancelReplace}
							/>
						)}
					</div>
				</BaseControl>
			</div>
		</Placeholder>
	)
}
