import cls from './list-row-skeleton.module.scss'

/**
 * List row containing the details for an image map.
 */
export default function ListRowSkeleton() {
	return (
		<tr id="tag-2" className="level-0">
			<td className="name column-name has-row-actions column-primary">
				<div className={cls.placeholder}></div>
			</td>
			<td className="description column-description">
				<div className={cls.placeholder}></div>
			</td>
			<td className="posts column-posts">
				<div className={cls.placeholder}></div>
			</td>
		</tr>
	)
}
