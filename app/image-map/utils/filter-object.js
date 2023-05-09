/**
 * Return the values of all dirty fields from a React Hook Form submission.
 *
 * @param {unknown[] | Record<string, unknown>} keepAttr From form state.
 * @param {unknown[] | Record<string, unknown>} allValues From form submission.
 * @returns {unknown[] | Record<string, unknown>}
 */
export default function filterObject(keepAttr, allValues) {
	// value is primitive.
	if (keepAttr === true) return allValues

	// For arrays, return all values with an index that is also included in dirtyFields.
	if (Array.isArray(keepAttr)) {
		const dirtyVals = keepAttr.reduce((acc, val, i) => {
			if (val !== null) acc.push(filterObject(val, allValues[i]))
			return acc
		}, []);
		return dirtyVals
	}

	// For objects, return all values with a key that is also included in dirtyFields or should be kept.
	const dirtyObj = Object.fromEntries(
		Object.entries(keepAttr).reduce((acc, [key, val]) => {
			if (val) {
				acc.push([
					key,
					filterObject(val, allValues[key]),
				])

				return acc
			}
		}, [])
	);
	return dirtyObj
};
