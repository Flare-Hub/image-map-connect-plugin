import { useContext, createContext } from '@wordpress/element'
import useSelected from '../hooks/useSelected'
import { wpMarkers } from '../components/markers'
import { useRouter } from './router'

/**
 * @typedef {React.Dispatch<React.SetStateAction<Object<string, any>>>} MarkerSetter
 */

/** @type {import('react').Context<[Object<string, any>, MarkerSetter]>} Create router context */
const markerContext = createContext(null)

/**
 * Context provider for the selected marker state.
 */
export function MarkerProvider({ children }) {
	const { query } = useRouter()

	// Fetch selected marker from Wordpress.
	const [marker, setMarker] = useSelected(
		wpMarkers,
		{ context: 'edit' },
		{
			status: 'publish',
			title: { raw: '' },
			imagemaps: [query[wpMarkers.parent]],
			'marker-icons': [],
			meta: {}
		}
	)

	return (
		<markerContext.Provider value={[marker, setMarker]} >
			{children}
		</markerContext.Provider>
	)
}

/**
 * Get the context provided by the marker provider.
 */
export function useMarker() {
	return useContext(markerContext)
}
