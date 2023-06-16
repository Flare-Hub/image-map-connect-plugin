import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import MapSelector from './map-selector';
import MarkerQueryPanel from './marker-query';
import Map from './map';

/**
 * Edit map query block.
 *
 * @param {Object}                       props
 * @param {Object<string, any>}          props.attributes
 * @param {(attrs: Partial<{}>) => void} props.setAttributes
 * @param {Object<string, any>}          props.context
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const { mapId, queryType, showStandAlone, initialView } = attributes;
	const {
		query,
		templateSlug,
		previewPostType,
		queryContext: [ { page } ] = [ {} ],
	} = context;

	const [ prevAttr, setPrevAttr ] = useState( null );

	/** Store backup of mapId (to enable cancel) and clear value. */
	function handleReplace() {
		setAttributes( { mapId: null, initialView: {} } );
		setPrevAttr( { mapId, initialView } );
	}

	/**
	 * Set mapId attribute
	 *
	 * @param {string} attr
	 * @param {any}    val
	 */
	function setAttr( attr, val ) {
		setAttributes( { [ attr ]: val } );
	}

	return (
		<div { ...useBlockProps() }>
			{ mapId && (
				<BlockControls group="inline">
					<ToolbarButton
						text={ __( 'Replace map', 'flare-im' ) }
						onClick={ handleReplace }
					/>
				</BlockControls>
			) }
			<InspectorControls>
				<MarkerQueryPanel
					hasQuery={ !! query }
					queryType={ queryType }
					setQueryType={ setAttr.bind( null, 'queryType' ) }
					showStandAlone={ showStandAlone }
					setShowStandAlone={ setAttr.bind( null, 'showStandAlone' ) }
				/>
			</InspectorControls>
			{ mapId ? (
				<Map
					mapId={ mapId }
					queryType={ queryType }
					queryParams={ query }
					templateSlug={ templateSlug }
					previewPostType={ previewPostType }
					showStandAlone={ showStandAlone }
					page={ page }
					initialView={ initialView }
					setView={ setAttr.bind( null, 'initialView' ) }
				/>
			) : (
				<MapSelector
					mapId={ mapId }
					setAttr={ setAttributes }
					prevAttr={ prevAttr }
					setPrevAttr={ setPrevAttr }
				/>
			) }
		</div>
	);
}
