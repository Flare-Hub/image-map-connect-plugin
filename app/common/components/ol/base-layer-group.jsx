import { useEffect } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import { __ } from '@wordpress/i18n';
import useNotice from 'common/utils/use-notice';
import { useMap } from './context';
import ImageLayer from './image-layer';

/**
 * Add OpenLayers layer group with base layers, and layer switcher, to map.
 *
 * @param {Object}                       props               Props
 * @param {Object<string, any>}          props.mapId         WordPress map ID to fetch the layer list from.
 * @param {number}                       [props.selLayerId]  Id of the Layer that is selected when initializing this component.
 * @param {(selLayerId: number) => void} props.setSelLayerId Setter for the selected layer.
 */
export default function BaseLayerGroup( { mapId, selLayerId, setSelLayerId } ) {
	const { controlBar } = useMap();

	// Get layers for selected map from WordPress.
	const { records: layers, status } = useEntityRecords(
		'taxonomy',
		'imc-layer',
		{
			post: mapId,
			per_page: -1,
			_embed: true,
		}
	);

	useNotice(
		status === 'ERROR',
		__(
			'Error loading layers. Please refresh the application to try again.',
			'flare-imc'
		),
		[ status ]
	);

	// Add layer switcher control to switch base layers.
	useEffect( () => {
		const switcher = new LayerSwitcher( {
			reordering: false,
			noScroll: true,
			mouseover: true,
			displayInLayerSwitcher: ( layer ) => layer.get( 'baseLayer' ),
			// Propagate the selected layer.
			onchangeCheck: ( layer ) => setSelLayerId( layer.get( 'wpId' ) ),
		} );

		// Only add the control if there is more than 1 layer.
		if ( layers?.length > 1 ) controlBar.addControl( switcher );

		return () => controlBar.removeControl( switcher );
	}, [ controlBar, setSelLayerId, layers ] );

	if ( ! layers ) return null;

	return layers.map( ( layer ) => (
		<ImageLayer
			layer={ layer }
			visible={ layer.id === ( selLayerId ?? layers[ 0 ].id ) }
			loaded
			key={ layer.id }
		/>
	) );
}
