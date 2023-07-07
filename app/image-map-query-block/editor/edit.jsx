import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	ToolbarButton,
	__experimentalToolsPanelItem as ToolsPanelItem, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import MapSelector from './map-selector';
import MarkerQueryPanel from './marker-query';
import Map from './map';

import { attributes as attrSettings } from '../block.json';
import InitialViewPanel from './initial-view';

/**
 * Edit map query block.
 *
 * @param {Object}                       props
 * @param {Object<string, any>}          props.attributes
 * @param {(attrs: Partial<{}>) => void} props.setAttributes
 * @param {Object<string, any>}          props.context
 * @param {string}                       props.clientId
 */
export default function Edit({ attributes, setAttributes, context, clientId }) {
	const { mapId, queryType, showStandAlone, initialViews, style } =
		attributes;
	const {
		query,
		templateSlug,
		previewPostType,
		queryContext: [{ page }] = [{}],
	} = context;

	const [prevAttr, setPrevAttr] = useState(null);

	/** Store backup of mapId (to enable cancel) and clear value. */
	function handleReplace() {
		setAttributes({
			mapId: null,
			initialView: attrSettings.initialViews.default,
		});
		setPrevAttr({ mapId, initialViews });
	}

	/**
	 * Set mapId attribute
	 *
	 * @param {string} attr
	 * @param {any}    val
	 */
	function setAttr(attr, val) {
		setAttributes({ [attr]: val });
	}

	return (
		<div {...useBlockProps({ style: { height: style.height } })}>
			{mapId && (
				<BlockControls group="inline">
					<ToolbarButton
						label={__(
							'Select another image map to display',
							'flare-imc'
						)}
						text={__('Replace map', 'flare-imc')}
						onClick={handleReplace}
						showTooltip
					/>
				</BlockControls>
			)}
			<InspectorControls>
				<InitialViewPanel />
				<MarkerQueryPanel
					hasQuery={!!query}
					queryType={queryType}
					setQueryType={setAttr.bind(null, 'queryType')}
					showStandAlone={showStandAlone}
					setShowStandAlone={setAttr.bind(null, 'showStandAlone')}
				/>
			</InspectorControls>
			<InspectorControls group="dimensions">
				<ToolsPanelItem
					panelId={clientId}
					label={__('Map Height', 'flare-imc')}
					hasValue={() => style.height !== undefined}
				>
					<UnitControl
						label={__('Map Height', 'flare-imc')}
						value={style.height}
						onChange={(val) =>
							setAttributes({
								style: { ...style, height: val },
							})
						}
					/>
				</ToolsPanelItem>
			</InspectorControls>
			{mapId ? (
				<Map
					mapId={mapId}
					queryType={queryType}
					queryParams={query}
					templateSlug={templateSlug}
					previewPostType={previewPostType}
					showStandAlone={showStandAlone}
					page={page}
					initialViews={initialViews}
					setView={setAttr.bind(null, 'initialViews')}
				/>
			) : (
				<MapSelector
					mapId={mapId}
					setAttr={setAttributes}
					prevAttr={prevAttr}
					setPrevAttr={setPrevAttr}
				/>
			)}
		</div>
	);
}
