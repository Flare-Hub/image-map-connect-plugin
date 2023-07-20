import { TabPanel, Icon, CardDivider, NoticeList } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { info } from '@wordpress/icons';

import { useRouter, Router, Route } from './contexts/router';
import Maps from './components/maps';
import Layers from './components/layers';
import Markers from './components/markers';
import InfoPage from './components/info-page';

import cls from './app.module.scss';
import { useState } from '@wordpress/element';

export default function App() {
	// Get reactive url query parameters
	const { query, navigate } = useRouter();

	// Get active global notices.
	const notices = useSelect((select) => select(noticesStore).getNotices());
	const { removeNotice } = useDispatch(noticesStore);

	// Use key to refresh Tabs component when selected tab does not match the tab query parameter.
	const [tabKey, setTabKey] = useState(0);

	/**
	 * Update the tab query parameter and refresh the Tabs component if the navigation is cancelled.
	 *
	 * @param {string} tabName Name of the selected tab.
	 */
	function handleSelect(tabName) {
		// Prevent this function from doing anything on initial render.
		if (tabName !== query.tab) {
			navigate({ tab: tabName });

			// Check if navigation was cancelled.
			const search = new URLSearchParams(window.location.search);
			if (search.get('tab') === query.tab) {
				// Rerender the tabs component to stay on the tab in the query parameters.
				setTabKey((key) => key + 1);
			}
		}
	}

	// Load collections from Wordpress on mounting the app.
	return (
		<>
			<NoticeList
				notices={notices}
				onRemove={removeNotice}
				className={cls.notices}
			/>
			<div className={cls.app}>
				<div className={cls.title}>
					<h1 className="wp-heading-inline">
						{__('Image Map Connect', 'flare-imc')}
					</h1>
				</div>
				<CardDivider />
				<TabPanel
					tabs={[
						{ name: 'maps', title: 'Maps' },
						{
							name: 'layers',
							title: 'Layers',
							disabled: !query.map,
						},
						{
							name: 'markers',
							title: 'Markers',
							disabled: !query.layer,
						},
						{ name: 'info', title: <Icon icon={info} /> },
					]}
					onSelect={handleSelect}
					selectOnMove={false}
					initialTabName={query.tab}
					className={cls.tabPanel}
					key={tabKey}
				>
					{/* Use router instead of TabPanel to prvent rerendering when switching tabs is cancelled. */}
					{() => null}
				</TabPanel>
				<Router param="tab" rootPath="maps" errorPath="error">
					<Route path="maps">
						<Maps />
					</Route>
					<Route path="layers">
						<Layers />
					</Route>
					<Route path="markers">
						<Markers />
					</Route>
					<Route path="info">
						<InfoPage />
					</Route>
					<Route path="error">
						<h2 className={cls.notFound}>404: Page not found</h2>
					</Route>
				</Router>
			</div>
		</>
	);
}
