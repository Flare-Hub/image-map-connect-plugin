<?php

namespace Flare\ImageMap;

/**
 * Manage Layer taxonomy.
 *
 * @since 0.1.0
 */
class Layer {
	/** @var string NAME The taxonomy name for markers. */
	public const NAME = 'layer';

	/**
	 * Register Layer taxonomy.
	 *
	 * @param array $post_types The post types that should support image maps.
	 * @since 0.1.0
	 **/
	public function register_image_map( array $post_types ) {
		$labels = array(
			'name'              => _x( 'Layers', 'taxonomy general name', 'flare-im' ),
			'singular_name'     => _x( 'Layer', 'taxonomy singular name', 'flare-im' ),
			'search_items'      => __( 'Search Layers', 'flare-im' ),
			'all_items'         => __( 'All Layers', 'flare-im' ),
			'parent_item'       => __( 'Parent Layer', 'flare-im' ),
			'parent_item_colon' => __( 'Parent Layer:', 'flare-im' ),
			'edit_item'         => __( 'Edit Layer', 'flare-im' ),
			'update_item'       => __( 'Update Layer', 'flare-im' ),
			'add_new_item'      => __( 'Add New Layer', 'flare-im' ),
			'new_item_name'     => __( 'New Layer Name', 'flare-im' ),
			'menu_name'         => __( 'Layer', 'flare-im' ),
		);

		$args = array(
			'labels'             => $labels,
			'description'        => __( 'Layers', 'flare-im' ),
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
			'rest_base'          => 'layers',
		);

		register_taxonomy( self::NAME, $post_types, $args );
	}

	/**
	 * Register Layer's image field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_image() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'number',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'image', $meta_args );
	}

	/**
	 * Get the image field link for the rest API.
	 *
	 * @param \WP_REST_Response $response The response object to send.
	 * @param \WP_Term          $item The original term object.
	 * @return \WP_REST_Response The ID of the image attachment
	 * @since 0.1.0
	 **/
	public function add_image_link( \WP_REST_Response $response, \WP_Term $item ) {
		$media = get_term_meta( $item->term_id, 'image', true );
		if ( $media ) {
			$response->add_link( 'flare:image', rest_url( "/wp/v2/media/{$media}" ), array( 'embeddable' => true ) );
		}
		return $response;
	}

	/**
	 * Register Layer's max zoom level field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_max_zoom() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'number',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'max_zoom', $meta_args );
	}

	/**
	 * Register Layer's max zoom level field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_min_zoom() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'number',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'min_zoom', $meta_args );
	}
}
