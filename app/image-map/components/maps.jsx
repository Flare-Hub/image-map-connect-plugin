import { Card, CardBody, CardDivider } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { useRouter } from '../router'

import cls from './maps.module.scss'

/**
 * List of maps with details of selected map
 */
export default function Maps() {
	const [maps, setMaps] = useState([])
	const [errorMgs, setErrorMsg] = useState(null)
	const [selected, setSelected] = useState({})

	const ctx = useRouter()

	useEffect(async () => {
		try {
			const newMaps = await apiFetch({
				path: '/wp/v2/imagemaps/',
				method: 'GET',
			})

			setMaps(newMaps)
		} catch (e) {
			setErrorMsg(e.message)
		}
	}, [])

	return (
		<div className={`${cls.tab} grid-bleed`}>
			<Card as="aside" className={`${cls.menu} col-3`}>
				{maps.length
					? maps.map(map => (
						<div key={map.id}>
							<CardBody
								size='extraSmall'
								className={cls.menuItem}
								onClick={() => setSelected(map)}
								isShady={map === selected}
							>{map.name}</CardBody>
							<CardDivider />
						</div>
					))
					: <><CardBody size="extraSmall"><div className={cls.placeholder}></div></CardBody><CardDivider /></>
				}
			</Card>
			<Card className={`${cls.details} col-9`}><CardBody>Test</CardBody></Card>
		</div >
	)
}
