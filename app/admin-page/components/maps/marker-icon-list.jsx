/* eslint-disable @wordpress/no-base-control-with-label-without-id */
import {
	Card,
	CardBody,
	CardDivider,
	Button,
	BaseControl,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useFieldArray, useFormContext } from 'react-hook-form';
import cls from '../forms/edit-form.module.scss';
import Label from '../forms/label';
import MarkerIconRow from './marker-icon-row';

const ICON_SIZE = 24;

/**
 * Editable list of marker icons
 *
 * @param {Object} props
 * @param {string} props.name Name of the icons field.
 */
export default function MarkerIconList( { name } ) {
	const { control, watch } = useFormContext();

	// Make React Hook Form aware of the icon list.
	const { fields, append } = useFieldArray( {
		name,
		control,
		rules: { required: true },
	} );

	return (
		<Card size="xSmall" className={ cls.input }>
			<CardBody>
				<Flex className={ cls.iconRow }>
					<FlexItem isBlock>
						<BaseControl
							className={ cls.field }
							label={
								<Label
									name={ __( 'Icon Name', 'flare-imc' ) }
									tooltip={ __(
										'Used when selecting an icon on a marker in the admin UI.',
										'flare-imc'
									) }
								/>
							}
						/>
					</FlexItem>
					<FlexItem className={ cls.iconColBtn }>
						<BaseControl
							className={ cls.field }
							label={
								<Label
									name={ __( 'Icon', 'flare-imc' ) }
									tooltip={ __(
										'Select the icon to change it',
										'flare-imc'
									) }
								/>
							}
						/>
					</FlexItem>
					<FlexItem className={ cls.iconColBtn }>
						<BaseControl
							className={ cls.field }
							label={
								<Label
									name={ __( 'Colour', 'flare-imc' ) }
									tooltip={ __(
										'Select the colour to change it',
										'flare-imc'
									) }
								/>
							}
						/>
					</FlexItem>
					<FlexItem className={ cls.iconColBtn }>
						<BaseControl label={ __( 'Delete', 'flare-imc' ) } />
					</FlexItem>
				</Flex>
			</CardBody>
			{ fields.map( ( icon, i ) =>
				watch( `${ name }.${ i }.delete` ) ? null : (
					<MarkerIconRow
						name={ `${ name }.${ i }` }
						key={ icon.id }
					/>
				)
			) }
			<CardDivider />
			<CardBody className={ cls.right }>
				<Button
					icon="plus-alt"
					iconPosition="left"
					text={ __( 'Add icon', 'flare-imc' ) }
					variant="secondary"
					type="button"
					onClick={ () =>
						append( {
							name: '',
							count: 1,
							colour: '',
							img: { ref: '' },
							size: ICON_SIZE,
							delete: false,
						} )
					}
				/>
			</CardBody>
		</Card>
	);
}
