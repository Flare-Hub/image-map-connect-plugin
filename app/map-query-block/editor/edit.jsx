import { BlockControls, InspectorControls, useBlockProps } from "@wordpress/block-editor"
import {
	PanelBody,
	ToolbarButton,
	__experimentalUnitControl as UnitControl
} from "@wordpress/components"
import { useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

import MapSelector from "./map-selector"
import blockMeta from "../block.json"
import MarkerQueryPanel from "./marker-query"
import Map from "./map"

/**
 * Edit map query block.
 *
 * @param {object} props
 * @param {object} props.attributes
 * @param {number} props.attributes.mapId ID of the selected map.
 * @param {(attrs: Partial<{}>) => void} props.setAttributes
 */
export default function Edit({
	attributes: { mapId, height, width, queryType, showStandAlone },
	setAttributes,
	context: {
		query,
		templateSlug,
		previewPostType,
		queryContext: [{ page }] = [{}]
	},
}) {
	const [prevMapId, setPrevMapId] = useState(null)

	/** Store backup of mapId (to enable cancel) and clear value. */
	function handleReplace() {
		setAttributes({ mapId: null })
		setPrevMapId(mapId)
	}

	/** Set mapId attribute */
	function setAttr(attr, val) {
		setAttributes({ [attr]: val })
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
		<InspectorControls>
			<MarkerQueryPanel
				hasQuery={!!query}
				queryType={queryType}
				setQueryType={setAttr.bind(null, 'queryType')}
				showStandAlone={showStandAlone}
				setShowStandAlone={setAttr.bind(null, 'showStandAlone')}
			/>
			<PanelBody title={__('Size', blockMeta.textdomain)} initialOpen={false}>
				<UnitControl
					label={__('Width', blockMeta.textdomain)}
					value={width}
					onChange={val => setAttributes({ width: val })}
				/>
				<UnitControl
					label={__('Height', blockMeta.textdomain)}
					value={height}
					onChange={val => setAttributes({ height: val })}
				/>
			</PanelBody>
		</InspectorControls>
		<MapSelector
			mapId={mapId}
			setMapId={setAttr.bind(null, 'mapId')}
			prevMapId={prevMapId}
			setPrevMapId={setPrevMapId}
		/>
		<Map
			queryType={queryType}
			queryParams={query}
			templateSlug={templateSlug}
			previewPostType={previewPostType}
			page={page}
		/>
	</div>
}
