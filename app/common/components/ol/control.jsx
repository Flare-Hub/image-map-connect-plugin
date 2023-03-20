import { createPortal, useEffect, useMemo } from "@wordpress/element"
import { useMap } from "./context"
import OlControl from "ol/control/Control"

/**
 * Place children on map as custom control.
 *
 * @param {object} props
 * @param {type} props.children description
 */
export default function Control({ children }) {
	const { controlBar } = useMap()

	// Create control container div with OpenLayer classes.
	const container = useMemo(() => {
		const el = document.createElement('div')
		el.classList.add('ol-unselectable', 'ol-control')
		return el
	}, [])

	// Add control to parent control bar
	useEffect(() => {
		const mapControl = new OlControl({ element: container })
		controlBar.addControl(mapControl)
	}, [])

	return createPortal(children, container)

}
