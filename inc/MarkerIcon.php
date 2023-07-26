<?php

namespace Flare\ImageMap;

/**
 * Manage Icon Type taxonomy.
 *
 * @since 0.1.0
 */
class MarkerIcon {
	/** @var string The taxonomy name for marker icons. */
	public const NAME = 'imc-icon';

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
	 * Register Icon Type taxonomy.
	 *
	 * @param array $post_types The post types that should support image maps.
	 * @since 0.1.0
	 **/
	public function register_marker_icon( array $post_types ) {
		$labels = array(
			'name'              => _x( 'Icon Types', 'taxonomy general name', 'image-map-connect' ),
			'singular_name'     => _x( 'Icon Type', 'taxonomy singular name', 'image-map-connect' ),
			'search_items'      => __( 'Search Icon Types', 'image-map-connect' ),
			'all_items'         => __( 'All Icon Types', 'image-map-connect' ),
			'parent_item'       => __( 'Parent Icon Type', 'image-map-connect' ),
			'parent_item_colon' => __( 'Parent Icon Type:', 'image-map-connect' ),
			'edit_item'         => __( 'Edit Icon Type', 'image-map-connect' ),
			'update_item'       => __( 'Update Icon Type', 'image-map-connect' ),
			'add_new_item'      => __( 'Add New Icon Type', 'image-map-connect' ),
			'new_item_name'     => __( 'New Icon Type Name', 'image-map-connect' ),
			'menu_name'         => __( 'Icon Type', 'image-map-connect' ),
		);
		$args   = array(
			'labels'             => $labels,
			'description'        => __( 'Icon Types', 'image-map-connect' ),
			'hierarchical'       => false,
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => false,
			'show_in_menu'       => false,
			'show_in_nav_menus'  => false,
			'show_tagcloud'      => false,
			'show_in_quick_edit' => false,
			'show_admin_column'  => false,
			'show_in_rest'       => true,
			'rest_base'          => 'imc_icons',
		);
		register_taxonomy( self::NAME, $post_types, $args );
	}

	/**
	 * Register Icon Type's colour field with the rest API.
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
	 * Register Icon Type's size field with the rest API.
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
	 * Register Icon Type's location field with the rest API.
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
