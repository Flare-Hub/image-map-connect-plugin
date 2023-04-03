<?php
namespace Flare\ImageMap;

/**
 * Manage plugin blocks for the block editor.
 */
class BlockMgr {
		const ASSETDIR = 'assets/build/';

	/** @var string $plugin_dir Directory of this plugin. */
	protected $plugin_dir;

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 **/
	public function __construct() {
		$this->plugin_dir = plugin_dir_path( __DIR__ ) . self::ASSETDIR;
	}

	/**
	 * Register all blocks with WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function register_blocks() {
		register_block_type(
			$this->plugin_dir . 'map-query-block',
			array( 'render_callback' => array( $this, 'render_map_query' ) )
		);
	}

	/**
	 * Load view script for the map query block.
	 *
	 * @param array     $attributes The attributes as stored in the block html.
	 * @param string    $content The inner html of the block coming from the post html.
	 * @param \WP_Block $block The block instance.
	 * @since 0.1.0
	 **/
	public function render_map_query( $attributes, $content, \WP_Block $block ) {
		/** HTML attributes to add to the map div. */
		$block_attr = array();

		// Check if the block is inside a query loop block.
		if ( isset( $block->context['query'] ) ) {
			// If the query loop is inherited from the template, get the global query parameters.
			if ( $block->context['query']['inherit'] ) {
				/** @global \WP_Query $wp_the_query */
				global $wp_the_query;
				$query_args = $wp_the_query->query;
			} else {
				// Get the query parameters from the query loop block, for the provided page if necessary.
				$page_key = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
				// @codingStandardsIgnoreStart
				$page     = (( 'query' === $attributes['queryType'] ) || empty( $_GET[ $page_key ] ))
					? 1	: (int) $_GET[ $page_key ];
				// @codingStandardsIgnoreEnd

				$query_args = build_query_vars_from_query_block( $block, $page );
			}

			// Only the post ids are required here. The map will fetch the required details from the REST API.
			$query_args['fields'] = 'ids';

			// Disable paging if the full query is required.
			if ( 'query' === $attributes['queryType'] ) {
				$query_args['nopaging']       = true;
				$query_args['posts_per_page'] = -1;
			}

			// Run the query to add it's post ids.
			$query = new \WP_Query( $query_args );

			$block_attr['data-post-ids'] = implode( ',', $query->get_posts() );
		}

			// Set data attributes for the map div.
			$block_attr['style']                 = 'height: ' . $attributes['height'] . ';';
			$block_attr['data-map-id']           = $attributes['mapId'];
			$block_attr['data-show-standalone']  = $attributes['showStandAlone'];
			$block_attr['data-initial-layer']    = $attributes['initialView']['layer'];
			$block_attr['data-initial-zoom']     = $attributes['initialView']['zoom'];
			$block_attr['data-initial-center-x'] = $attributes['initialView']['center'][0];
			$block_attr['data-initial-center-y'] = $attributes['initialView']['center'][1];

		// Merge the map div attributes with the block attributes.
		$div_attr = get_block_wrapper_attributes( $block_attr );

		// Return div to place map in with post IDs of markers to include.
		return "<div $div_attr></div>";
	}
}
