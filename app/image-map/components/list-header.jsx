// import cls from 'table-header.module.scss'

/**
 * Listing table Header
 * @param {object} props
 * @param {string} props.name
 */
export default function ListHeader({ name, slug }) {
	return (
		<th scope="col" id={slug} className={`manage-column column-${slug} column-primary sortable desc`}>
			<a><span>{name}</span><span className="sorting-indicator"></span></a>
		</th>
	)
}
