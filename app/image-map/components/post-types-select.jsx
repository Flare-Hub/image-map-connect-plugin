import { CheckboxControl, BaseControl } from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'

import { wpFetch } from '../utils/wp-fetch'

import cls from './post-types-select.module.scss'

/**
 * Post type selector.
 *
 * @param {object} props
 * @param {Array<string>} props.selected List of selected post types.
 * @param {(types: Array<string>) => any} props.onSelect Callback that is called when a post type is selected.
 * @param {string} props.baseClass Class to be added to the base controller.
 * @param {string} props.inputClass Class to be added to the checkbox wrapper.
 * 	Will be provided a list of selected post types.
 */
export default function PostTypesSelect({ selected, onSelect, baseClass, inputClass }) {
	const [all, setAll] = useState([])

	useEffect(async () => {
		const types = await wpFetch('flare/v1/post-types')
		setAll(Object.values(types.body))
	}, [])

	function onChange(checked, type) {
		const updSelected = checked
			? [...selected, type]
			: selected.filter(sel => sel !== type)
		onSelect(updSelected)
	}

	return <>
		<BaseControl label='Post Types' className={baseClass}>
			<div className={inputClass}>
				{all.map(type => (
					<CheckboxControl
						key={type}
						label={type}
						checked={selected.includes(type)}
						onChange={checked => onChange(checked, type)}
						className={cls.checkbox}
					/>
				))}
			</div>
		</BaseControl>
	</>
}
