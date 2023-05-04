<?php

namespace Flare\ImageMap;

/**
 * Manage map post type
 *
 * @since 0.1.0
 */
class Map {
	/** @var string NAME The post type name for maps. */
	public const NAME = 'map';

	/**
	 * Register map post type.
	 *
	 * @since 0.1.0
	 **/
	public function register_map_cpt() {
		$labels = array(
			'name'                  => _x( 'Maps', 'Post Type General Name', 'flare-im' ),
			'singular_name'         => _x( 'Map', 'Post Type Singular Name', 'flare-im' ),
			'menu_name'             => _x( 'Maps', 'Admin Menu text', 'flare-im' ),
			'name_admin_bar'        => _x( 'Map', 'Add New on Toolbar', 'flare-im' ),
			'archives'              => __( 'Map Archives', 'flare-im' ),
			'attributes'            => __( 'Map Attributes', 'flare-im' ),
			'parent_item_colon'     => __( 'Parent Map:', 'flare-im' ),
			'all_items'             => __( 'All Maps', 'flare-im' ),
			'add_new_item'          => __( 'Add New Map', 'flare-im' ),
			'add_new'               => __( 'Add New', 'flare-im' ),
			'new_item'              => __( 'New Map', 'flare-im' ),
			'edit_item'             => __( 'Edit Map', 'flare-im' ),
			'update_item'           => __( 'Update Map', 'flare-im' ),
			'view_item'             => __( 'View Map', 'flare-im' ),
			'view_items'            => __( 'View Maps', 'flare-im' ),
			'search_items'          => __( 'Search Map', 'flare-im' ),
			'not_found'             => __( 'Not found', 'flare-im' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'flare-im' ),
			'featured_image'        => __( 'Featured Image', 'flare-im' ),
			'set_featured_image'    => __( 'Set featured image', 'flare-im' ),
			'remove_featured_image' => __( 'Remove featured image', 'flare-im' ),
			'use_featured_image'    => __( 'Use as featured image', 'flare-im' ),
			'insert_into_item'      => __( 'Insert into Map', 'flare-im' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Map', 'flare-im' ),
			'items_list'            => __( 'Maps list', 'flare-im' ),
			'items_list_navigation' => __( 'Maps list navigation', 'flare-im' ),
			'filter_items_list'     => __( 'Filter Maps list', 'flare-im' ),
		);

		$args = array(
			'label'               => __( 'Map', 'flare-im' ),
			'description'         => __( 'Base image map', 'flare-im' ),
			'labels'              => $labels,
			'menu_icon'           => 'dashicons-palmtree',
			'supports'            => array( 'title', 'excerpt', 'author', 'custom-fields' ),
			'taxonomies'          => array( Layer::NAME, MarkerIcon::NAME ),
			'public'              => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'show_in_admin_bar'   => false,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'hierarchical'        => false,
			'exclude_from_search' => false,
			'show_in_rest'        => true,
			'rest_base'           => 'maps',
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
		);

		register_post_type( 'map', $args );
	}

	/**
	 * Register Image Map's post types field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_connected_post_types() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'string',
			'single'         => false,
			'show_in_rest'   => true,
		);
		register_meta( 'post', 'post_types', $meta_args );
	}
}
