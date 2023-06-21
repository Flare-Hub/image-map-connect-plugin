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

export default function App() {
	// Get reactive url query parameters
	const { query, navigate } = useRouter();

	// Get active global notices.
	const notices = useSelect( ( select ) =>
		select( noticesStore ).getNotices()
	);
	const { removeNotice } = useDispatch( noticesStore );

	// Load collections from Wordpress on mounting the app.
	return (
		<>
			<NoticeList
				notices={ notices }
				onRemove={ removeNotice }
				className={ cls.notices }
			/>
			<div className={ cls.app }>
				<div className={ cls.title }>
					<h1 className="wp-heading-inline">
						{ __( 'Image Maps', 'flare' ) }
					</h1>
				</div>
				<CardDivider />
				<TabPanel
					tabs={ [
						{ name: 'maps', title: 'Maps' },
						{
							name: 'layers',
							title: 'Layers',
							disabled: ! query.map,
						},
						{
							name: 'markers',
							title: 'Markers',
							disabled: ! query.layer,
						},
						{ name: 'info', title: <Icon icon={ info } /> },
					] }
					onSelect={ ( tab ) => navigate( { tab } ) }
					initialTabName={ query.tab }
					className={ cls.tabPanel }
				>
					{ () => null }
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
						<h2 className={ cls.notFound }>404: Page not found</h2>
					</Route>
				</Router>
			</div>
		</>
	);
}
