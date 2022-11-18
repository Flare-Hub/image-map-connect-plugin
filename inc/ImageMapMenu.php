<?php

namespace Flare\ImageMap;

/**
 * Create classes for the different features of your plugin.
 *
 * @since 0.1.0
 */
class ImageMapMenu {

	/** @var ReactApp $app React app handler. */
	public $app;

	/**
	 * Hook into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function init() {
		$this->app = new ReactApp( 'image-map', 'image-map' );

		add_menu_page(
			__( 'Image Maps', 'flare-im' ),
			__( 'Image Maps', 'flare-im' ),
			'manage_categories',
			'image-maps',
			array( $this->app, 'load_app' ),
			'dashicons-location-alt',
			6
		);
	}
}
