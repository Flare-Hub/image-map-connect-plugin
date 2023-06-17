import { useRouter } from '../contexts/router';

/**
 * Anchor tag that uses the router to navigate.
 *
 * @param {Object}                    props
 * @param {Object}                    props.query    The query parameters to change.
 * @param {Object}                    props.state    Any state to pass to the next page.
 * @param {import('react').ReactNode} props.children Child nodes.
 */
export default function Link( { query, state, children, ...attr } ) {
	const { createUrl, history } = useRouter();
	// Determine the url to link to
	const route = createUrl( query );

	// Update the url with the new query parameters
	function setQuery( e ) {
		e.preventDefault();
		history.push( route, state );
	}

	return (
		<a href={ route } onClick={ setQuery } { ...attr }>
			{ children }
		</a>
	);
}
