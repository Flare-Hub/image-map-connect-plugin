import cls from '../components/forms/edit-form.module.scss'

export { cls }

/**
 * Get classes to add to a controlled form field.
 *
 * @param {import('react-hook-form').ControllerFieldState} fieldState As provided by the controller.
 * @returns
 */
export function getControlClass(fieldState) {
	const isValid = fieldState.isTouched && fieldState.invalid
	return cls.field + (isValid ? ' ' + cls.invalid : '')
}
