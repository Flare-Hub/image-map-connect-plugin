<?php

namespace Flare\ImageMap;

/**
 * Initialize the plugin
 *
 * @since 0.1.0
 */
class Plugin {

	use \Flare\ImageMap\Traits\Singleton;

	/** @var string name */
	const NAME = 'flare-image-map';

	/** @var string version */
	const VERSION = '0.1.0';

	/**
	 * Register plugin to primary and lifecycle hooks.
	 *
	 * @since 0.1.0
	 **/
	public function __construct() {
		// Register primary hooks.
		add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	/**
	 * Instantiate any classes that are always needed and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function plugins_loaded() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );

		// Hook Image Map functions.
		$image_map = new ImageMap();
		add_action( 'init', array( $image_map, 'register_image_map' ) );

		// Hook Marker functions.
		$marker = new Marker();
		add_action( 'init', array( $marker, 'register_marker_cpt' ) );
	}

	/**
	 * Instantiate any classes that are only needed in the admin interface and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function admin_menu() {
		$map_menu = new AdminMenu();
		$map_menu->init();
		add_action( 'admin_enqueue_scripts', array( $map_menu->app, 'register_script' ) );
	}

	/**
	 * Instantiate any classes that are only needed in the rest api and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function rest_api_init() {
	}

	/**
	 * Enqueue the common app.
	 *
	 * @since 0.1.0
	 **/
	public function enqueue_styles() {
		$dir  = new AssetPath( 'styles' );
		$deps = $dir->get_dependencies();

		wp_enqueue_style( 'plugin-styles', $dir->get_url( 'css' ), array(), $deps['version'] );
	}
}
