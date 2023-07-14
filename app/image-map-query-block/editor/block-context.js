import { createContext, useContext } from '@wordpress/element';

/** @typedef {import('./edit').BlockAttributes} BlockAttributes */

/**
 * @typedef BlockContext
 * @property {BlockAttributes}                                   attributes    Block attributes.
 * @property {(attrs: BlockAttributes) => void}                  setAttributes Attribute change handler.
 * @property {import('./edit').EditorContext}                    context       Block context coming from the editor.
 * @property {(size: { height: number, width: number }) => void} setMapSize    Store the map size.
 */

/** @type {import('react').Context<BlockContext>} */
const blockContext = createContext();

/** Context provider for attributes provided to the block by the editor. */
export const BlockProvider = blockContext.Provider;

/** Access block attributes. */
export function useBlockContext() {
	return useContext(blockContext);
}
