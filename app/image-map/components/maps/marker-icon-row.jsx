import { CardBody, CardDivider, Button, BaseControl, TextControl, Flex, FlexItem } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Controller, useFormContext } from 'react-hook-form'
import ColorSelect from '../forms/color-select'
import IconToolbarButtons from '../forms/icon-toolbar-buttons'
import { getControlClass, cls } from '../../utils/form-control'
import { icons } from '../../utils/marker-icons'

/** @typedef {import('../../utils/marker-icons').IconImg} Icon */

/**
 * Row to display a single marker icon.
 *
 * @param {object} props
 * @param {string} props.name Row index.
 * @param {number} props.size Icon size.
 */
export default function MarkerIconRow({ name }) {
	const { setValue, getValues, watch } = useFormContext()

	return (
		<>
			<CardDivider />
			<CardBody>
				<Flex className={cls.iconRow}>
					<FlexItem isBlock >
						<Controller
							name={name + '.name'}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<TextControl
									{...field}
									className={getControlClass(fieldState)}
								/>
							)}
						/>
					</FlexItem>
					<FlexItem className={cls.iconColBtn}>
						<Controller
							name={name + '.img'}
							rules={{ validate: img => !!img.ref }}
							render={({ field, fieldState }) => (
								<IconToolbarButtons
									icons={icons}
									selected={field.value}
									size={getValues(name + '.size')}
									colour={watch(name + '.colour')}
									onSelect={(img, size) => {
										field.onChange(img)
										setValue(name + '.size', size, { shouldDirty: true })
									}}
									onBlur={field.onBlur}
									ref={field.ref}
									className={getControlClass(fieldState)}
								/>
							)}
						/>
					</FlexItem>
					<FlexItem className={cls.iconColBtn}>
						<Controller
							name={name + '.colour'}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<ColorSelect
									{...field}
									className={getControlClass(fieldState)}
								/>
							)}
						/>
					</FlexItem>
					<FlexItem className={cls.iconColBtn}>
						<BaseControl>
							<Button
								variant='tertiary'
								icon="no"
								isDestructive
								onClick={() => setValue(name + '.delete', true, { shouldDirty: true })}
							/>
						</BaseControl>
					</FlexItem>
				</Flex>
			</CardBody>
		</>
	)
}
