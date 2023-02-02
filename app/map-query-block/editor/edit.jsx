import { BlockControls, InspectorControls, useBlockProps } from "@wordpress/block-editor"
import {
	BaseControl,
	Button,
	ButtonGroup,
	PanelBody,
	ToggleControl,
	ToolbarButton,
	__experimentalUnitControl as UnitControl
} from "@wordpress/components"
import { useState } from "@wordpress/element"
import { __ } from "@wordpress/i18n"

import MapSelector from "./map-selector"
import blockMeta from "../block.json"

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
	context,
}) {
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
		<InspectorControls>
			<PanelBody title={__('Marker query')}>
				{context.query && (
					<>
						<BaseControl
							label={__('Show markers for', blockMeta.textdomain)}
							help={__('Help text goes here', blockMeta.textdomain)}
						>
							<ButtonGroup>
								<Button
									variant={queryType === 'page' ? 'primary' : 'secondary'}
									onClick={() => setAttributes({ queryType: 'page' })}
								>
									{__('Current page')}
								</Button>
								<Button
									variant={queryType === 'query' ? 'primary' : 'secondary'}
									onClick={() => setAttributes({ queryType: 'query' })}
								>
									{__('Whole query loop')}
								</Button>
							</ButtonGroup>
						</BaseControl>
						<ToggleControl
							label={__('Also display standalone markers', blockMeta.textdomain)}
							checked={showStandAlone}
							onChange={() => setAttributes({ showStandAlone: !showStandAlone })}
							help={__('Help text goes here', blockMeta.textdomain)}
						/>
					</>
				)}
				{!context.query && (
					<p>
						This block will show all posts on the selected map.
						To filter the posts, place this block inside a query block.
					</p>
				)}
			</PanelBody>
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
			setMapId={setMapId}
			prevMapId={prevMapId}
			setPrevMapId={setPrevMapId}
		/>
	</div>
}
