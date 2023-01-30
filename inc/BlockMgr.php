<?php
namespace Flare\ImageMap;

/**
 * Manage plugin blocks for the block editor.
 */
class BlockMgr {
	/** @var string $plugin_dir Directory of this plugin. */
	protected $plugin_dir;

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 **/
	public function __construct() {
		$this->plugin_dir = plugin_dir_path( __DIR__ );
	}

	/**
	 * Register all blocks with WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function register_blocks() {
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
	 * @since 0.1.0
	 **/
	public function render_map_query() {
		global $wp_the_query;

		// Duplicate the current query with paging disabled.
		$query_args = array_merge(
			$wp_the_query->query_vars,
			array(
				'nopaging'       => true,
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);
		$query      = new \WP_Query( $query_args );

		// Stringify the list of post IDs.
		$ids = implode( ',', $query->get_posts() );

		// Return div to place map in with post IDs of markers to include.
		ob_start();
		?><div data-post-ids="<?php echo esc_attr( $ids ); ?>" class="wp-block-flare-image-map" />
		<?php

		return ob_get_clean();
	}
}
