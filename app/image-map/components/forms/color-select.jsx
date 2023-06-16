import {
	ColorIndicator,
	ColorPicker,
	Dropdown,
	BaseControl,
} from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';
import cls from './edit-form.module.scss';

/**
 * Colour indicator with dropdown picker to change it.
 *
 * @param {Object}                  props
 * @param {string}                  props.label     Field label.
 * @param {string}                  props.value     Selected colour.
 * @param {(value: string) => void} props.onChange  New colour handler.
 * @param {() => void}              props.onBlur    Called when focus is lost on the colour picker.
 * @param {string}                  props.className Base control class.
 * @param {import('react').Ref}     ref             Color indicator ref.
 */
function ColorSelect( { label, value, onChange, onBlur, className }, ref ) {
	const clrIndicatorId = useRef(
		'clr-indicator-' + Math.floor( Math.random() * 100000000 )
	);

	return (
		<BaseControl
			label={ label }
			id={ clrIndicatorId.current }
			className={ className }
		>
			<Dropdown
				renderToggle={ ( { isOpen, onToggle } ) => (
					<ColorIndicator
						id={ clrIndicatorId.current }
						colorValue={ value }
						onClick={ onToggle }
						aria-expanded={ isOpen }
						ref={ ref }
					/>
				) }
				renderContent={ () => (
					<ColorPicker
						color={ value }
						onChange={ onChange }
						onBlur={ onBlur }
					/>
				) }
				expandOnMobile
				className={ cls.colorSelect }
			/>
		</BaseControl>
	);
}

export default forwardRef( ColorSelect );
