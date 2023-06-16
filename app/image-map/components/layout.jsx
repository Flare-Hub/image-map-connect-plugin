import cls from './layout.module.scss';
import { Card, CardBody, CardDivider } from '@wordpress/components';

/** @typedef {import('react').Component} Component */

/**
 * The overall layout for tabs.
 *
 * @param {Object}                    props
 * @param {boolean}                   props.loading    Whether the list is loading
 * @param {Array.<object>}            props.list       A list of wordpress posts or terms.
 * @param {string}                    props.titleAttr  The attribute of the list items to display in the menu.
 * @param {string}                    props.selected   The selected item.
 * @param {Function}                  props.selectItem Will be passed selected item on clicking an item.
 * @param {Component}                 props.addButton  Component for adding a new item to the list.
 * @param {import('react').ReactNode} props.children   Child nodes.
 */
export default function Layout( {
	loading,
	list,
	titleAttr,
	selected,
	selectItem,
	addButton,
	children,
} ) {
	function getTitle( item ) {
		const attrs = titleAttr.split( '.' );
		for ( const attr of attrs ) {
			item = item[ attr ];
		}

		return item;
	}

	return (
		<div className={ `${ cls.tab } grid-bleed` }>
			<Card as="aside" className={ `${ cls.menu } col-3` }>
				<CardBody size="extraSmall" className={ cls.addContainer }>
					{ addButton }
				</CardBody>
				<CardDivider />
				{ loading && (
					<>
						<CardBody size="extraSmall">
							<div className={ cls.placeholder }></div>
						</CardBody>
						<CardDivider />
					</>
				) }
				{ ! loading &&
					( list.length ? (
						list.map( ( item ) => (
							<div key={ item.id ?? 0 }>
								<CardBody
									size="extraSmall"
									className={ cls.menuItem }
									onClick={ () => selectItem( item.id ) }
									isShady={ item.id === selected }
								>
									{ getTitle( item ) }
								</CardBody>
								<CardDivider />
							</div>
						) )
					) : (
						<p className={ cls.empty }>No items found</p>
					) ) }
			</Card>
			<div className="full-height col-9">{ children }</div>
		</div>
	);
}
