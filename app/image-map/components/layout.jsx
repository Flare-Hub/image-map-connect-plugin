import cls from './layout.module.scss'
import { Card, CardBody, CardDivider } from '@wordpress/components'

/** @typedef {import('react').Component} Component */

/**
 * The overall layout for tabs.
 *
 * @param {object} props
 * @param {boolean} props.loading Whether the list is loading
 * @param {Array.<object>} props.list A list of wordpress posts or terms.
 * @param {string} props.titleAttr The attribute of the list items to display in the menu.
 * @param {string} props.selected The selected item.
 * @param {function} props.selectItem Will be passed selected item on clicking an item.
 * @param {Component} props.addButton Component for adding a new item to the list.
 */
export default function Layout({ loading, list, titleAttr, selected, selectItem, addButton, children }) {
	return (
		<div className={`${cls.tab} grid-bleed`}>
			<Card as="aside" className={`${cls.menu} col-3`}>
				<CardBody size="extraSmall" className={cls.addContainer}>
					{addButton}
				</CardBody>
				<CardDivider />
				{loading
					? <>
						<CardBody size="extraSmall">
							<div className={cls.placeholder}></div>
						</CardBody>
						<CardDivider />
					</>
					: list.length
						? list.map(item => (
							<div key={item.id}>
								<CardBody
									size='extraSmall'
									className={cls.menuItem}
									onClick={() => selectItem(item.id)}
									isShady={item.id === selected}
								>{item[titleAttr]}</CardBody>
								<CardDivider />
							</div>
						))
						: <p className={cls.empty}>No items found</p>
				}
			</Card>
			<Card className={`${cls.details} col-9`}><CardBody>{children}</CardBody></Card>
		</div >
	)
}
