<?php

namespace Flare\ImageMap;

/**
 * Manage Markers post type.
 *
 * @since 0.1.0
 */
class Marker {
	/**
	 * Register Markers post type
	 *
	 * @since 0.1.0
	 **/
	public function register_marker_cpt() {
		$labels = array(
			'name'                  => _x( 'Markers', 'Post Type General Name', 'flare-im' ),
			'singular_name'         => _x( 'Marker', 'Post Type Singular Name', 'flare-im' ),
			'menu_name'             => _x( 'Markers', 'Admin Menu text', 'flare-im' ),
			'name_admin_bar'        => _x( 'Marker', 'Add New on Toolbar', 'flare-im' ),
			'archives'              => __( 'Marker Archives', 'flare-im' ),
			'attributes'            => __( 'Marker Attributes', 'flare-im' ),
			'parent_item_colon'     => __( 'Parent Marker:', 'flare-im' ),
			'all_items'             => __( 'All Markers', 'flare-im' ),
			'add_new_item'          => __( 'Add New Marker', 'flare-im' ),
			'add_new'               => __( 'Add New', 'flare-im' ),
			'new_item'              => __( 'New Marker', 'flare-im' ),
			'edit_item'             => __( 'Edit Marker', 'flare-im' ),
			'update_item'           => __( 'Update Marker', 'flare-im' ),
			'view_item'             => __( 'View Marker', 'flare-im' ),
			'view_items'            => __( 'View Markers', 'flare-im' ),
			'search_items'          => __( 'Search Marker', 'flare-im' ),
			'not_found'             => __( 'Not found', 'flare-im' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'flare-im' ),
			'featured_image'        => __( 'Featured Image', 'flare-im' ),
			'set_featured_image'    => __( 'Set featured image', 'flare-im' ),
			'remove_featured_image' => __( 'Remove featured image', 'flare-im' ),
			'use_featured_image'    => __( 'Use as featured image', 'flare-im' ),
			'insert_into_item'      => __( 'Insert into Marker', 'flare-im' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Marker', 'flare-im' ),
			'items_list'            => __( 'Markers list', 'flare-im' ),
			'items_list_navigation' => __( 'Markers list navigation', 'flare-im' ),
			'filter_items_list'     => __( 'Filter Markers list', 'flare-im' ),
		);
		$args   = array(
			'label'               => __( 'Marker', 'flare-im' ),
			'description'         => __( 'Markers on an image map.', 'flare-im' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'excerpt', 'thumbnail', 'author' ),
			'taxonomies'          => array( 'imagemap' ),
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'show_in_admin_bar'   => false,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'hierarchical'        => true,
			'exclude_from_search' => true,
			'show_in_rest'        => true,
			'rest_base'           => 'markers',
			'publicly_queryable'  => false,
			'capability_type'     => 'post',
		);
		register_post_type( 'marker', $args );
	}
}
