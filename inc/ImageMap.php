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

	/**
	 * Register Image Map's max zoom level field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_max_zoom() {
		$meta_args = array(
			'object_subtype ' => 'imagemap',
			'type'            => 'number',
			'single'          => true,
			'show_in_rest'    => true,
		);
		register_meta( 'term', 'max_zoom', $meta_args );
	}

	/**
	 * Register Image Map's max zoom level field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_min_zoom() {
		$meta_args = array(
			'object_subtype ' => 'imagemap',
			'type'            => 'number',
			'single'          => true,
			'show_in_rest'    => true,
		);
		register_meta( 'term', 'min_zoom', $meta_args );
	}

	/**
	 * Register Image Map's initial bounds field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_initial_bounds() {
		$meta_args = array(
			'object_subtype ' => 'imagemap',
			'type'            => 'array',
			'single'          => true,
			'show_in_rest'    => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'number',
						),
					),
				),
			),
		);
		register_meta( 'term', 'initial_bounds', $meta_args );
	}
}
