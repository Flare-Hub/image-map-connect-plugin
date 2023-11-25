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
	const NAME = 'image-map-connect';

	/** @var string Plugin version */
	public static $version;

	/** @var string $slug Plugin slug coming from the plugin text domain. */
	public static $slug;

	/** @var Map The map Post Type management object. */
	protected $map;

	/** @var Layer The layer Taxonomy management object. */
	protected $layer;

	/** @var Marker The marker Custom Post Type management object. */
	protected $marker;

	/** @var MarkerIcon The marker icon Taxonomy management object. */
	protected $marker_icon;

	/** @var LocationMeta The marker icon Taxonomy management object. */
	protected $loc_meta;

	/** @var BlockMgr $block_mgr The block manager object. */
	protected $block_mgr;

	/**
	 * Register plugin to primary and lifecycle hooks.
	 *
	 * @since 0.1.0
	 **/
	public function __construct() {
		$meta          = get_file_data(
			dirname( __DIR__ ) . '/image-map-connect.php',
			array(
				'version' => 'Version',
				'slug'    => 'Text Domain',
			)
		);
		self::$version = $meta['version'];
		self::$slug    = $meta['slug'];

		// Register primary hooks.
		add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	/**
	 * Instantiate any classes that are always needed.
	 *
	 * @since 0.1.0
	 **/
	public function plugins_loaded() {
		$this->loc_meta    = new LocationMeta();
		$this->map         = new Map();
		$this->layer       = new Layer();
		$this->marker_icon = new MarkerIcon();
		$this->marker      = new Marker();
		$this->block_mgr   = new BlockMgr();

		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Run actions that require the init hook
	 *
	 * @since 0.1.0
	 **/
	public function init() {
		$post_types = $this->loc_meta->get_location_post_types();

		$this->layer->register_image_map( $post_types );
		$this->marker_icon->register_marker_icon( $post_types );
		$this->map->register_map_cpt();
		$this->marker->register_marker_cpt();
		$this->block_mgr->register_blocks();
		add_filter( 'flare_marker_popup_template', array( $this->block_mgr, 'get_popup_template' ), 1 );
	}

	/**
	 * Instantiate any classes that are only needed in the admin interface and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function admin_menu() {
		// Hook admin menu functions.
		$remix_icons = new WpScriptsAsset( 'remixicon/remixicon', 'remixicon', self::$version );
		add_action( 'admin_enqueue_scripts', array( $remix_icons, 'register_style' ) );

		$map_menu = new AdminMenu( 'image-map-connect', array( 'wp-components', 'remixicon' ) );
		$map_menu->init();
		add_action( 'admin_enqueue_scripts', array( $map_menu->assets, 'register_script' ) );
		add_action( 'admin_enqueue_scripts', array( $map_menu->assets, 'register_style' ) );
		add_filter( 'plugin_action_links_image-map-connect/index.php', array( $map_menu, 'add_start_link' ) );
	}

	/**
	 * Instantiate any classes that are only needed in the rest api and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function rest_api_init() {
		// Hook Map functions.
		$this->map->register_connected_post_types();
		$this->map->register_icons();
		$this->map->register_layer_order_meta();

		// Hook Layer functions.
		$this->layer->register_image_meta();
		$this->layer->register_image_source();
		$this->layer->register_zoom();
		$this->layer->register_map();

		// Hook marker functions.
		add_action( sprintf( 'rest_%s_query', Marker::POST_TYPE ), array( $this->marker, 'filter_rest_query' ), 10, 2 );

		// Hook location fields.
		$this->loc_meta->add_to_post_types();

		// Hook marker icon functions.
		$this->marker_icon->register_colour();
		$this->marker_icon->register_size();
		$this->marker_icon->register_img();

		// Hook Post Type Route functions.
		$types = new PostTypesRoute();
		$types->register_route();
	}
}
