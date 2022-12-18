import { BaseControl, ButtonGroup, Button } from '@wordpress/components'

import cls from './edit-form.module.scss'
/**
 * Select a value from a set using a button group.
 *
 * @param {object} props
 * @param {string} props.label Label that shows up in front of the field.
 * @param {Array<{value: string, label: string}>} props.items Possible button values.
 * @param {string} props.selected The selected value.
 * @param {(string) => any} props.onClick Callback to execute on clicking a button. Provides the value of the selected button.
 */
export default function ButtonSelector({ label, items, selected, onClick }) {
	const getVariant = val => val === selected ? 'primary' : 'secondary'

	return (
		<BaseControl label={label} className={cls.field}>
			<ButtonGroup>
				{items.map(item => (
					<Button
						key={item.value}
						variant={getVariant(item.value)}
						className="medium"
						onClick={() => onClick(item.value)}
					>{item.label}</Button>
				))}
			</ButtonGroup>
		</BaseControl>
	)
}
