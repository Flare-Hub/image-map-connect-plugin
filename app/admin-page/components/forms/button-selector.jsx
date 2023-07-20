import { BaseControl, ButtonGroup, Button } from '@wordpress/components';
import { useRef } from '@wordpress/element';

import cls from './edit-form.module.scss';
/**
 * Select a value from a set using a button group.
 *
 * @param {Object}                                props
 * @param {string}                                props.label       Label that shows up in front of the field.
 * @param {Array<{value: string, label: string}>} props.items       Possible button values.
 * @param {string}                                props.selected    The selected value.
 * @param {(string) => any}                       props.onClick     Callback to execute on clicking a button. Provides the value of the selected button.
 * @param {string}                                props.buttonClass Class to add to each button
 */
export default function ButtonSelector( {
	label,
	items,
	selected,
	onClick,
	buttonClass,
} ) {
	const getVariant = ( val ) =>
		val === selected ? 'primary' : 'secondary';

	const btnGroupId = useRef(
		'btn-group-' + Math.floor( Math.random() * 100000000 )
	);

	return (
		<BaseControl
			label={ label }
			id={ btnGroupId.current }
			className={ cls.field }
		>
			<ButtonGroup id={ btnGroupId.current }>
				{ items.map( ( item ) => (
					<Button
						key={ item.value }
						variant={ getVariant( item.value ) }
						className={ buttonClass }
						onClick={ () => onClick( item.value ) }
					>
						{ item.label }
					</Button>
				) ) }
			</ButtonGroup>
		</BaseControl>
	);
}
