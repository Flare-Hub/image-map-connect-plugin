/** Transform editable model into list entry.  */
export default function transformModel(action) {
	if (action.type === 'add' || action.type === 'update') {
		action.payload = {
			id: action.payload.id,
			title: { rendered: action.payload.title.raw },
			type: action.payload.type,
			'marker-icons': action.payload['marker-icons'],
			flare_loc: action.payload.flare_loc,
		}
	}

	return action
}
