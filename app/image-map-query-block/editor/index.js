import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import getPopupContent from './popup-content';
import Edit from './edit';
import Save from './save';

import './editor.scss';

addFilter('marker_popup', 'flare-imc', getPopupContent);

registerBlockType('flare-hub/image-map-query', {
	edit: Edit,
	save: Save,
});
