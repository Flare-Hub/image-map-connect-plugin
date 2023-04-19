import {
	TextControl,
	TextareaControl,
	Card,
	CardBody,
	CardDivider,
	Button,
	BaseControl,
	Flex,
	FlexItem
} from '@wordpress/components'
import { useEffect, useReducer, useState } from '@wordpress/element'

import useSelected from '../../hooks/useSelected'
import { deleteItem, getCollection } from '../../../common/utils/wp-fetch'
import LifeCycleButtons from '../forms/lifecycle-buttons'
import PostTypesSelect from '../forms/post-types-select'
import EditMarkerIcon from './edit-marker-icon'

import cls from '../forms/edit-form.module.scss'
import { useRouter } from '../../contexts/router'

/**
 * Map details form.
 *
 * @param {object} props
 * @param {import('../../hooks/useCollection').WpIdentifiers} props.maps
 * @param {import('../../hooks/useCollection').Dispatcher} props.dispatch
 */
export default function EditMap({ maps, dispatch }) {
	const { query } = useRouter()

	// Get selected map
	const [map, setMap, loaded] = useSelected(
		maps.endpoint,
		query[maps.model],
		{ context: 'edit' },
		{ name: '', description: '', meta: { post_types: [] } }
	)

	// Use a reducer to manage the CRUD operations of the marker icon collection.
	const [markerIcons, dispatchMarkerIcons] = useReducer((state, action) => {
		switch (action.type) {
			case 'set':
				return action.payload

			case 'add':
				return [...state, action.payload]

			case 'update':
				const i = state.findIndex(icon => action.payload.id === icon.id)
				return Object.assign([], state, { [i]: action.payload })

			case 'delete':
				return state.filter(icon => icon.id !== action.payload)

			default:
				throw new Error('Invalid action type for dispatchMarkerIcons.')
		}
	}, [])

	// The marker icon to edit.
	const [editIcon, setEditIcon] = useState()

	/** Delete the give icon from Wordpress and the state */
	function deleteIcon(id) {
		deleteItem('marker-icons', id, { force: true })
		dispatchMarkerIcons({ type: 'delete', payload: id })
	}

	// Get all the marker icons for the selected map when a map is selected.
	useEffect(() => {
		if (!map.id) return
		getCollection('marker-icons', { map: map.id, meta: {} }).then(({ body }) => {
			dispatchMarkerIcons({ type: 'set', payload: body })
		})
	}, [map.id])

	if (!loaded) return <div></div>

	return (
		<Card className="full-height">
			<CardBody>
				<div className="col-xs-9">
					<TextControl
						label="Name"
						value={map.name}
						onChange={val => setMap(oldMap => ({ ...oldMap, name: val }))}
						className={cls.field}
					/>
					<TextareaControl
						label="Description"
						value={map.description}
						className={cls.field}
						onChange={val => setMap(oldMap => ({ ...oldMap, description: val }))}
					/>
					{map.meta &&
						<PostTypesSelect
							selected={map.meta.post_types}
							onSelect={types => setMap(oldMap => ({ ...oldMap, meta: { ...oldMap.meta, post_types: types } }))}
							baseClass={cls.field}
							inputClass={cls.input}
						/>
					}
					<BaseControl label="Icon categories" className={cls.field}>
						<Card size='xSmall' className={cls.input}>
							<CardBody className={cls.right}>
								<Button
									icon='plus-alt'
									iconPosition='right'
									text='Add category'
									variant='tertiary'
									onClick={() => setEditIcon({ name: '', map: map.id, meta: {} })}
								/>
							</CardBody>
							{markerIcons && markerIcons.map(icon => (
								<div key={icon.id}>
									<CardDivider />
									<CardBody>
										<Flex>
											<i className={icon.meta.loc} style={{ color: icon.meta.colour, fontSize: '1.2em' }} />
											<FlexItem isBlock >{icon.name}</FlexItem>
											<Button variant='tertiary' icon="edit" onClick={() => setEditIcon(icon)} />
											<Button variant='tertiary' icon="no" isDestructive onClick={() => deleteIcon(icon.id)} />
										</Flex>
									</CardBody>
								</div>
							))}
						</Card>
						{editIcon && <EditMarkerIcon
							icon={editIcon}
							setIcon={setEditIcon}
							dispatch={dispatchMarkerIcons}
							close={() => setEditIcon()}
						/>}
					</BaseControl>
				</div>
				<div className="col-xs-3">
					<LifeCycleButtons identifiers={maps} item={map} dispatch={dispatch} />
				</div>
			</CardBody>
		</Card>
	)
}
