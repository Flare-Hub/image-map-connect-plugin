<?php
/**
 * Plugin Name:     YourPlugin
 * Plugin URI:
 * Description:
 * Author:
 * Author URI:
 * Text Domain:     your-plugin
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Test
 */

use YourOrg\YourPlugin\Plugin;

require_once __DIR__ . '/vendor/autoload.php';

/** @var Plugin Initialize the plugin. */
$yourplugin = Plugin::get_instance( __FILE__ );
