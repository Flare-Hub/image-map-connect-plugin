import { CheckboxControl } from '@wordpress/components'
import { useEffect, useState, forwardRef } from '@wordpress/element'

import apiFetch from '@wordpress/api-fetch'

import cls from './post-types-select.module.scss'

/**
 * Post type selector.
 *
 * @param {object} props
 * @param {Array<string>} props.selected List of selected post types.
 * @param {(types: Array<string>) => void} props.onSelect Callback that is called when a post type is selected.
 * @param {() => void} props.onBlur Callback that is called when field focus is lost.
 * @param {string} props.inputClass Class to be added to the checkbox wrapper.
 * 	Will be provided a list of selected post types.
 */
function PostTypesSelect(
	{ selected, onSelect, onBlur, inputClass },
	ref
) {
	const [all, setAll] = useState([])

	useEffect(() => {
		apiFetch({ path: 'flare/v1/post-types' }).then(types => {
			setAll(Object.values(types))
		})
	}, [])

	function onChange(checked, type) {
		const updSelected = checked
			? [...selected, type]
			: selected.filter(sel => sel !== type)
		onSelect(updSelected)
	}

	return (
		<div className={inputClass} ref={ref}>
			{all.map(type => (
				<CheckboxControl
					key={type}
					label={type}
					checked={selected.includes(type)}
					onChange={checked => onChange(checked, type)}
					className={cls.checkbox}
					onBlur={onBlur}
				/>
			))}
		</div>
	)
}

export default forwardRef(PostTypesSelect)
