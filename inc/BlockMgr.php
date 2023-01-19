<?php
namespace Flare\ImageMap;

/**
 * Manage plugin blocks for the block editor.
 */
class BlockMgr {
	/** @var array Paths of blocks to register, relative to the build folder. */
	const PATHS = array(
		'map-query-block',
	);

	/**
	 * Register all blocks with WordPress.
	 *
	 * @since 0.1.0
	 **/
	public static function register_blocks() {
		$plugin_dir = plugin_dir_path( __DIR__ );

		foreach ( self::PATHS as $dir ) {
			register_block_type( $plugin_dir . AssetPath::ASSETDIR . $dir );
		}
	}
}
