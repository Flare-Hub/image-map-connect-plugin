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

	/** @var ImageMap The image map Taxonomy management object. */
	protected $image_map;

	/** @var Marker The marker Custom Post Type management object. */
	protected $marker;

	/** @var MarkerIcon The marker icon Taxonomy management object. */
	protected $marker_icon;

	/** @var LocationMeta The marker icon Taxonomy management object. */
	protected $loc_meta;

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
	 * Instantiate any classes that are always needed.
	 *
	 * @since 0.1.0
	 **/
	public function plugins_loaded() {
		$this->loc_meta    = new LocationMeta();
		$this->image_map   = new ImageMap();
		$this->marker_icon = new MarkerIcon();
		$this->marker      = new Marker();

		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Run actions that require the init hook
	 *
	 * @since 0.1.0
	 **/
	public function init() {
		$post_types = $this->loc_meta->get_location_post_types();
		$this->image_map->register_image_map( $post_types );
		$this->marker_icon->register_marker_icon( $post_types );
		$this->marker->register_marker_cpt();
		BlockMgr::register_blocks();
	}

	/**
	 * Instantiate any classes that are only needed in the admin interface and hook them into WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function admin_menu() {
		// Hook admin menu functions.
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
		// Hook Image Map functions.
		$this->image_map->register_image();
		$this->image_map->register_max_zoom();
		$this->image_map->register_min_zoom();
		$this->image_map->register_initial_bounds();
		$this->image_map->register_connected_post_types();
		add_action( 'rest_prepare_imagemap', array( $this->image_map, 'add_image_link' ), 10, 2 );

		// Hook marker functions.
		add_action( sprintf( 'rest_%s_query', Marker::POST_TYPE ), array( $this->marker, 'filter_rest_query' ), 10, 2 );

		// Hook location fields.
		$this->loc_meta->add_to_post_types();

		// Hook marker icon functions.
		$this->marker_icon->register_colour();
		$this->marker_icon->register_icon();
		$this->marker_icon->register_map();
		$this->marker_icon->register_size();
		$this->marker_icon->register_anchor();
		$this->marker_icon->register_popup_anchor();
		add_filter( 'rest_prepare_marker-icon', array( $this->marker_icon, 'unregister_parent' ), 10, 3 );
		add_filter( 'rest_marker-icon_query', array( $this->marker_icon, 'query_map' ), 10, 2 );

		// Hook Post Type Route functions.
		$types = new PostTypesRoute();
		$types->register_route();
	}
}
