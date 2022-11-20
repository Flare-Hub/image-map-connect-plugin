import { Router, Route, Link } from './router'
import MapList from './components/map-list'
import EditMap from './components/edit-map'

import cls from './app.module.scss'

export default function App() {
	return (
		<div className='wrap'>
			<div className={cls.title}>
				<h1 className='wp-heading-inline'>Image Maps</h1>
				<Link query={{ action: 'add-map' }} className='page-title-action'>Add New</Link>
			</div>
			<Router param='action' rootPath='list-menu' errorPath='error'>
				<Route path='list-menu'><MapList /></Route>
				<Route path='edit-map'><EditMap /></Route>
				<Route path='error'><h2>404: Page not found.</h2></Route>
			</Router>
		</div>
	)
}
