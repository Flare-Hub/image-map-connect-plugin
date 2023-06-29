import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';

import './editor.scss';

registerBlockType( 'flare-hub/image-map', {
	edit: Edit,
} );
