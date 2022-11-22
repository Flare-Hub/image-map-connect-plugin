import { TabPanel, Icon, CardDivider } from '@wordpress/components'

import { useRouter } from './contexts/router'
import Maps from './components/maps'
import forceChildUpdate from './utils/forceChildUpdate'

import cls from './app.module.scss'

export default function App() {
	// Get reactive url query parameters
	const { query, navigate } = useRouter()

	// Ensure that the tabs panel is refreshed when query is updated
	const tabsKey = forceChildUpdate([query])

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
