import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';

import useCollection from '../../hooks/useCollection';
import { useRouter } from '../../contexts/router';
import Layout from '../layout';
import EditLayer from './edit-layer';

/**
 * @typedef {import('react').MutableRefObject<{
 * 		height: number,
 * 		width: number,
 * }>} ImageSize
 */

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { query, navigate } = useRouter();

	// Load layers into global state
	const { list, loading } = useCollection(
		'taxonomy',
		'imc-layer',
		{ post: +query.map ?? 0, _fields: 'name,id,meta,image_source' },
		[query.map]
	);

	/**
	 * common image size for all layers in map.
	 *
	 * @type {ImageSize}
	 */
	const imgSize = useRef({});

	useEffect(() => {
		imgSize.current =
			list.length > 1 || (query.layer === 'new' && list.length)
				? {
						height: list[0].image_source.height,
						width: list[0].image_source.width,
				  }
				: {};
	}, [list, query.layer]);

	/**
	 * Update layer in query attributes and unset marker.
	 *
	 * @param {string|null} layer
	 */
	function setLayer(layer) {
		navigate({
			layer,
			marker: null,
		});
	}

	return (
		<Layout
			list={list}
			titleAttr="name"
			selected={+query.layer}
			selectItem={setLayer}
			loading={loading && !(list && list.length)}
			addButton={
				<Button
					variant="primary"
					className="medium"
					onClick={() => setLayer('new')}
				>
					{__('Add Layer')}
				</Button>
			}
		>
			<EditLayer imgSize={imgSize} />
		</Layout>
	);
}
