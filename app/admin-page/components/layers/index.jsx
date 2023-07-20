import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as dataStore } from '@wordpress/core-data';

import useCollection from '../../hooks/useCollection';
import { useRouter } from '../../contexts/router';
import Layout from '../layout';
import EditLayer from './edit-layer';
import useRecord from '../../hooks/useRecord';

/**
 * @typedef {import('react').MutableRefObject<{
 * 		height: number,
 * 		width: number,
 * }>} ImageSize
 */

/**
 * Sort layer by provided ids.
 *
 * @param {Array<Object<string, any>>} list
 * @param {Array<number>}              ids  Ordered list if layer ids.
 */
function sortLayers(list, ids) {
	return [...list].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
}

/**
 * List of maps with details of selected map
 */
export default function Layers() {
	const { query, navigate } = useRouter();

	const { record: map } = useRecord(query.map, 'postType', 'imc-map', {
		_fields: 'id,meta',
	});

	// Load layers into global state
	const { list, loading } = useCollection(
		'taxonomy',
		'imc-layer',
		{ post: +query.map ?? 0, _fields: 'name,id,meta,image_source' },
		[query.map]
	);

	const [layers, setLayers] = useState([]);

	useEffect(() => {
		if (map?.meta?.layer_order) {
			setLayers(sortLayers(list, map?.meta?.layer_order));
		}
	}, [list, map?.meta?.layer_order]);

	const { saveEntityRecord } = useDispatch(dataStore);
	function handleDrag(ids) {
		setLayers(sortLayers(list, ids));
		saveEntityRecord('postType', 'imc-map', {
			id: map.id,
			meta: { layer_order: ids },
		});
	}

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
			list={layers}
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
			sortable
			onChangeOrder={handleDrag}
		>
			<EditLayer imgSize={imgSize} />
		</Layout>
	);
}
