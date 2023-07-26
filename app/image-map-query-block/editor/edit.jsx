/* eslint-disable jsdoc/require-property-description */
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
import DefaultViewPanel from './default-view';
import PopupPanels from './popup-panels';
import { BlockProvider } from './block-context';

/**
 * @typedef BlockAttributes
 * @property {number}  mapId
 * @property {string}  queryType
 * @property {boolean} showStandAlone
 * @property {Object}  initialViews
 * @property {Object}  initialViews.Desktop
 * @property {Object}  initialViews.Tablet
 * @property {Object}  initialViews.Mobile
 * @property {Object}  style
 * @property {Object}  style.color
 * @property {string}  style.color.background
 * @property {string}  style.height
 * @property {Popup}   popup
 */

/**
 * @typedef Popup
 * @property {boolean} blankTarget
 * @property {Object}  dimensions
 * @property {string}  dimensions.height
 * @property {string}  dimensions.width
 * @property {Object}  margins
 * @property {number}  margins.top
 * @property {number}  margins.right
 * @property {number}  margins.bottom
 * @property {number}  margins.left
 * @property {Object}  image
 * @property {boolean} image.show
 * @property {string}  image.height
 * @property {string}  image.width
 * @property {Object}  title
 * @property {boolean} title.show
 * @property {string}  title.tag
 * @property {string}  title.marginBottom
 * @property {Object}  meta
 * @property {boolean} meta.show
 * @property {string}  meta.size
 * @property {string}  meta.marginBottom
 * @property {Object}  excerpt
 * @property {boolean} excerpt.show
 * @property {string}  excerpt.marginBottom
 * @property {string}  excerpt.size
 * @property {number}  excerpt.line
 */

/**
 * @typedef EditorContext
 * @property {Object<string, any>}   query
 * @property {string}                templateSlug
 * @property {string}                previewPostType
 * @property {Array<{page: number}>} queryContext
 */

/**
 * Edit map query block.
 *
 * @param {Object}                                    props
 * @param {BlockAttributes}                           props.attributes
 * @param {(attrs: Partial<BlockAttributes>) => void} props.setAttributes
 * @param {EditorContext}                             props.context
 * @param {string}                                    props.clientId
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
	const [mapSize, setMapSize] = useState();

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

	const blockProps = useBlockProps({ style: { height: style.height } });

	return (
		<div {...blockProps}>
			<BlockProvider
				value={{
					attributes,
					setAttributes,
					context,
					setMapSize,
				}}
			>
				{mapId && (
					<BlockControls group="inline">
						<ToolbarButton
							label={__(
								'Select another image map to display',
								'image-map-connect'
							)}
							text={__('Replace map', 'image-map-connect')}
							onClick={handleReplace}
							showTooltip
						/>
					</BlockControls>
				)}
				<InspectorControls group="settings">
					<MarkerQueryPanel
						hasQuery={!!query}
						queryType={queryType}
						setQueryType={setAttr.bind(null, 'queryType')}
						showStandAlone={showStandAlone}
						setShowStandAlone={setAttr.bind(null, 'showStandAlone')}
					/>
					<DefaultViewPanel />
					<PopupPanels mapSize={mapSize} />
				</InspectorControls>
				<InspectorControls group="dimensions">
					<ToolsPanelItem
						panelId={clientId}
						label={__('Map Height', 'image-map-connect')}
						hasValue={() => style.height !== undefined}
					>
						<UnitControl
							label={__('Height', 'image-map-connect')}
							value={style.height}
							onChange={(val) =>
								setAttributes({
									style: { ...style, height: val },
								})
							}
							help={__(
								'Image will never show larger than 92% of the viewport height.',
								'image-map-connect'
							)}
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
			</BlockProvider>
		</div>
	);
}
