<?php

namespace Flare\ImageMap;

/**
 * Manage Layer taxonomy.
 *
 * @since 0.1.0
 */
class Layer {
	/** @var string NAME The taxonomy name for markers. */
	public const NAME = 'imc-layer';

	/**
	 * Register Layer taxonomy.
	 *
	 * @param array $post_types The post types that should support image maps.
	 * @since 0.1.0
	 **/
	public function register_image_map( array $post_types ) {
		$labels = array(
			'name'              => _x( 'Image Map Layers', 'taxonomy general name', 'image-map-connect' ),
			'singular_name'     => _x( 'Image Map Layer', 'taxonomy singular name', 'image-map-connect' ),
			'search_items'      => __( 'Search Layers', 'image-map-connect' ),
			'all_items'         => __( 'All Layers', 'image-map-connect' ),
			'parent_item'       => __( 'Parent Layer', 'image-map-connect' ),
			'parent_item_colon' => __( 'Parent Layer:', 'image-map-connect' ),
			'edit_item'         => __( 'Edit Layer', 'image-map-connect' ),
			'update_item'       => __( 'Update Layer', 'image-map-connect' ),
			'add_new_item'      => __( 'Add New Layer', 'image-map-connect' ),
			'new_item_name'     => __( 'New Layer Name', 'image-map-connect' ),
			'menu_name'         => __( 'Layer', 'image-map-connect' ),
		);

		$args = array(
			'labels'                => $labels,
			'description'           => __( 'Image Map Layers', 'image-map-connect' ),
			'hierarchical'          => false,
			'public'                => false,
			'publicly_queryable'    => false,
			'show_ui'               => false,
			'show_in_menu'          => false,
			'show_in_nav_menus'     => false,
			'show_tagcloud'         => false,
			'show_in_quick_edit'    => false,
			'show_admin_column'     => true,
			'show_in_rest'          => true,
			'rest_base'             => 'imc_layers',
			'rest_controller_class' => 'Flare\ImageMap\RestLayersController',
		);

		register_taxonomy( self::NAME, $post_types, $args );
	}

	/**
	 * Register Layer's image field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_image_meta() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'number',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'image', $meta_args );
	}

	/**
	 * Register flare_image field.
	 *
	 * @since 0.1.0
	 **/
	public function register_image_source() {
		$field_args = array( 'get_callback' => array( $this, 'get_image_source' ) );

		register_rest_field( self::NAME, 'image_source', $field_args );
	}

	/**
	 * Get details for the related image.
	 *
	 * @param array $layer Layer array.
	 * @since 0.1.0
	 **/
	public function get_image_source( array $layer ) {
		if ( isset( $layer['meta']['image'] ) ) {
			$image = wp_get_attachment_image_src( $layer['meta']['image'], 'full' );
			if ( $image ) {
				return array(
					'url'    => $image[0],
					'width'  => $image[1],
					'height' => $image[2],
				);
			}
		}

		return array();
	}

	/**
	 * Register Layer's max zoom level field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_zoom() {
		$meta_args = array(
			'object_subtype' => self::NAME,
			'type'           => 'object',
			'single'         => true,
			'show_in_rest'   => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'min' => array( 'type' => 'integer' ),
						'max' => array( 'type' => 'integer' ),
					),
				),
			),
		);
		register_meta( 'term', 'zoom', $meta_args );
	}

	/**
	 * Register Layers map field to add the layer to a map.
	 *
	 * @since 0.1.0
	 **/
	public function register_map() {
		register_rest_field(
			self::NAME,
			'map',
			array(
				'update_callback' => array( $this, 'add_layer_to_map' ),
				'schema'          => array( 'type' => 'integer' ),
			)
		);
	}

	/**
	 * Add layer to map.
	 *
	 * @param int      $map_id Id of the map to add the layer to.
	 * @param \WP_Term $layer The layer to add to the post.
	 * @since 0.1.0
	 **/
	public function add_layer_to_map( int $map_id, \WP_Term $layer ) {
		wp_set_post_terms( $map_id, $layer->slug, self::NAME, true );
	}
}
