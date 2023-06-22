<?php

namespace Flare\ImageMap;

/**
 * Manage Marker Icon taxonomy.
 *
 * @since 0.1.0
 */
class MarkerIcon {
	/** @var string The taxonomy name for marker icons. */
	public const NAME = 'marker-icon';

	/** @var array The API schema for the img meta field. */
	public const IMG_SCHEMA = array(
		'type'       => 'object',
		'properties' => array(
			'ref'         => array( 'type' => 'string' ),
			'type'        => array( 'type' => 'string' ),
			'iconAnchor'  => array(
				'type'       => 'object',
				'properties' => array(
					'x' => array( 'type' => 'number' ),
					'y' => array( 'type' => 'number' ),
				),
			),
			'popupAnchor' => array(
				'type'       => 'object',
				'properties' => array(
					'x' => array( 'type' => 'number' ),
					'y' => array( 'type' => 'number' ),
				),
			),
		),
	);

	/**
	 * Register Marker Icon taxonomy.
	 *
	 * @param array $post_types The post types that should support image maps.
	 * @since 0.1.0
	 **/
	public function register_marker_icon( array $post_types ) {
		$labels = array(
			'name'              => _x( 'Marker Icons', 'taxonomy general name', 'flare-imc' ),
			'singular_name'     => _x( 'Marker Icon', 'taxonomy singular name', 'flare-imc' ),
			'search_items'      => __( 'Search Marker Icons', 'flare-imc' ),
			'all_items'         => __( 'All Marker Icons', 'flare-imc' ),
			'parent_item'       => __( 'Parent Marker Icon', 'flare-imc' ),
			'parent_item_colon' => __( 'Parent Marker Icon:', 'flare-imc' ),
			'edit_item'         => __( 'Edit Marker Icon', 'flare-imc' ),
			'update_item'       => __( 'Update Marker Icon', 'flare-imc' ),
			'add_new_item'      => __( 'Add New Marker Icon', 'flare-imc' ),
			'new_item_name'     => __( 'New Marker Icon Name', 'flare-imc' ),
			'menu_name'         => __( 'Marker Icon', 'flare-imc' ),
		);
		$args   = array(
			'labels'             => $labels,
			'description'        => __( 'Marker Icons', 'flare-imc' ),
			'hierarchical'       => false,
			'public'             => true,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_nav_menus'  => false,
			'show_tagcloud'      => false,
			'show_in_quick_edit' => false,
			'show_admin_column'  => false,
			'show_in_rest'       => true,
			'rest_base'          => 'marker-icons',
		);
		register_taxonomy( self::NAME, $post_types, $args );
	}

	/**
	 * Register Marker Icon's colour field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_colour() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'colour', $meta_args );
	}

	/**
	 * Register Marker Icon's size field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_size() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'integer',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'size', $meta_args );
	}

	/**
	 * Register Marker Icon's location field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_img() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'object',
			'single'         => true,
			'show_in_rest'   => array(
				'schema' => self::IMG_SCHEMA,
			),
		);
		register_meta( 'term', 'img', $meta_args );
	}
}
