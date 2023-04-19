import { TabPanel, Icon, CardDivider } from '@wordpress/components'

import { useRouter, Router, Route } from './contexts/router'
import Maps from './components/maps'
import Layers from './components/layers'
import Markers from './components/markers'

import cls from './app.module.scss'

export default function App() {
	// Get reactive url query parameters
	const { query, navigate } = useRouter()

	// Load collections from Wordpress on mounting the app.
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
				className={cls.tabPanel}
			>{() => null}</TabPanel >
			<Router param='tab' rootPath='maps' errorPath='error' >
				<Route path='maps'><Maps /></Route>
				<Route path='layers'><Layers /></Route>
				<Route path='markers'><Markers /></Route>
				<Route path='error'><h2>404: Page not found</h2></Route>
			</Router>
		</div >
	)
}
