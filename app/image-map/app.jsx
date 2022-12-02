import { TabPanel, Icon, CardDivider } from '@wordpress/components'
import { useEffect } from '@wordpress/element'

import { useRouter, Router, Route } from './contexts/router'
import { useGlobalContext } from './contexts/global'
import Maps from './components/maps'
import Layers from './components/layers'
import Markers from './components/markers'
import useForceUpdate from './hooks/useForceUpdate'
import { getCollection } from './utils/wp-fetch'

import cls from './app.module.scss'

export default function App() {
	// Get reactive url query parameters
	const { query, navigate } = useRouter()
	const { maps, dispatchMap, layers, dispatchLayer, markers, dispatchMarker, setAppLoading } = useGlobalContext()

	// Ensure that the tabs panel is refreshed when query is updated
	const tabsKey = useForceUpdate([query])

	// Load collections from Wordpress on mounting the app.
	useEffect(async () => {
		/** Fetch collection and store it in global state. */
		async function updateList(collection, queryParams, parent, dispatch) {
			const res = await getCollection(collection.wp, queryParams)
			const selected = query[collection.object]
			dispatch({
				type: 'updateAll', payload: {
					list: res.body,
					selected: selected === 'new' ? selected : Number(selected),
					parent: Number(parent)
				}
			})
			return true
		}

		// Add all collection fetch promises to an array so we can check when they are all resolved.
		const loaded = []

		// Fetch each collection if a parent is needed and available
		loaded.push(updateList(maps, { parent: 0, _fields: 'name,id' }, false, dispatchMap))
		if (query.map && query.map !== 'new') {
			loaded.push(updateList(layers, { parent: query.map, _fields: 'name,id' }, query.map, dispatchLayer))
			if (query.layer && query.layer !== 'new') {
				loaded.push(updateList(markers, { imagemaps: query.layer, _fields: 'title,id' }, query.layer, dispatchMarker))
			}
		}

		// Indicate that app is loaded when all collections have been stored.
		await Promise.all(loaded)
		setAppLoading(false)

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
				<Route path='markers'><Markers /></Route>
				<Route path='error'><h2>404: Page not found</h2></Route>
			</Router>
		</div >
	)
}
