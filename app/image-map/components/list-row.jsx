import { Link } from '../router'

import cls from './list-row.module.scss'

/**
 * List row containing the details for an image map.
 * @param {object} props
 * @param {object} props.map
 * @param {string} props.map.slug
 * @param {string} props.map.name
 * @param {string} props.map.description
 * @param {number} props.map.count
 */
export default function ListRow({ map }) {
	return (
		<tr id="tag-2" className="level-0">
			<td className="name column-name has-row-actions column-primary" data-colname={map.name}>
				<strong>
					<Link className="row-title" query={{ action: 'edit-map' }} aria-label={`“${map.name} (Edit)”`}>Edit</Link>
				</strong>
				<div className="row-actions">
					<span className="edit">
						<Link query={{ action: 'edit-map' }} aria-label={`Edit “${map.name}”`}>Edit</Link>
					</span>
					<span className={cls.separator}>|</span>
					<span className="delete">
						<a href="#" className="delete-tag aria-button-if-js" aria-label={`Delete “${map.name}”`} role="button">Delete</a>
					</span>
				</div>
			</td>
			<td className="description column-description" data-colname="Description">
				{map.description
					? <span aria-hidden="true">{map.description}</span>
					: <>
						<span aria-hidden="true">—</span>
						<span className="screen-reader-text">No description</span>
					</>
				}
			</td>
			<td className="posts column-posts" data-colname="Count">
				<a href="#">{map.count}</a>
			</td>
		</tr>
	)
}
