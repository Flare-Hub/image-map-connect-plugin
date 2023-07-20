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
		$this->assets      = new WpScriptsAsset( 'admin-page/index', $id, false, $this->style_deps );
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
			30
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
				<svg class="flare-loader-spin" viewBox="0 0 100 100" width="16" height="16" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false" style="width: 100px; height: 100px; margin: 30px; color: var(--wp-components-color-accent, var(--wp-admin-theme-color, #007cba)); overflow: visible;">
					<circle cx="50" cy="50" r="50" vector-effect="non-scaling-stroke" style="fill: transparent; stroke-width: 1.5px; stroke: rgb(221, 221, 221);"></circle>
					<path d="m 50 0 a 50 50 0 0 1 50 50" vector-effect="non-scaling-stroke" style="fill: transparent; stroke-width: 1.5px; stroke: currentcolor; stroke-linecap: round; transform-origin: 50% 50%; animation: 1.4s linear 0s infinite normal both running flare-spin;"></path>
				</svg>
			</div>
			<noscript><?php esc_html_e( 'This metabox requires javascript', 'flare-imc' ); ?></noscript>
		<?php
	}

	/**
	 * Add getting started link to plugin in plugins list.
	 *
	 * @param array $actions An array of plugin action links.
	 * @return type Description
	 * @since 0.1.0
	 **/
	public function add_start_link( $actions ) {
		// Build and escape the URL.
		$url = esc_url(
			add_query_arg(
				array(
					'page' => $this->id,
					'tab'  => 'info',
				),
				get_admin_url() . 'admin.php'
			)
		);

		// Create the link.
		$start_link = "<a href='$url'>" . __( 'Getting started', 'flare-imc' ) . '</a>';

		// Adds the link to the end of the array.
		array_unshift(
			$actions,
			$start_link
		);

		return $actions;
	}
}
