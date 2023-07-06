import {
	BaseControl,
	ToolbarButton,
	ToolbarGroup,
	Dropdown,
} from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';

import cls from './edit-form.module.scss';

/** @typedef {import('../../utils/marker-icons').IconImg} Icon */

/**
 * A list of marker icons to choose from.
 *
 * @param {Object}                            props
 * @param {string}                            props.label     The label for the field.
 * @param {Array<Icon>}                       props.icons     A list of icons to select from.
 * @param {string}                            props.selected  The selected icon.
 * @param {string}                            props.colour    The selected colour.
 * @param {number}                            props.size      The default icon size.
 * @param {(img: Icon, size: number) => void} props.onSelect  The callback to call when a button is clicked, passing the name of the icon.
 * @param {() => void}                        props.onBlur    Triggered when a button looses focus
 * @param {string}                            props.className
 * @param {import('react').Ref}               ref
 */
function IconToolbarButtons(
	{ label, icons, selected, colour, size, onSelect, onBlur, className },
	ref
) {
	const btnId = useRef( 'btn-' + Math.floor( Math.random() * 100000000 ) );

	return (
		<BaseControl
			label={ label }
			className={ `${ cls.iconGroup } ${ className }` }
			id={ btnId.current }
		>
			<Dropdown
				renderToggle={ ( { isOpen, onToggle } ) => (
					<ToolbarButton
						id={ btnId.current }
						icon={
							<i
								className={ selected.ref }
								style={ { fontSize: size, color: colour } }
							/>
						}
						onClick={ onToggle }
						aria-expanded={ isOpen }
						className={ cls.iconBtn }
						ref={ ref }
					/>
				) }
				renderContent={ () => (
					<ToolbarGroup className={ cls.iconDropdown }>
						{ icons.map( ( icon ) => (
							<ToolbarButton
								key={ icon.ref }
								icon={
									<i
										className={ icon.ref }
										style={ {
											fontSize: size,
											color: colour,
										} }
									/>
								}
								onClick={ () => onSelect( icon, size ) }
								isActive={ selected.ref === icon.ref }
							/>
						) ) }
					</ToolbarGroup>
				) }
				expandOnMobile
				onClose={ onBlur }
			/>
		</BaseControl>
	);
}

export default forwardRef( IconToolbarButtons );
