import { useEffect, useState } from '@wordpress/element'

export default function forceChildUpdate(triggers) {
	const [key, setKey] = useState(0)
	useEffect(() => setKey(key => key + 1), triggers)
	return key
}
