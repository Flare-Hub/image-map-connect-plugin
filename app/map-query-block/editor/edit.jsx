import { BlockControls, useBlockProps } from "@wordpress/block-editor"
import { ToolbarButton } from "@wordpress/components"
import { useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

import blockMeta from "../block.json"
import MapSelector from "./map-selector"

/**
 * Edit map query block.
 *
 * @param {object} props
 * @param {object} props.attributes
 * @param {number} props.attributes.mapId ID of the selected map.
 * @param {(attrs: Partial<{}>) => void} props.setAttributes
 */
export default function Edit({ attributes: { mapId }, setAttributes }) {
	const [prevMapId, setPrevMapId] = useState(null)

	/** Store backup of mapId (to enable cancel) and clear value. */
	function handleReplace() {
		setAttributes({ mapId: null })
		setPrevMapId(mapId)
	}

	/** Set mapId attribute */
	function setMapId(newMapId) {
		setAttributes({ mapId: newMapId })
	}

	return <div {...useBlockProps()}>
		{mapId && (
			<BlockControls group="inline">
				<ToolbarButton
					text={__('Replace map', blockMeta.textdomain)}
					onClick={handleReplace}
				/>
			</BlockControls>
		)}
		<MapSelector
			mapId={mapId}
			setMapId={setMapId}
			prevMapId={prevMapId}
			setPrevMapId={setPrevMapId}
		/>
	</div>
}
