<?php

namespace Flare\ImageMap;

/**
 * Create classes for the different features of your plugin.
 *
 * @since 0.1.0
 */
class AdminMenu {

	/** @var string $capability The Capability needed to manage this plugin. */
	const CAPABILITY = 'manage_categories';

		/** @var WpScriptsAsset Handler to provide build location. */
	public $assets;

	/** @var string $id Id for the objects registered with WordPress. */
	protected $id;

	/**
	 * Constructor.
	 *
	 * @param string $id Id for the objects registered with WordPress.
	 */
	public function __construct( $id ) {
		$this->id = $id;
	}

	/**
	 * Hook into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function init() {
		$this->assets = new WpScriptsAsset( 'image-map/index', $this->id );

		add_menu_page(
			__( 'Image Maps', 'flare-im' ),
			__( 'Image Maps', 'flare-im' ),
			self::CAPABILITY,
			$this->id,
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
		wp_enqueue_script( $this->id );
		$this->assets->enqueue_style();

		$div_attr = "class=\"hide-if-no-js\" id=\"$this->id\"";

		?>
			<div <?php echo wp_kses_data( $div_attr ); ?>>
				<img src="/wp-admin/images/spinner-2x.gif" alt="Loading" class="center-img">
			</div>
			<noscript>This metabox requires javascript</noscript>
		<?php
	}
}
