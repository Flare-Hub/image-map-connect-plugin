/** Transform editable model into list entry.  */
export default function transformModel(action) {
	if (action.type === 'add' || action.type === 'update') {
		action.payload = {
			id: action.payload.id,
			title: { rendered: action.payload.title.raw }
		}
	}

	return action
}
