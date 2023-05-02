import { ColorIndicator, ColorPicker, Dropdown, BaseControl } from '@wordpress/components'
import { forwardRef } from '@wordpress/element'

/**
 * Colour indicator with dropdown picker to change it.
 *
 * @param {object} props
 * @param {string} props.label Field label.
 * @param {string} props.value Selected colour.
 * @param {(value: string) => void} props.onChange New colour handler.
 * @param {() => void} props.onBlur Called when focus is lost on the colour picker.
 * @param {string} props.className
 */
function ColorSelect({ label, value, onChange, onBlur, className }, ref) {
	return (
		<BaseControl label={label} className={className}>
			<Dropdown
				renderToggle={({ isOpen, onToggle }) => (
					<ColorIndicator colorValue={value} ref={ref} onClick={onToggle} aria-expanded={isOpen} />
				)}
				renderContent={() => (
					<ColorPicker
						color={value}
						onChange={onChange}
						onBlur={onBlur}
					/>
				)}
				expandOnMobile
			/>
		</BaseControl>
	)
}

export default forwardRef(ColorSelect)
