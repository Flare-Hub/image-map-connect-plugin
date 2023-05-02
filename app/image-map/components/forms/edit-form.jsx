import { Spinner } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { FormProvider, useForm } from "react-hook-form";
import { getItem, postItem, createItem } from "common/utils/wp-fetch";
import { navigate } from "../../contexts/router";
import LifeCycleButtons from "./lifecycle-buttons";
import useSelected from "../../hooks/useSelected";

/**
 * Form to edit a WordPress item.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.collection Base for the REST endpoint of the collection.
 * @param {number} props.id ID of the item to fetch from the collection.
 * @param {object} props.query Query parameters for fetching the item.
 * @param {object} props.placeholder Empty object as placeholder for a new item.
 * @param {import('../../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditForm({ collection, id, query, placeholder, dispatch, children }) {
	const [item, setItem, status] = useSelected(collection.endpoint, id, query, placeholder, [id])

	const form = useForm({
		mode: 'onTouched',
		values: item
	})

	async function onSave(data) {
		console.log(data);
		// const saveQuery = { context: 'edit' }
		// if (data.id) {
		// 	const res = await postItem(collection.endpoint, data.id, data, saveQuery)
		// 	dispatch({ type: 'update', payload: res.body })
		// } else {
		// 	const res = await createItem(collection.endpoint, data, saveQuery)
		// 	dispatch({ type: 'add', payload: res.body })
		// 	navigate({ [collection.model]: res.body.id })
		// }
	}

	if (status === 'none') return null

	if (status === 'loading') return <Spinner style={{ width: '100px', height: '100px' }} />

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSave)}>
				<div className="col-xs-9">
					{children}
				</div>
				<div className="col-xs-3">
					<LifeCycleButtons identifiers={collection} id={id} dispatch={dispatch} />
				</div>
			</form>
		</FormProvider>
	)
}
