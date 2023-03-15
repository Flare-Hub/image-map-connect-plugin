<?php
namespace Flare\ImageMap;

/**
 * Manage plugin blocks for the block editor.
 */
class BlockMgr {
		// const ASSETDIR = 'assets/build/';

	/** @var string $plugin_dir Directory of this plugin. */
	protected $plugin_dir;

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 **/
	public function __construct() {
		$this->plugin_dir = plugin_dir_path( __DIR__ ); // . self::ASSETDIR;
	}

	/**
	 * Register all blocks with WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function register_blocks() {
		// register_block_type(
		// 	$this->plugin_dir . 'map-query-block',
		// 	array( 'render_callback' => array( $this, 'render_map_query' ) )
		// );
		$this->register_block(
			'map-query-block',
			array( 'view_script_handles' => array( 'view' => 'view/index' ) ),
			array( $this, 'render_map_query' )
		);
	}

	/**
	 * Register map query block.
	 *
	 * @param string               $name Directory containing the block.json, relative to the plugin directory.
	 * @param array<array<string>> $scripts List of script paths, relative to the block directory, grouped by block arguments.
	 * @param callable             $render_callback Block type render callback.
	 * @since 0.1.0
	 **/
	private function register_block( $name, $scripts, $render_callback ) {
		/** @var array<array<string>> List of script handles to enqueue for the block. */
		$block_args = array();

		// Register all provided scripts and add the handle to the relevant block argument.
		foreach ( $scripts as $arg => $files ) {
			foreach ( $files as $id => $path ) {
				// Register script.
				$handle = "$name-$id";
				$asset  = new WpScriptsAsset( "$name/$path", $handle );
				$asset->register_script();

				// Add handle to block the relevant block argument.
				if ( ! isset( $block_args[ $arg ] ) ) {
					$block_args[ $arg ] = array();
				}
				$block_args[ $arg ][] = $handle;
			}
		}

		// Register block as dynamic if a render callback is provided.
		if ( $render_callback ) {
			$block_args['render_callback'] = $render_callback;
		}

		// Register the block.
		$path = $this->plugin_dir . WpScriptsAsset::ASSETDIR . $name;

		register_block_type( $path, $block_args );
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

			// Run the query and add it's post ids to the map div attributes.
			$query = new \WP_Query( $query_args );

			$block_attr['data-post-ids'] = implode( ',', $query->get_posts() );
		}

		// Merge the map div attributes with the block attributes.
		$div_attr = get_block_wrapper_attributes( $block_attr );

		// Return div to place map in with post IDs of markers to include.
		return "<div $div_attr></div>";
	}
}
