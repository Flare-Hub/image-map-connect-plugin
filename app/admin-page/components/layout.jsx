import { useState } from '@wordpress/element';
import { Card, CardBody, CardDivider } from '@wordpress/components';
import cls from './layout.module.scss';
import { __ } from '@wordpress/i18n';
import RecordListItem from './record-list-item';

/** @typedef {import('react').Component} Component */

/**
 * The overall layout for tabs.
 *
 * @param {Object}                         props
 * @param {boolean}                        props.loading       Whether the list is loading
 * @param {Array.<object>}                 props.list          A list of wordpress posts or terms.
 * @param {string}                         props.titleAttr     The attribute of the list items to display in the menu.
 * @param {string}                         props.selected      The selected item.
 * @param {Function}                       props.selectItem    Will be passed selected item on clicking an item.
 * @param {Component}                      props.addButton     Component for adding a new item to the list.
 * @param {boolean}                        props.sortable      Whether the list can be dragged to sort
 * @param {(order: Array<number>) => void} props.onChangeOrder Order change handler given the new order IDs.
 * @param {import('react').ReactNode}      props.children      Child nodes.
 */
export default function Layout({
	loading,
	list,
	titleAttr,
	selected,
	selectItem,
	addButton,
	sortable,
	onChangeOrder,
	children,
}) {
	// Record which item is being dragged.
	const [dragIndex, setDragIndex] = useState();

	// Record over which item is being dragged.
	const [dropIndex, setDropIndex] = useState();

	// Provide parent with updated list of ordered ids.
	function handleDrop(e) {
		e.preventDefault();

		// Get list of ids and reorder them.
		const ids = list.map((record) => record.id);
		const draggedIds = ids.splice(dragIndex, 1);
		ids.splice(dropIndex, 0, draggedIds[0]);

		// Update parent with new list.
		onChangeOrder(ids);

		// Reset.
		setDragIndex(null);
		setDropIndex(null);
	}

	return (
		<div className={`${cls.tab} grid-bleed`}>
			<Card as="aside" className={`${cls.menu} col-3`}>
				<CardBody size="extraSmall" className={cls.addContainer}>
					{addButton}
				</CardBody>
				<CardDivider />
				{loading && (
					<>
						<CardBody size="extraSmall">
							<div className={cls.placeholder}></div>
						</CardBody>
						<CardDivider />
					</>
				)}
				{!loading &&
					(list.length ? (
						list.map((record, i) => (
							<RecordListItem
								key={record.id}
								record={record}
								isSelected={record.id === selected}
								onSelect={selectItem}
								titleAttr={titleAttr}
								sortable={sortable}
								onDragStart={() => setDragIndex(i)}
								onDragEnter={() => setDropIndex(i)}
								onDrop={handleDrop}
								isHovered={dropIndex === i}
							/>
						))
					) : (
						<p className={cls.empty}>{__('No items found')}</p>
					))}
			</Card>
			<div className="full-height col-9">{children}</div>
		</div>
	);
}
