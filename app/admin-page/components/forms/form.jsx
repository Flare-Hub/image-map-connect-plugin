import { useEffect } from '@wordpress/element';
import { FormProvider } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import { useRouter } from '../../contexts/router';

/** @typedef {import('@wordpress/core-data').EntityRecord<"edit">} Record */
/** @typedef {import('react-hook-form').UseFormReturn<Record, any, undefined>} FormReturn */

/**
 * Provide React Hook Form context.
 * Call browser's confirm unsaved changes dialog on exiting a form if there are changes.
 *
 * @param {Object}                    props
 * @param {FormReturn}                props.form     React Hook Form context.
 * @param {import('react').ReactNode} props.children Child nodes.
 */
export default function Form({ form, children }) {
	const { history, navigate } = useRouter();

	useEffect(() => {
		if (form.formState.isDirty) {
			const unblock = history.block(({ retry, location }) => {
				const confirm =
					location.state?.force ||
					// eslint-disable-next-line no-alert
					window.confirm(
						__(
							'Your record is not saved. Are you sure you want to cancel your changes?',
							'image-map-connect'
						)
					);
				if (confirm) {
					unblock();
					retry();
				}
			});

			return unblock;
		}
	}, [form.formState.isDirty, history, navigate]);
	return <FormProvider {...form}>{children}</FormProvider>;
}
