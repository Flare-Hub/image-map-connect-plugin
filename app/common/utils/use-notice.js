import { useEffect } from "@wordpress/element"
import { useDispatch } from "@wordpress/data"
import { store as noticeStore } from "@wordpress/notices"

/**
 * Conditionally show a snackbar error to the user.
 * @param {boolean} condition Whether to display the error.
 * @param {string} message The message to display.
 * @param {Array<any>} deps Dependencies to run the error check.
 */
export default function useNotice(condition, message, deps) {
	const { createErrorNotice } = useDispatch(noticeStore)

	useEffect(() => {
		if (condition) createErrorNotice(
			message,
			{ type: 'snackbar' }
		)
	}, deps)
}
