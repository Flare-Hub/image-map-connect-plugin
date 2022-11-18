<?php

namespace Flare\ImageMap;

/**
 * Provide plugin lifecycle functions
 */
class Lifecycle {

	/**
	 * Register lifecycle hooks with WordPress.
	 *
	 * @param string $base_file Path to the base file of the plugin.
	 * @since 0.1.0
	 **/
	public static function register( string $base_file ) {
		register_activation_hook( $base_file, array( __CLASS__, 'activate' ) );
		register_deactivation_hook( $base_file, array( __CLASS__, 'deactivate' ) );
		register_uninstall_hook( $base_file, array( __CLASS__, 'uninstall' ) );
	}

	/**
	 * Additional steps when activating plugin.
	 *
	 * @since 0.1.0
	 **/
	public static function activate() {
	}

	/**
	 * Additional steps when deactivating plugin.
	 *
	 * @since 0.1.0
	 **/
	public static function deactivate() {
	}

	/**
	 * Additional steps when uninstalling plugin.
	 *
	 * @since 0.1.0
	 **/
	public static function uninstall() {
	}
}
