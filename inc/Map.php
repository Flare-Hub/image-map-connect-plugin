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
	 * Register Image Map's post types metadata with the rest API.
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

	/**
	 * Register icon list field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_icons() {
		register_rest_field(
			self::NAME,
			'icon_details',
			array(
				'get_callback'    => array( $this, 'get_icons' ),
				'update_callback' => array( $this, 'update_icons' ),
				'schema'          => array(
					'type'  => 'array',
					'items' => array(
						'type'       => 'object',
						'properties' => array(
							'id'     => array( 'type' => 'integer' ),
							'name'   => array( 'type' => 'string' ),
							'slug'   => array( 'type' => 'string' ),
							'count'  => array( 'type' => 'integer' ),
							'colour' => array( 'type' => 'string' ),
							'size'   => array( 'type' => 'integer' ),
							'img'    => MarkerIcon::IMG_SCHEMA,
							'delete' => array( 'type' => 'boolean' ),
						),
					),
				),
			),
		);
	}

	/**
	 * Get the marker icons for the provided post.
	 *
	 * @param array $post the current post.
	 * @return array Simplified models of the marker icons related to the post.
	 * @since 0.1.0
	 **/
	public function get_icons( $post ) {
		$terms = get_terms(
			array(
				'taxonomy'   => MarkerIcon::NAME,
				'object_ids' => $post['id'],
			)
		);

		$icons = array_map(
			/** @param \WP_Term $term */
			fn ( $term) => array(
				'id'     => $term->term_id,
				'name'   => $term->name,
				'slug'   => $term->slug,
				'count'  => $term->count,
				'colour' => get_term_meta( $term->term_id, 'colour', true ),
				'size'   => (int) get_term_meta( $term->term_id, 'size', true ),
				'img'    => get_term_meta( $term->term_id, 'img', true ),
				'delete' => false,
			),
			$terms
		);

		return $icons;
	}

	/**
	 * Add, delete or remove the marker icons as defined in the provided post.
	 *
	 * @param array    $icons The list of icons to update.
	 * @param \WP_Post $map The map that these icons belong to.
	 * @since 0.1.0
	 **/
	public function update_icons( array $icons, \WP_Post $map ) {
		foreach ( $icons as $icon ) {
			$id = $icon['id'];

			switch ( true ) {
					// Delete the existing icon.
				case $icon['delete'] && $id:
					wp_delete_term( $id, MarkerIcon::NAME );
					break;

				case ! $icon['delete'] && $id:
					// The icon already exists.
					if ( $icon['name'] ) {
						wp_update_term( $id, MarkerIcon::NAME, array( 'name' => $icon['name'] ) );
					}
					$this->update_icon_meta( $id, $icon );
					break;

				case ! $icon['delete'] && ! $id:
					// Create a new icon with a unique slug and link it to the map.
					// Get unique slug for the icon.
					$term_args = array(
						'slug' => wp_unique_term_slug(
							sanitize_title( $icon['name'] ),
							(object) array(
								'taxonomy' => MarkerIcon::NAME,
								'parent'   => 0,
							)
						),
					);

					// Create the icon.
					$term = wp_insert_term( $icon['name'], MarkerIcon::NAME, $term_args );
					$this->update_icon_meta( $term['term_id'], $icon );

					// Link the icon to the map.
					wp_set_post_terms( $map->ID, array( $term['term_id'] ), MarkerIcon::NAME, true );
					break;
			}
		}
	}

	/**
	 * Update meta fields included in the updated icon.
	 *
	 * @param string $id id of the marker-icon term.
	 * @param array  $icon updated icon.
	 * @since 0.1.0
	 **/
	public function update_icon_meta( string $id, array $icon ) {
		if ( $icon['colour'] ) {
			update_term_meta( $id, 'colour', $icon['colour'] );
		}
		if ( $icon['size'] ) {
			update_term_meta( $id, 'size', $icon['size'] );
		}
		if ( $icon['img'] ) {
			update_term_meta( $id, 'img', $icon['img'] );
		}
	}
}
