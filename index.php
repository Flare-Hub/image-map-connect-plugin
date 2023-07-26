<?php
/**
 * @package flare-hub_image-map-connect
 *
 * @wordpress-plugin
 * Plugin Name:         Image Map Connect - Display Posts as Image Hotspots
 * Description:         Add any image to your WordPress posts, pages, or archives and make it interactive: display your existing and new posts as markers.
 * Author:              Flare Hub
 * Author URI:          https://flarehub.io
 * Text Domain:         flare-imc
 * Domain Path:         /languages
 * Version:             0.1.5
 *                      (Also update block.json when updating version number)
 * Requires at least:   5.8
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
