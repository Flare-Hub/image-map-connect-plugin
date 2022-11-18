import { useContext } from '@wordpress/element'

import { RouterCtx } from './contexts/router'

import cls from './app.module.scss'

export default function App() {
	const [Page] = useContext(RouterCtx)

	return (
		<div className='wrap'>
			<div className={cls.title}>
				<h1 className='wp-heading-inline'>Image Maps</h1>
				<a href="#" className='page-title-action'>Add New</a>
			</div>
			<Page />
		</div>
	)
}
