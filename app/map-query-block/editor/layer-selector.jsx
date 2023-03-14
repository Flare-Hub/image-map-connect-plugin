import { useState, useEffect } from "@wordpress/element";
import { getCollection, getItem } from "common/utils/wp-fetch";

/**
 * Control to select a layer from the list of layers on a map.
 * @param {object} props
 * @param {string} props.map ID of the map to display the layers for.
 * @param {object<string, any>} props.selected The selected layer.
 * @param {(layer: object<string, any>) => void} props.onSelect Callback called when selecting a layer.
 * @returns
 */
export default function LayerSelector({ map, selected, onSelect }) {
	const [layers, setLayers] = useState([])

	/**
	 * Get details of the selected layer from the backend and pass them to the onSelect callback.
	 *
	 * @param {number} layerId The ID of the selected layer
	 */
	async function selectLayer(layerId) {
		const layer = await getItem('imagemaps', layerId, { _fields: 'id,name,meta,slug', _embed: 1 })

		onSelect(layer.body)
	}

	// Get the list of layers for the provided map and pre-select the 1st layer.
	useEffect(async () => {
		const res = await getCollection('imagemaps', { parent: map, per_page: 100 })

		setLayers(res.body)
		if (res.body[0]) selectLayer(res.body[0].id)
	}, [map])

	return (
		<>
			<h5 style={{ marginBottom: 0 }}>Select layer</h5>
			{layers.map(layer => (
				<div key={layer.id}>
					<input
						type="radio"
						name="map-layer"
						value={layer.id}
						id={layer.slug}
						checked={layer.id === selected.id}
						onChange={e => selectLayer(e.target.value)}
					/>
					<label htmlFor={layer.slug}>{layer.name}</label>
				</div>
			))}
		</>
	)
}
