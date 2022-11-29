import { TabPanel, Icon, CardDivider } from '@wordpress/components'
import { useEffect } from '@wordpress/element'

import { useRouter, Router, Route } from './contexts/router'
import { useGlobalContext } from './contexts/global'
import Maps from './components/maps'
import Layers from './components/layers'
import forceChildUpdate from './utils/forceChildUpdate'

import cls from './app.module.scss'

export default function App() {
	// Get reactive url query parameters
	const { query, navigate } = useRouter()
	const { dispatchMap, dispatchLayer, dispatchMarker } = useGlobalContext()

	// Ensure that the tabs panel is refreshed when query is updated
	const tabsKey = forceChildUpdate([query])

	useEffect(() => {
		if (query.map) {
			dispatchMap({ type: 'updateAll', payload: { selected: Number(query.map) } })
		}
		if (query.layer) {
			dispatchLayer({ type: 'updateAll', payload: { selected: Number(query.layer) } })
		}
		if (query.marker) {
			dispatchMarker({ type: 'updateAll', payload: { selected: Number(query.marker) } })
		}
	}, [])

	return (
		<div className={cls.app}>
			<div className={cls.title}>
				<h1 className='wp-heading-inline'>Image Maps</h1>
			</div>
			<CardDivider />
			<TabPanel
				tabs={[
					{ name: 'maps', title: 'Maps' },
					{ name: 'layers', title: 'Layers' },
					{ name: 'markers', title: 'Markers' },
					{ name: 'info', title: <Icon icon="info" /> },
				]}
				onSelect={tab => navigate({ tab })}
				initialTabName={query.tab}
				key={tabsKey}
				className={cls.tabPanel}
			>{() => null}</TabPanel >
			<Router param='tab' rootPath='maps' errorPath='error' >
				<Route path='maps'><Maps /></Route>
				<Route path='layers'><Layers /></Route>
				<Route path='error'><h2>404: Page not found</h2></Route>
			</Router>
		</div >
	)
}
