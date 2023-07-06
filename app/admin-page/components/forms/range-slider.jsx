import { BaseControl, TextControl } from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import cls from './range-slider.module.scss';

/**
 * @typedef Range
 * @property {number} low  Smallest value of the range.
 * @property {number} high Largest value of the range.
 */

/**
 * @typedef RangeSliderProps
 * @property {string}                        baseClass Class name on the base slider div.
 * @property {import('react').ReactNode}     label     The input label
 * @property {Range}                         value     The current range.
 * @property {(val: Partial<Range>) => void} onChange  Change handler taking in the changed range value.
 */

/** @typedef {import('rc-slider').SliderProps<number[]>} SliderProps */

/**
 * A slider component with start and end values.
 *
 * @param {SliderProps & RangeSliderProps} props
 * @param {import('react').Ref}            ref
 */
function RangeSlider(
	{ baseClass, label, value, onChange, ...sliderProps },
	ref
) {
	const id = useRef('slider-' + Math.floor(Math.random() * 100000000));

	/**
	 * Determine if the high or low value was changed and pass that on to the parent's change handler.
	 *
	 * @type {SliderProps['onChange']}
	 */
	function handleChange(newVal) {
		if (value.high !== newVal[1]) onChange({ high: newVal[1] });
		if (value.low !== newVal[0]) onChange({ low: newVal[0] });
	}

	/** @type {import('react').CSSProperties} */
	const railStyle = {
		backgroundColor: 'rgb(221, 221, 221)',
		height: 4,
		borderRadius: 4,
	};

	/** @type {import('react').CSSProperties} */
	const trackStyle = {
		backgroundColor: 'var(--wp-admin-theme-color, #007cba)',
		height: 4,
		borderRadius: 4,
	};

	/** @type {import('react').CSSProperties} */
	const handleStyle = {
		backgroundColor: 'var(--wp-admin-theme-color, #007cba)',
		border: '0 none',
		opacity: 1,
		width: 12,
		height: 12,
		marginTop: -4,
	};

	return (
		<BaseControl className={baseClass} label={label} id={id}>
			<TextControl
				className={cls.number}
				value={value.low}
				onChange={(val) => onChange({ low: val })}
				type="number"
			/>
			<Slider
				range
				className={cls.slider}
				railStyle={railStyle}
				trackStyle={trackStyle}
				handleStyle={handleStyle}
				value={[value.low, value.high]}
				onChange={handleChange}
				{...sliderProps}
				ref={ref}
			/>
			<TextControl
				className={cls.number}
				value={value.high}
				onChange={(val) => onChange({ high: val })}
				type="number"
			/>
		</BaseControl>
	);
}

export default forwardRef(RangeSlider);
