import { Button, RadioControl, ComboboxControl, Modal } from '@wordpress/components'
import { useState, useMemo, useRef } from '@wordpress/element'

import { navigate } from '../../contexts/router'

import mdlCls from './create-marker-modal.module.scss'
import cls from '../forms/edit-form.module.scss'
import useCollection from '../../hooks/useCollection'
import { wpMarkers } from '.'

/**
 * Modal to show when pressing the New Marker button.
 *
 * @param {object} props
 * @param {() => void} props.onRequestClose Called when save button is pressed.
 * @param {number} props.layer ID of the selected layer.
 * @param {number} props.map ID of the selected <map name="" className=""></map>
 * @param {import('../../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function CreateMarkerModal({ onRequestClose, layer, map, dispatch }) {
	const [type, setType] = useState('standalone')
	const [post, setPost] = useState()

	// Debounce the post combobox filter update.
	const debounceId = useRef()
	const [debouncedSearch, setDebouncedSearch] = useState()

	// Get all posts not yet on the selected layer.
	const [posts] = useCollection(wpMarkers, useMemo(() => ({
		imagemaps_exclude: layer,
		post_types: 'unlinked',
		map: map,
		_fields: 'id,title,type,slug',
		per_page: 100,
		search: debouncedSearch
	}), [layer, debouncedSearch]))

	/** Add the selected post to the markers list. */
	function handleAdd() {
		if (type === 'standalone') {
			navigate({ marker: 'new' })
		} else {
			const marker = posts.list.find(p => p.id === post)
			dispatch({
				type: 'add', payload: {
					...marker,
					'marker-icons': [],
					flare_loc: {},
				}
			})
			navigate({ marker: post })
		}

		onRequestClose()
	}

	/** Debounce the post filter based on the search. */
	function handleFilter(input) {
		clearTimeout(debounceId.current)
		debounceId.current = setTimeout(() => {
			setDebouncedSearch(input)
		}, 300);
	}

	return (
		<Modal
			onRequestClose={onRequestClose}
			title="Add Marker"
			overlayClassName={mdlCls.overlay}
			className={mdlCls.modal}
		>
			<RadioControl
				label="Type"
				options={[
					{ label: 'Standalone marker', value: 'standalone' },
					{ label: 'Existing post', value: 'post' },
				]}
				selected={type}
				onChange={setType}
				className={cls.field}
			/>
			{posts && <ComboboxControl
				label="Post"
				options={posts.list.map(post => ({
					value: post.id,
					label: post.title.rendered,
					type: post.type,
					slug: post.slug,
				}))}
				className={cls.field + (type === 'standalone' ? ' ' + mdlCls.hidden : '')}
				value={post}
				onChange={setPost}
				onFilterValueChange={handleFilter}
				__experimentalRenderItem={({ item }) => <>
					<div>{item.label}</div>
					<small>
						<div>Type: {item.type} | Slug: {item.slug}</div>
					</small>
				</>}
			/>}
			<div className={mdlCls.right}>
				<Button className="short" onClick={handleAdd} variant='primary'>
					Add
				</Button>
			</div>
		</Modal>
	)
}
