<?php

namespace Flare\ImageMap;

/**
 * Create classes for the different features of your plugin.
 *
 * @since 0.1.0
 */
class Dummy {

	/** @var ReactApp $app React app handler. */
	public $app;

	/**
	 * Hook into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function init() {
		$this->app = new ReactApp( 'demo-app', 'dummy-menu' );

		add_menu_page(
			__( 'Dummy page', 'flare-im' ),
			__( 'Dummy menu', 'flare-im' ),
			'manage_options',
			'dummy-page',
			array( $this->app, 'load_app' ),
			'dashicons-controls-play',
			6
		);
	}
}
