import { render } from '@wordpress/element'
import cls from './index.module.css'

const appDiv = document.getElementById('demo-app')

function App() {
	return <h1 className={cls.red}>Demo react app!!!</h1>
}

render(<App />, appDiv)
