import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';

import './editor.scss';

registerBlockType('flare-hub/image-map-query', {
	edit: Edit,
	save: Save,
});
