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
			array( $this, 'load_map_query_script' )
		);
	}

	/**
	 * Register map query block.
	 *
	 * @param string               $name Directory containing the block.json, relative to the plugin directory.
	 * @param array<array<string>> $scripts List of script paths, relative the block directory.
	 * @param callable             $render_callback Block type render callback.
	 * @since 0.1.0
	 **/
	private function register_block( $name, $scripts, $render_callback ) {
		$handles = array();

		foreach ( $scripts as $arg => $files ) {
			foreach ( $files as $id => $path ) {
				$handle = "$name-$id";
				$asset  = new WpScriptsAsset( "$name/$path", $handle );
				$asset->register_script();
				if ( ! $handles[ $arg ] ) {
					$handles[ $arg ] = array();
				}
				$handles[ $arg ][] = $handle;
			}
		}

		$args = array_merge(
			$handles,
			array(
				'render_callback' => $render_callback,
			)
		);

		$path = $this->plugin_dir . WpScriptsAsset::ASSETDIR . $name;

		register_block_type( $path, $args );
	}

	/**
	 * Load view script for the map query block.
	 *
	 * @since 0.1.0
	 **/
	public function load_map_query_script() {
		global $wp_the_query;

		$query_args = array_merge(
			$wp_the_query->query_vars,
			array(
				'nopaging'       => true,
				'posts_per_page' => -1,
				'fields'         => 'ids',
			)
		);

		$query = new \WP_Query( $query_args );

		wp_localize_script( 'map-query-block-view', 'imageMapQuery', $query->get_posts() );
	}
}
