/** @typedef {import('react').ReactNode} ReactNode */

/**
 * Provide condition as js and mustache.
 * Render mustache condition if template is being rendered,
 * or conditionally render children otherwise.
 *
 * @param {Object}                             props
 * @param {boolean}                            props.js       Javascript condition.
 * @param {(children: ReactNode) => ReactNode} props.mustache Mustache condition.
 * @param {'edit'|'save'}                      props.render   Render edit or save version.
 * @param {ReactNode}                          props.children Child nodes.
 */
export default function MustacheCondition({ js, mustache, render, children }) {
	if (render === 'save') return mustache(children);
	if (js) return children;
	return null;
}
