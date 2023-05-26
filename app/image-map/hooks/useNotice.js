import { useRef } from '@wordpress/element'
import { useDispatch } from '@wordpress/data'
import { store as noticesStore } from '@wordpress/notices'

/**
 * Provide app level notices access.
 */
export default function useNotice() {
	const timers = useRef({})
	const { createNotice, removeNotice } = useDispatch(noticesStore)

	/**
	 * Create a new notice.
	 *
	 * @param {Object} options
	 * @param {string} options.message
	 * @param {string} [options.style]
	 * @param {number} [options.timeout]
	 * @param {string} [options.context='global']
	 * @param {string} [options.id]
	 * @param {boolean} [options.isDismissible=true]
	 * @param {string} [options.type='default']
	 * @param {boolean} [options.speak=true]
	 * @param {Array<WPNoticeAction>} [options.actions]
	 * @param {string} [options.icon]
	 * @param {boolean} [options.explicitDismiss]
	 * @param {Function} [options.onDismiss]
	 */
	return async ({ message, style, timeout = 10, ...options }) => {
		const action = await createNotice(style, message, options)

		if (timeout > 0) {
			clearTimeout(timers.current[action.notice.id])
			timers.current[action.notice.id] = setTimeout(
				() => removeNotice(action.notice.id),
				timeout * 1000
			)
		}
	}
}
