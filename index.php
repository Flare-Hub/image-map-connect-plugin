<?php
/**
 * @package flare-hub_image-map-connect
 *
 * @wordpress-plugin
 * Plugin Name:         Image Map Connect - Display posts as image hotspots
 * Plugin URI:          https://github.com/Flare-Hub/image-map-connect-plugin
 * Description:         Provides a block to display image maps on a post or template. Markers on the map can reference your posts.
 * Author:              Flare Hub team
 * Author URI:          https://flarehub.io
 * Text Domain:         flare-imc
 * Domain Path:         /languages
 * Version:             0.1.2
 *                      (Also update block.json when updating version number)
 * Requires at least:   5.0
 * License:             GPLv3
 * License URI:         https://github.com/Flare-Hub/image-map-connect-plugin/blob/main/LICENSE
 */

defined( 'ABSPATH' ) || exit;

use Flare\ImageMap\Lifecycle;
use Flare\ImageMap\Plugin;

require_once __DIR__ . '/vendor/autoload.php';

// Register lifecycle hooks.
Lifecycle::register( __FILE__ );

/** @var Plugin Initialize the plugin. */
$image_map_connect = Plugin::get_instance();
