<?php

namespace Flare\ImageMap;

/**
 * Manage Marker Icon taxonomy.
 *
 * @since 0.1.0
 */
class MarkerIcon {
	/** @var string $name The taxonomy name for marker icons. */
	public static $name = 'marker-icon';

	/**
	 * Register Marker Icon taxonomy.
	 *
	 * @param array $post_types The post types that should support image maps.
	 * @since 0.1.0
	 **/
	public function register_marker_icon( array $post_types ) {
		$labels = array(
			'name'              => _x( 'Marker Icons', 'taxonomy general name', 'flare-im' ),
			'singular_name'     => _x( 'Marker Icon', 'taxonomy singular name', 'flare-im' ),
			'search_items'      => __( 'Search Marker Icons', 'flare-im' ),
			'all_items'         => __( 'All Marker Icons', 'flare-im' ),
			'parent_item'       => __( 'Parent Marker Icon', 'flare-im' ),
			'parent_item_colon' => __( 'Parent Marker Icon:', 'flare-im' ),
			'edit_item'         => __( 'Edit Marker Icon', 'flare-im' ),
			'update_item'       => __( 'Update Marker Icon', 'flare-im' ),
			'add_new_item'      => __( 'Add New Marker Icon', 'flare-im' ),
			'new_item_name'     => __( 'New Marker Icon Name', 'flare-im' ),
			'menu_name'         => __( 'Marker Icon', 'flare-im' ),
		);
		$args   = array(
			'labels'             => $labels,
			'description'        => __( 'Marker Icons', 'flare-im' ),
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
			'rest_base'          => 'marker-icons',
		);
		register_taxonomy( self::$name, $post_types, $args );
	}

	/**
	 * Register Marker Icon's colour field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_colour() {
		$meta_args = array(
			'object_subtype' => self::$name,
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'colour', $meta_args );
	}

	/**
	 * Register Marker Icon's location field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_loc() {
		$meta_args = array(
			'object_subtype' => self::$name,
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'loc', $meta_args );
	}

	/**
	 * Register Marker Icon's type field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_type() {
		$meta_args = array(
			'object_subtype' => self::$name,
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'type', $meta_args );
	}

	/**
	 * Register Marker Icon's size field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_size() {
		$meta_args = array(
			'object_subtype' => self::$name,
			'type'           => 'integer',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'size', $meta_args );
	}

	/**
	 * Register Marker Icon's anchor field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_anchor() {
		$meta_args = array(
			'object_subtype' => self::$name,
			'type'           => 'object',
			'single'         => true,
			'show_in_rest'   => array(
				'schema' => array(
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
		);
		register_meta( 'term', 'iconAnchor', $meta_args );
	}

	/**
	 * Register Marker Icon's popup anchor field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_popup_anchor() {
		$meta_args = array(
			'object_subtype' => self::$name,
			'type'           => 'object',
			'single'         => true,
			'show_in_rest'   => array(
				'schema' => array(
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
		);
		register_meta( 'term', 'popupAnchor', $meta_args );
	}

	/**
	 * Remove Parent field from the rest API.
	 *
	 * @param \WP_REST_Response $response The response object.
	 * @param \WP_Term          $term The original term object.
	 * @param \WP_REST_Request  $request Request used to generate the response.
	 * @return \WP_REST_Response The response object.
	 *
	 * @since 0.1.0
	 */
	public function unregister_parent( \WP_REST_Response $response, \WP_Term $term, \WP_REST_Request $request ) {
		$data = $response->get_data();
		unset( $data['parent'] );
		$response->set_data( $data );
		return $response;
	}

	/**
	 * Register Marker Map field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_map() {
		register_rest_field(
			self::$name,
			'map',
			array(
				'get_callback'    => array( $this, 'get_map' ),
				'update_callback' => array( $this, 'update_map' ),
				'schema'          => array( 'type' => 'integer' ),
			)
		);
	}

	/**
	 * Description.
	 *
	 * @param array $object The term that is being requested.
	 * @return int The parent ID.
	 * @since 0.1.0
	 **/
	public function get_map( $object ) {
		return $object['parent'];
	}

	/**
	 * Description
	 *
	 * @param int      $value Map value as set in the message body.
	 * @param \WP_Term $term The term that is being updated.
	 * @param string   $field_name The name of the field being updated.
	 * @since 0.1.0
	 **/
	public function update_map( $value, $term, $field_name ) {
		return wp_update_term(
			$term->term_id,
			$term->taxonomy,
			array( 'parent' => $value )
		);
	}

	/**
	 * Description
	 *
	 * @param array            $prepared_args Array of arguments for get_terms().
	 * @param \WP_REST_Request $request The REST API request.
	 * @return array Array of arguments for get_terms().
	 * @since 0.1.0
	 **/
	public function query_map( array $prepared_args, \WP_REST_Request $request ) {
		$map                     = $request->get_param( 'map' );
		$prepared_args['parent'] = intval( $map );
		return $prepared_args;
	}
}
