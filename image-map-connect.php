<?php
/**
 * @package flare-hub_image-map-connect
 *
 * @wordpress-plugin
 * Plugin Name:         Image Map Connect
 * Description:         Add any image to your WordPress posts, pages, or archives and make it interactive: display your existing and new posts as markers.
 * Author:              Flare Hub
 * Author URI:          https://flarehub.io
 * Text Domain:         image-map-connect
 * Version:             1.0.1
 *                      (Also update block.json and possibly readme.txt when updating version number)
 * Requires at least:   6.2
 * Requires PHP:        7.2
 * License:             GPL-3.0-or-later
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
