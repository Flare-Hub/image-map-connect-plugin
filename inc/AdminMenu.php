<?php

namespace Flare\ImageMap;

/**
 * Create classes for the different features of your plugin.
 *
 * @since 0.1.0
 */
class AdminMenu {

	/** @var ReactApp $app React app handler. */
	public $app;

	/**
	 * Hook into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function init() {
		// Script gets enqueued from here on admin_enqueue_scripts.
		$this->app = new ReactApp( 'image-map', 'image-map' );

		add_menu_page(
			__( 'Image Maps', 'flare-im' ),
			__( 'Image Maps', 'flare-im' ),
			'manage_categories',
			'image-maps',
			array( $this, 'load_app' ),
			'dashicons-location-alt',
			6
		);
	}

	/**
	 * Load react app and give it access to the media library.
	 *
	 * @since 0.1.0
	 **/
	public function load_app() {
		wp_enqueue_media();
		$this->app->load_app();
	}
}
