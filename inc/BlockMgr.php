<?php
namespace Flare\ImageMap;

/**
 * Manage plugin blocks for the block editor.
 */
class BlockMgr {
	/** @var array<string> $script_scopes Scopes where block scripts can be loaded, and their keys in the registration args */
	const SCRIPT_SCOPES = array(
		'editor' => 'editor_script_handles',
		'view'   => 'view_script_handles',
		'all'    => 'script_handles',
	);

	/** @var string $plugin_dir Directory of this plugin. */
	protected $plugin_dir;

	/** @var array $scripts List of assets to register. */
	protected $scripts = array(
		'editor' => array(),
		'view'   => array(),
		'all'    => array(),
	);

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
	 * Testing.
	 *
	 * @since 0.1.0
	 **/
	public function register_image_map_block() {
			// automatically load dependencies and version.
		$asset_file = include plugin_dir_path( __DIR__ ) . 'assets/build/map-query-block/index.asset.php';

		$url = plugins_url( 'assets/build/map-query-block/view/index.js', __DIR__ );

		wp_register_script(
			'map-query-block-view',
			$url,
			$asset_file['dependencies'],
			$asset_file['version']
		);

		$block = register_block_type(
			plugin_dir_path( __DIR__ ) . 'assets/build/map-query-block',
			array(
				'view_script_handles' => 'map-query-block-view',
				'render_callback'     => array( $this, 'load_map_query_script' ),
			)
		);

		return;
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
	 * Register block scripts on the frontend.
	 *
	 * @since 0.1.0
	 **/
	public function register_scripts() {
		$scripts = array_merge( $this->scripts['view'], $this->scripts['all'] );
		foreach ( $scripts as $handle => $path ) {
			$asset = new WpScriptsAsset( $path, $handle );
			$asset->register_script();
		}
	}

	/**
	 * Register block scripts on the backend.
	 *
	 * @since 0.1.0
	 **/
	public function admin_register_scripts() {
		foreach ( $this->scripts['editor'] as $handle => $path ) {
			$asset = new WpScriptsAsset( $path, $handle );
			$asset->register_script();
		}
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
