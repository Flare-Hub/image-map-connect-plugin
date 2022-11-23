import { TabPanel, Icon, CardDivider } from '@wordpress/components'
import { useEffect } from '@wordpress/element'

import { useRouter } from './contexts/router'
import { useGlobalContext } from './contexts/global'
import Maps from './components/maps'
import forceChildUpdate from './utils/forceChildUpdate'
import { getItem } from './utils/wp-fetch'

import cls from './app.module.scss'

export default function App() {
	// Get reactive url query parameters
	const { query, navigate } = useRouter()
	const { dispatch } = useGlobalContext()

	// Ensure that the tabs panel is refreshed when query is updated
	const tabsKey = forceChildUpdate([query])

	useEffect(async () => {
		const responses = []
		if (query.map) {
			responses.push(Promise.all(['maps', getItem('/wp/v2/imagemaps/' + query.map)]))
		}
		if (query.layer) {
			responses.push(Promise.all(['layers', getItem('/wp/v2/imagemaps/' + query.layer)]))
		}
		if (query.marker) {
			responses.push(Promise.all(['markers', getItem('/wp/v2/markers/' + query.marker)]))
		}

		if (responses.length) {
			const selected = await Promise.all(responses)

			dispatch({
				type: 'setSelected',
				payload: selected.map(([obj, item]) => [obj, item.body])
			})
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
					{ name: 'maps', title: 'Maps', content: <Maps /> },
					{ name: 'layers', title: 'Layers', content: <h2>404: Page not found.</h2> },
					{ name: 'markers', title: 'Markers', content: <h2>404: Page not found.</h2> },
					{ name: 'info', title: <Icon icon="info" />, content: <h2>404: Page not found.</h2> }
				]}
				onSelect={tab => navigate({ tab })}
				initialTabName={query.tab}
				key={tabsKey}
				className={cls.tabPanel}
			>
				{tab => (
					<>
						<CardDivider />
						{tab.content}
					</>
				)}
			</TabPanel >
		</div >
	)
}
