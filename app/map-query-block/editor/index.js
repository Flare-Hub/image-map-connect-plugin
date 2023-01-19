import { registerBlockType } from '@wordpress/blocks'
import { useBlockProps } from '@wordpress/block-editor'

registerBlockType('flare/image-map', {
	edit: () => {
		return <div {...useBlockProps()}>Image Map block.</div>
	},
})
