<?php

namespace Flare\ImageMap;

/**
 * Manage Image Map taxonomy.
 *
 * @since 0.1.0
 */
class ImageMap {
	/**
	 * Register Image Map taxonomy.
	 *
	 * @since 0.1.0
	 **/
	public function register_image_map() {
		$labels = array(
			'name'              => _x( 'Image Maps', 'taxonomy general name', 'flare-im' ),
			'singular_name'     => _x( 'Image Map', 'taxonomy singular name', 'flare-im' ),
			'search_items'      => __( 'Search Image Maps', 'flare-im' ),
			'all_items'         => __( 'All Image Maps', 'flare-im' ),
			'parent_item'       => __( 'Parent Image Map', 'flare-im' ),
			'parent_item_colon' => __( 'Parent Image Map:', 'flare-im' ),
			'edit_item'         => __( 'Edit Image Map', 'flare-im' ),
			'update_item'       => __( 'Update Image Map', 'flare-im' ),
			'add_new_item'      => __( 'Add New Image Map', 'flare-im' ),
			'new_item_name'     => __( 'New Image Map Name', 'flare-im' ),
			'menu_name'         => __( 'Image Map', 'flare-im' ),
		);
		$args   = array(
			'labels'             => $labels,
			'description'        => __( 'Image Maps', 'flare-im' ),
			'hierarchical'       => true,
			'public'             => true,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_nav_menus'  => false,
			'show_tagcloud'      => false,
			'show_in_quick_edit' => false,
			'show_admin_column'  => false,
			'show_in_rest'       => true,
			'rest_base'          => 'imagemaps',
		);
		register_taxonomy( 'imagemap', array(), $args );
	}

	/**
	 * Register Image Map's image field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_image() {
		$meta_args = array(
			'object_subtype ' => 'imagemap',
			'type'            => 'number',
			'single'          => true,
			'show_in_rest'    => true,
		);
		register_meta( 'term', 'image', $meta_args );
	}

	/**
	 * Register Image Map's post types field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_connected_post_types() {
		$meta_args = array(
			'object_subtype ' => 'imagemap',
			'type'            => 'string',
			'single'          => false,
			'show_in_rest'    => true,
		);
		register_meta( 'term', 'post_types', $meta_args );
	}
}
