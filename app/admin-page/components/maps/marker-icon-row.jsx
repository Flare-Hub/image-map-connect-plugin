import {
	CardBody,
	CardDivider,
	Button,
	BaseControl,
	TextControl,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { Controller, useFormContext } from 'react-hook-form';
import ColorSelect from '../forms/color-select';
import IconToolbarButtons from '../forms/icon-toolbar-buttons';
import useNotice from '../../hooks/useNotice';
import { getControlClass, cls } from '../../utils/form-control';
import { icons } from '../../utils/marker-icons';

/** @typedef {import('../../utils/marker-icons').IconImg} Icon */

/**
 * Row to display a single marker icon.
 *
 * @param {Object} props
 * @param {string} props.name Row index.
 */
export default function MarkerIconRow({ name }) {
	const { setValue, getValues, watch } = useFormContext();
	const createNotice = useNotice();

	/** Delete icon if not used on any markers. */
	function deleteIcon() {
		// Show error message if icon is used on markers.
		if (getValues(name + '.count') > 1) {
			createNotice({
				style: 'error',
				message: __(
					'Cannot delete icon that is used by markers.',
					'image-map-connect'
				),
				timeout: 10,
			});

			return;
		}

		setValue(name + '.delete', true, { shouldDirty: true });
	}

	useEffect(() => {
		if (!getValues(name + '.img.ref')) setValue(name + '.img', icons[0]);
	}, [getValues, name, setValue]);

	return (
		<>
			<CardDivider />
			<CardBody>
				<Flex className={cls.iconRow}>
					<FlexItem isBlock>
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
							name={name + '.img.ref'}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<IconToolbarButtons
									icons={icons}
									selected={getValues(name + '.img')}
									size={getValues(name + '.size')}
									colour={watch(name + '.colour')}
									onSelect={(img, size) => {
										setValue(name + '.size', size, {
											shouldDirty: true,
										});
										setValue(
											name + '.img.iconAnchor',
											img.iconAnchor
										);
										setValue(name + '.img.type', img.type);
										field.onChange(img.ref);
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
								variant="tertiary"
								icon="no"
								isDestructive
								onClick={deleteIcon}
							/>
						</BaseControl>
					</FlexItem>
				</Flex>
			</CardBody>
		</>
	);
}
