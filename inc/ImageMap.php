<?php

namespace Flare\ImageMap;

/**
 * Manage Image Map taxonomy.
 *
 * @since 0.1.0
 */
class ImageMap {
	/** @var string NAME The taxonomy name for markers. */
	public const NAME = 'imagemap';

	/**
	 * Register Image Map taxonomy.
	 *
	 * @param array $post_types The post types that should support image maps.
	 * @since 0.1.0
	 **/
	public function register_image_map( array $post_types ) {
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
		register_taxonomy( self::NAME, $post_types, $args );
	}

	/**
	 * Register Image Map's image field with the rest API.
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
		register_meta( 'term', 'post_types', $meta_args );
	}

	/**
	 * Register Image Map's max zoom level field with the rest API.
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
	 * Register Image Map's max zoom level field with the rest API.
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

	/**
	 * Register Image Map's max zoom level field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_icons() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'array',
			'single'         => true,
			// 'sanitize_callback' => array( $this, 'save_marker_icons' ),
			'show_in_rest'   => array(
				'schema'           => array(
					'type'  => 'array',
					'items' => array(
						'type'       => 'object',
						'properties' => array(
							'id'     => array( 'type' => 'integer' ),
							'name'   => array( 'type' => 'string' ),
							'colour' => array( 'type' => 'string' ),
							'size'   => array( 'type' => 'integer' ),
							'img'    => array(
								'type'       => 'object',
								'properties' => array(
									'ref'        => array( 'type' => 'string' ),
									'type'       => array( 'type' => 'string' ),
									'iconAnchor' => array(
										'type'       => 'object',
										'properties' => array(
											'x' => array(
												'type' => 'number',
											),
											'y' => array(
												'type' => 'number',
											),
										),
									),
								),
							),
							'delete' => array( 'type' => 'boolean' ),
						),
					),
				),
				'prepare_callback' => array( $this, 'get_marker_icons' ),
			),
		);

		register_meta( 'term', 'icons', $meta_args );
	}

	/**
	 * Get marker icons related to this
	 *
	 * @param array            $icon_ids Value from the meta field.
	 * @param \WP_REST_Request $request Request object.
	 * @param array            $args REST-specific options for the meta key.
	 * @return array List of marker icons.
	 * @since 0.1.0
	 **/
	public function get_marker_icons( $icon_ids, \WP_REST_Request $request, $args ) {
		if ( empty( $icon_ids ) ) {
			return array();
		}

		$icons = get_terms(
			array(
				'taxonomy' => 'marker-icon',
				'include'  => $icon_ids,
			)
		);

		$res = array();

		foreach ( $icons as $icon ) {
			$meta  = get_term_meta( $icon->term_id );
			$res[] = array(
				'id'     => $icon->term_id,
				'name'   => $icon->name,
				'colour' => $meta['colour'][0] ?? '',
				'size'   => (int) $meta['size'][0] ?? 0,
				'img'    => array(
					'type'       => $meta['type'][0] ?? '',
					'ref'        => $meta['ref'][0] ?? '',
					'iconAnchor' => unserialize( $meta['iconAnchor'][0] ) ?? array(),
				),
				'delete' => false,
			);
		}

		return $res;
	}

	/**
	 * Save marker icons as terms and save the term ids on the imagemap.
	 *
	 * @param  mixed $meta_value The incoming meta value.
	 * @return array             The meta value to be saved.
	 * @since 0.1.0
	 **/
	public function save_marker_icons( $meta_value ) {
		$icon_ids = array();
		foreach ( $meta_value as $icon ) {
			if ( $icon['delete'] ) {
				if ( ! empty( $icon['id'] ) ) {
					wp_delete_term( $icon['id'], MarkerIcon::NAME );
				}
			} else {
				if ( empty( $icon['id'] ) ) {
					$term = wp_insert_term( $icon['name'], MarkerIcon::NAME );
				} else {
					$term = wp_update_term( $icon['id'], MarkerIcon::NAME, array( 'name' => $icon['name'] ) );
				}

				if ( is_wp_error( $term ) ) {
					throw new \Exception( $term->get_error_message() );
				}

				update_term_meta( $term['term_id'], 'colour', $icon['colour'] );
				update_term_meta( $term['term_id'], 'size', $icon['size'] );
				update_term_meta( $term['term_id'], 'type', $icon['img']['type'] );
				update_term_meta( $term['term_id'], 'ref', $icon['img']['ref'] );

				$icon_ids[] = $term['term_id'];
			}
		}

		return $icon_ids;
	}
}
