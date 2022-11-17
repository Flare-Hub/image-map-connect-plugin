<?php
/**
 * Plugin Name:     Flare Image Map
 * Plugin URI:      https://github.com/dutchigor/flare-image-map-plugin
 * Description:     Create floor plans or event maps and place posts on them.
 * Author:          Igor Honhoff
 * Author URI:      https://github.com/dutchigor
 * Text Domain:     flare-im
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         flare-im
 */

use Flare\ImageMap\Plugin;

require_once __DIR__ . '/vendor/autoload.php';

/** @var Plugin Initialize the plugin. */
$imagemap = Plugin::get_instance( __FILE__ );
