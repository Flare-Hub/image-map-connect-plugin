import {
	Card,
	CardBody,
	CardDivider,
	Button,
	BaseControl,
	TextControl,
	Flex,
	FlexItem,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import ColorSelect from '../forms/color-select'
import IconToolbarButtons from '../forms/icon-toolbar-buttons'
import { getControlClass, cls } from '../../utils/form-control'
import { icons } from '../../utils/marker-icons'

const ICON_SIZE = 24

/**
 * Editable list of marker icons
 *
 * @param {object} props
 * @param {type} props.name Name of the icons field.
 */
export default function MarkerIconList({ name }) {
	const { control, setValue, watch, formState } = useFormContext()

	// Make React Hook Form aware of the icon list.
	const { fields, append } = useFieldArray({
		name,
		control,
		rules: { required: true },
	})

	const iconsClass = cls.field + (formState.errors[name] && formState.errors[name].root ? ' ' + cls.invalid : '')

	return (
		<BaseControl label="Icon categories" className={iconsClass}>
			<Card size='xSmall' className={cls.input}>
				<CardBody>
					<Flex className={cls.iconRow}>
						<FlexItem isBlock><BaseControl label={__('Icon Name', 'flare')} /></FlexItem>
						<FlexItem className={cls.iconColBtn}><BaseControl label={__('Icon', 'flare')} /></FlexItem>
						<FlexItem className={cls.iconColBtn}><BaseControl label={__('Colour', 'flare')} /></FlexItem>
						<FlexItem className={cls.iconColBtn}><BaseControl label={__('Delete', 'flare')} /></FlexItem>
					</Flex>
				</CardBody>
				{fields.map((icon, i) => (
					(watch(`${name}.${i}.delete`))
						? null
						: (
							<Fragment key={icon.id}>
								<CardDivider />
								<CardBody>
									<Flex className={cls.iconRow}>
										<FlexItem isBlock >
											<Controller
												name={`${name}.${i}.name`}
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
												name={`${name}.${i}.meta.img`}
												rules={{ validate: img => !!img.ref }}
												render={({ field, fieldState }) => (
													<IconToolbarButtons
														icons={icons}
														selected={field.value}
														colour={watch(`${name}.${i}.meta.colour`)}
														size={ICON_SIZE}
														onSelect={field.onChange}
														onBlur={field.onBlur}
														ref={field.ref}
														className={getControlClass(fieldState)}
													/>
												)}
											/>
										</FlexItem>
										<FlexItem className={cls.iconColBtn}>
											<Controller
												name={`${name}.${i}.meta.colour`}
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
													onClick={() => setValue(`meta.icons.${i}.delete`, true)}
												/>
											</BaseControl>
										</FlexItem>
									</Flex>
								</CardBody>
							</Fragment>
						)
				))}
				<CardDivider />
				<CardBody className={cls.right}>
					<Button
						icon='plus-alt'
						iconPosition='left'
						text='Add category'
						variant='secondary'
						type='button'
						onClick={() => append({
							name: '',
							meta: { colour: '', size: ICON_SIZE, img: { ref: '' } }
						})}
					/>
				</CardBody>
			</Card>
		</BaseControl>
	)
}
