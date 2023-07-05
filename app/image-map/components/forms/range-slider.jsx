import { BaseControl, TextControl } from '@wordpress/components';
import { forwardRef, useRef } from '@wordpress/element';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import cls from './range-slider.module.scss';

/**
 * @typedef RangeSliderProps
 * @property {string}                    baseClass Class name on the base slider div.
 * @property {import('react').ReactNode} label     The input label
 */

/**
 * A slider component with start and end values.
 *
 * @param {import('rc-slider').SliderProps<number[]> & RangeSliderProps} props
 * @param {import('react').Ref}                                          ref
 */
function RangeSlider({ baseClass, label, ...sliderProps }, ref) {
	const id = useRef('slider-' + Math.floor(Math.random() * 100000000));

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
				value={sliderProps.value[0]}
				onChange={(val) =>
					sliderProps.onChange([val, sliderProps.value[1]])
				}
				type="number"
			/>
			<Slider
				range
				className={cls.slider}
				railStyle={railStyle}
				trackStyle={trackStyle}
				handleStyle={handleStyle}
				{...sliderProps}
				ref={ref}
			/>
			<TextControl
				className={cls.number}
				value={sliderProps.value[1]}
				onChange={(val) =>
					sliderProps.onChange([sliderProps.value[0], val])
				}
				type="number"
			/>
		</BaseControl>
	);
}

export default forwardRef(RangeSlider);
