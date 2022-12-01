<?php

namespace Flare\ImageMap;

/**
 * Backend management of a react app.
 *
 * @since 0.1.0
 */
class ReactApp {

	/** @var string Id for the metabox and app div. */
	public $id;

	/** @var string description */
	protected $script_name;

	/** @var array{string} Registered javascript tags that the script
	 * for this metabox depends on.
	 */
	protected $script_deps;

	/** @var AssetPath Handler to provide build location. */
	protected $asset_path;

	/**
	 * @param string        $id Id for the metabox and app div.
	 * @param string        $script Name of the script file (without extension).
	 * @param array{string} $deps Registered javascript tags that the script.
	 *      for this metabox depends on. Defaults to an empty array.
	 * @since 0.1.0
	 **/
	public function __construct( string $id, string $script, array $deps = array() ) {
		$this->id          = $id;
		$this->script_name = $script;
		$this->script_deps = $deps;

		$this->asset_path = new AssetPath( $script );
	}

	/**
	 * Enqueue the app script.
	 *
	 * @since 0.1.0
	 **/
	public function register_script() {
		$imports = $this->asset_path->get_dependencies();
		if ( ! $imports ) {
			return false;
		}

		wp_register_script(
			$this->id,
			$this->asset_path->get_url( 'js' ),
			array_merge( $this->script_deps, $imports['dependencies'] ),
			$imports['version'],
			true
		);

		return true;
	}

	/**
	 * Enqueue the app css file.
	 *
	 * @since 0.1.0
	 **/
	protected function enqueue_style() {
		$imports = $this->asset_path->get_dependencies();
		if ( ! $imports ) {
			return false;
		}

		if ( ! file_exists( $this->asset_path->get_path( 'css' ) ) ) {
			return false;
		}

		wp_enqueue_style(
			$this->id,
			$this->asset_path->get_url( 'css' ),
			array( 'wp-components' ),
			$imports['version']
		);
	}

	/**
	 * Load the react app into a div in the metabox
	 *
	 * @param \WP_Post $post Description.
	 * @since 0.1.0
	 **/
	public function load_app( $post = null ) {
		wp_enqueue_script( $this->id );
		$this->enqueue_style();

		$div_attr = "class=\"hide-if-no-js\" id=\"$this->id\"";

		if ( $post ) {
			$div_attr .= " data-post=\"$post->ID\"";
		}

		?>
			<div <?php echo wp_kses_data( $div_attr ); ?>>
				<img src="/wp-admin/images/spinner-2x.gif" alt="Loading" class="center-img">
			</div>
			<noscript>This metabox requires javascript</noscript>
		<?php
	}
}
