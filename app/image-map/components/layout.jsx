import cls from './layout.module.scss'
import { Card, CardBody, CardDivider } from '@wordpress/components'

/**
 * The overall layout for tabs.
 *
 * @param {object} props
 * @param {Array.<object>} props.list A list of wordpress posts or terms.
 * @param {string} props.titleAttr The attribute of the list items to display in the menu.
 * @param {string} props.selected The selected item.
 * @param {function} selectItem Will be passed selected item on clicking an item.
 */
export default function Layout({ list, titleAttr, selected, selectItem, children }) {
	return (
		<div className={`${cls.tab} grid-bleed`}>
			<Card as="aside" className={`${cls.menu} col-3`}>
				{list.length
					? list.map(item => (
						<div key={item.id}>
							<CardBody
								size='extraSmall'
								className={cls.menuItem}
								onClick={() => selectItem(item)}
								isShady={item === selected}
							>{item[titleAttr]}</CardBody>
							<CardDivider />
						</div>
					))
					: <><CardBody size="extraSmall"><div className={cls.placeholder}></div></CardBody><CardDivider /></>
				}
			</Card>
			<Card className={`${cls.details} col-9`}><CardBody>{children}</CardBody></Card>
		</div >
	)
}
