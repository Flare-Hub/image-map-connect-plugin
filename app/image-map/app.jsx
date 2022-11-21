import { TabPanel, Icon, CardDivider } from '@wordpress/components'

import { Router, Route, navigate } from './router'
import Maps from './components/maps'
import EditMap from './components/edit-map'

import cls from './app.module.scss'

export default function App() {
	// TODO: Fix tab navigation on back button.
	const search = new URLSearchParams(location.search)

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
					{ name: 'info', title: <Icon icon="info" /> }
				]}
				onSelect={tab => navigate({ tab })}
				initialTabName={search.get('tab')}
			>
				{() => { }}
			</TabPanel >
			<CardDivider />
			<Router param='tab' rootPath='maps' errorPath='error'>
				<Route path='maps'>
					<Maps />
				</Route>
				<Route path='edit-map'><EditMap /></Route>
				<Route path='error'><h2>404: Page not found.</h2></Route>
			</Router>
		</div >
	)
}
