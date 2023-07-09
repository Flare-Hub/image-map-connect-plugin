import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import getPopupContent from './popup-content';
import Edit from './edit';
import Save from './save';

import './editor.scss';
import getPopupContentPreview from './popup-content-preview';

addFilter('marker_popup', 'flare-imc', getPopupContent);
addFilter('edit_marker_popup', 'flare-imc', getPopupContentPreview);

registerBlockType('flare-hub/image-map-query', {
	edit: Edit,
	save: Save,
});
