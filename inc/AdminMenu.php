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

	/** @var array<string> $style_deps Dependencies that the menu's stylesheet depends on. */
	protected $style_deps;

	/** @var array<string> $script_deps Dependencies that the menu's script depends on. */
	protected $script_deps;

	/**
	 * Constructor.
	 *
	 * @param string        $id Id for the objects registered with WordPress.
	 * @param array<string> $style_deps Dependencies that the menu's stylesheet depends on.
	 * @param array<string> $script_deps Dependencies that the menu's script depends on.
	 */
	public function __construct( string $id, array $style_deps = array(), array $script_deps = array() ) {
		$this->id          = $id;
		$this->style_deps  = $style_deps;
		$this->script_deps = $script_deps;
		$this->assets      = new WpScriptsAsset( 'image-map/index', $id, false, $this->style_deps );
	}

	/**
	 * Hook into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function init() {
		add_menu_page(
			__( 'Image Maps', 'flare-imc' ),
			__( 'Image Maps', 'flare-imc' ),
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
		wp_enqueue_style( $this->id );

		$div_attr = "class=\"hide-if-no-js\" id=\"$this->id\"";

		?>
			<div <?php echo wp_kses_data( $div_attr ); ?>>
				<img src="/wp-admin/images/spinner-2x.gif" alt="Loading" class="center-img">
			</div>
			<noscript><?php esc_html_e( 'This metabox requires javascript', 'flare-imc' ); ?></noscript>
		<?php
	}
}
