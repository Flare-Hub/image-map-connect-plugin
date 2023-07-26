import {
	Button,
	RadioControl,
	ComboboxControl,
	Modal,
} from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Controller, useForm } from 'react-hook-form';

import { navigate } from '../../contexts/router';
import useCollection from '../../hooks/useCollection';
import { getControlClass, cls } from '../../utils/form-control';

import mdlCls from './create-marker-modal.module.scss';

/** @typedef {import('@wordpress/core-data').EntityRecord} EntityRecord */

/**
 * Post entry in the select post combobox.
 *
 * @param {Object}                       props
 * @param {{type: string, slug: string}} props.item
 */
function PostItem({ item }) {
	return (
		<>
			<div>{item.label}</div>
			<small>
				<div>
					{__('Type', 'image-map-connect')}: {item.type} |{' '}
					{__('Slug', 'image-map-connect')}: {item.slug}
				</div>
			</small>
		</>
	);
}

/**
 * Modal to show when pressing the New Marker button.
 *
 * @param {Object}                         props
 * @param {() => void}                     props.onRequestClose   Called when save button is pressed.
 * @param {number}                         props.layer            ID of the selected layer.
 * @param {number}                         props.map              ID of the selected map.
 * @param {(marker: EntityRecord) => void} props.onRegisterMarker Callback to register existing post as marker.
 */
export default function CreateMarkerModal({
	onRequestClose,
	layer,
	map,
	onRegisterMarker,
}) {
	const { handleSubmit, control, watch } = useForm({
		defaultValues: { type: 'standalone', post: 0 },
	});

	// Debounce the post combobox filter update.
	const debounceId = useRef();
	const [debouncedSearch, setDebouncedSearch] = useState();

	// Get all posts not yet on the selected layer.
	const { list: posts, loading } = useCollection(
		'postType',
		'imc-marker',
		{
			layers_exclude: layer,
			post_types: 'unlinked',
			map,
			_fields: 'id,title,type,slug',
			per_page: 100,
			search: debouncedSearch,
		},
		[layer, map, debouncedSearch]
	);

	const postOptions = loading
		? [
				{
					label: __('Loading', 'image-map-connect') + '...',
				},
		  ]
		: posts.map((post) => ({
				value: post.id,
				label: post.title.rendered,
				type: post.type,
				slug: post.slug,
		  }));

	/**
	 * Debounce the post filter based on the search.
	 *
	 * @param {string} input Search value.
	 */
	function handleFilter(input) {
		clearTimeout(debounceId.current);
		debounceId.current = setTimeout(() => {
			setDebouncedSearch(input);
		}, 300);
	}

	/**
	 * Add the selected post to the markers list.
	 *
	 * @param {Object<string, any>} fields
	 */
	function handleAdd(fields) {
		const post =
			fields.type === 'post'
				? posts.find((p) => p.id === fields.post)
				: { id: 'new' };

		navigate({ marker: 'new' });
		onRegisterMarker(post);
		onRequestClose();
	}

	return (
		<Modal
			onRequestClose={onRequestClose}
			title="Add Marker"
			overlayClassName={mdlCls.overlay}
			className={mdlCls.modal}
		>
			<Controller
				name="type"
				control={control}
				render={({ field }) => (
					<RadioControl
						label="Type"
						options={[
							{ label: 'Standalone marker', value: 'standalone' },
							{ label: 'Existing post', value: 'post' },
						]}
						selected={field.value}
						onChange={field.onChange}
						className={cls.field}
					/>
				)}
			/>
			{watch('type') === 'post' && (
				<Controller
					name="post"
					rules={{ min: 1 }}
					control={control}
					render={({ field, fieldState }) => (
						<ComboboxControl
							label="Post"
							options={postOptions}
							value={field.value}
							onChange={field.onChange}
							onFilterValueChange={handleFilter}
							className={getControlClass(fieldState)}
							__experimentalRenderItem={PostItem}
						/>
					)}
				/>
			)}
			<div className={mdlCls.right}>
				<Button
					className="short"
					onClick={handleSubmit(handleAdd)}
					variant="primary"
				>
					{__('Add', 'image-map-connect')}
				</Button>
			</div>
		</Modal>
	);
}
