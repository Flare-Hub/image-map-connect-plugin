import { CardBody, CardDivider, Draggable } from '@wordpress/components';

import cls from './layout.module.scss';

/** @typedef {(e: import('react').DragEvent<HTMLDivElement>) => void} DragEventHandler */

/**
 * Get the title from a specified attributed on a record.
 *
 * @param {Object<string,any>} record    The record to extract the title from.record
 * @param {string}             titleAttr The attribute on the record that contains the title, using dot notation.
 * @return {string} The title.
 */
function getTitle(record, titleAttr) {
	const attrs = titleAttr.split('.');
	for (const attr of attrs) {
		record = record[attr];
	}

	return record;
}

/**
 * Selectable list item referencing a record.
 *
 * @param {Object}                                      props
 * @param {import('@wordpress/core-data').EntityRecord} props.record           A WordPress record.
 * @param {string}                                      props.titleAttr        Record attribute containing the title.
 * @param {(id: number) => void}                        props.onSelect         Record selection handler.
 * @param {boolean}                                     props.isSelected       Highlight this list item.
 * @param {boolean}                                     [props.sortable=false] whether the item is in a sortable list.
 * @param {DragEventHandler}                            [props.onDragStart]    Handler for initiating a drag.
 * @param {DragEventHandler}                            [props.onDragEnter]    Handler for another list item entering this item.
 * @param {DragEventHandler}                            [props.onDrop]         Handler for dropping another list item on this item.
 * @param {boolean}                                     [props.isHovered]      Whether another item is hovering over this one
 */
export default function RecordListItem({
	record,
	titleAttr,
	onSelect,
	isSelected,
	sortable,
	onDragStart,
	onDragEnter,
	onDrop,
	isHovered,
}) {
	/** @type {DragEventHandler} */
	function handleDragEnter(e) {
		if (!sortable) return;
		e.preventDefault();
		onDragEnter(e);
	}

	// Allow dropping on this item.
	function handleDragOver(e) {
		if (!sortable) return;
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}

	return (
		<div
			id={'imc-layout-list-item-' + record.id}
			onDragOver={handleDragOver}
			onDrop={onDrop}
			onDragEnter={handleDragEnter}
			className={isHovered ? cls.hovering : ''}
		>
			<CardBody
				size="extraSmall"
				className={cls.menuItem}
				onClick={() => onSelect(record.id)}
				isShady={isSelected}
			>
				<span>{getTitle(record, titleAttr)}</span>
				{sortable && (
					<Draggable
						elementId={'imc-layout-list-item-' + record.id}
						onDragStart={onDragStart}
						cloneClassname={cls.dragging}
					>
						{({ onDraggableStart, onDraggableEnd }) => (
							<i
								draggable
								className="ri-draggable"
								onDragStart={onDraggableStart}
								onDragEnd={onDraggableEnd}
							/>
						)}
					</Draggable>
				)}
			</CardBody>
			<CardDivider />
		</div>
	);
}
