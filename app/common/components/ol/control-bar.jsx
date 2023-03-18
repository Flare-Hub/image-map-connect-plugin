import { useLayoutEffect, useMemo } from '@wordpress/element'
import Bar from 'ol-ext/control/Bar'

import { MapProvider, useMap } from './context'

/**
 * Add slot on map to place controls into.
 *
 * @param {Object} props
 * @param {import('ol-ext/control/control').position} props.position Position to place the bar.
 * @param {string} props.className Added to the bar element.
 */
export default function ControlBar({ position, className, children }) {
	const context = useMap()

	const controlBar = useMemo(() => {
		const bar = new Bar({ className })
		bar.setPosition(position)
		return bar
	}, [])

	useLayoutEffect(() => {
		context.map.addControl(controlBar)
	}, [])

	return (
		<MapProvider value={{ ...context, controlBar }}>
			{children}
		</MapProvider>
	)
}
