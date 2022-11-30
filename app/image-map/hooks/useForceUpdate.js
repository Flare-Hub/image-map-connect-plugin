import { useEffect, useState } from '@wordpress/element'

export default function useForceUpdate(triggers) {
	const [key, setKey] = useState(0)
	useEffect(() => setKey(key => key + 1), triggers)
	return key
}
