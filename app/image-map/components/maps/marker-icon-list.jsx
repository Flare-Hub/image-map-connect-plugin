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
 * @param {type} props.props description
 */
export default function MarkerIconList() {
	const { control, setValue, watch } = useFormContext()

	// Make React Hook Form aware of the icon list.
	const { fields, append } = useFieldArray({
		name: 'meta.icons',
		control,
		rules: { required: __('Atleast one icon is required', 'flare') },
	})

	return (
		<BaseControl label="Icon categories" className={cls.field}>
			<Card size='xSmall' className={cls.input}>
				<CardBody>
					<Flex>
						<FlexItem isBlock><BaseControl label={__('Icon Name', 'flare')} /></FlexItem>
						<FlexItem className={cls.colXs}><BaseControl label={__('Icon', 'flare')} /></FlexItem>
						<FlexItem className={cls.colXs}><BaseControl label={__('Colour', 'flare')} /></FlexItem>
						<FlexItem className={cls.colXs}><BaseControl label={__('Delete', 'flare')} /></FlexItem>
					</Flex>
				</CardBody>
				{fields.map((icon, i) => (
					(watch(`meta.icons.${i}.delete`))
						? null
						: (
							<Fragment key={icon.id}>
								<CardDivider />
								<CardBody>
									<Flex>
										<FlexItem isBlock >
											<Controller
												name={`meta.icons.${i}.name`}
												rules={{ required: __('This field is required', 'flare') }}
												render={({ field, fieldState }) => (
													<TextControl
														{...field}
														className={getControlClass(fieldState)}
													/>
												)}
											/>
										</FlexItem>
										<FlexItem className={cls.colXs}>
											<Controller
												name={`meta.icons.${i}.img`}
												rules={{ required: __('This field is required', 'flare') }}
												render={({ field, fieldState }) => (
													<IconToolbarButtons
														icons={icons}
														selected={field.value}
														colour={watch(`meta.icons.${i}.colour`)}
														size={ICON_SIZE}
														onSelect={field.onChange}
														onBlur={field.onBlur}
														ref={field.ref}
														className={getControlClass(fieldState)}
													/>
												)}
											/>
										</FlexItem>
										<FlexItem className={cls.colXs}>
											<Controller
												name={`meta.icons.${i}.colour`}
												rules={{ required: __('This field is required', 'flare') }}
												render={({ field, fieldState }) => (
													<ColorSelect
														{...field}
														className={getControlClass(fieldState)}
													/>
												)}
											/>
										</FlexItem>
										<FlexItem className={cls.colXs}>
											<Button variant='tertiary' icon="no" isDestructive onClick={() => setValue(`meta.icons.${i}.delete`, true)} />
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
							colour: '',
							size: ICON_SIZE,
							img: { ref: '' }
						})}
					/>
				</CardBody>
			</Card>
		</BaseControl>
	)
}
