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
	 * @param string $base_file Path to the base file of the plugin.
	 * @since 0.1.0
	 **/
	public function __construct( $base_file ) {
		// Register primary hooks.
		add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );

		// Register lifecycle hooks.
		register_activation_hook( $base_file, array( $this, 'activate' ) );
		register_deactivation_hook( $base_file, array( $this, 'deactivate' ) );
		register_uninstall_hook( $base_file, array( $this, 'uninstall' ) );
	}

	/**
	 * Instantiate any classes that are always needed and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function plugins_loaded() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
	}

	/**
	 * Instantiate any classes that are only needed in the admin interface and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function admin_menu() {
		$dummy = new Dummy();
		$dummy->init();
		add_action( 'admin_enqueue_scripts', array( $dummy->app, 'enqueue_script' ) );
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

	/**
	 * Activate plugin.
	 *
	 * @since 0.1.0
	 **/
	public function activate() {
		Lifecycle::activate();
	}

	/**
	 * Deactivate plugin.
	 *
	 * @since 0.1.0
	 **/
	public function deactivate() {
		Lifecycle::deactivate();
	}

	/**
	 * Uninstall plugin.
	 *
	 * @since 0.1.0
	 **/
	public function uninstall() {
		Lifecycle::uninstall();
	}
}
