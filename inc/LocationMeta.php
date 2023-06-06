<?php

namespace Flare\ImageMap;

/**
 * Metadata for Custom Post Types that can be displayed on the map.
 *
 * @since 0.1.0
 */
class LocationMeta {
	/** @var string $rest_field Name of the rest field t register. */
	public const REST_FIELD = 'flare_loc';

	/** @var string $lat_field Name of the latitude field in the post meta. */
	public const LAT_FIELD = array(
		'meta' => 'lat',
		'rest' => 'lat',
	); // '_flare_loc_lat';

	/** @var string $lng_field Name of the longitude field in the post meta. */
	public const LNG_FIELD = array(
		'meta' => 'lng',
		'rest' => 'lng',
	); // '_flare_loc_lng';

	/**
	 * Register the Flare location REST API fields with the provided post type.
	 *
	 * @param string $post_type The name of the post type to register with.
	 * @since 0.1.0
	 **/
	public function register_flare_field( string $post_type ) {
		register_rest_field(
			$post_type,
			self::REST_FIELD,
			array(
				'get_callback'    => array( $this, 'get_fields' ),
				'update_callback' => array( $this, 'update_fields' ),
				'schema'          => array(
					'type'        => 'object',
					'properties'  => array(
						self::LAT_FIELD['rest'] => array( 'type' => 'number' ),
						self::LNG_FIELD['rest'] => array( 'type' => 'number' ),
					),
					'arg_options' => array(
						'validate_callback' => array( $this, 'validate_fields' ),
					),
				),
			)
		);
	}

	/**
	 * Get the location fields for the REST response.
	 *
	 * @param array $post Post details.
	 * @return array The location info.
	 * @since 0.1.0
	 **/
	public function get_fields( array $post ) {
		return array(
			self::LAT_FIELD['rest'] => (float) get_post_meta( $post['id'], self::LAT_FIELD['meta'], true ),
			self::LNG_FIELD['rest'] => (float) get_post_meta( $post['id'], self::LNG_FIELD['meta'], true ),
		);
	}

	/**
	 * Validate the REST post request before updating.
	 *
	 * @param array $value The value coming from the REST request.
	 * @return boolean Whether the fields are valid
	 * @since 0.1.0
	 **/
	public function validate_fields( array $value ) {
		$lat = $value[ self::LAT_FIELD['rest'] ];
		$lng = $value[ self::LNG_FIELD['rest'] ];
		return ( ( $lat && $lng ) || ( ! $lat && ! $lng ) );
	}

	/**
	 * Update the location fields from the REST request.
	 *
	 * @param array    $coordinates Value provided with the REST post request.
	 * @param \WP_Post $post The WordPress post object.
	 * @since 0.1.0
	 **/
	public function update_fields( array $coordinates, \WP_Post $post ) {
		foreach ( array( self::LAT_FIELD, self::LNG_FIELD ) as $field ) {
			$value = $coordinates[ $field['rest'] ];
			if ( $value ) {
				update_post_meta( $post->ID, $field['meta'], $value );
			} else {
				delete_post_meta( $post->ID, $field['meta'] );
			}
		}
	}

	/**
	 * Get all post types that should have location information.
	 *
	 * @return array The list of post type names
	 * @since 0.1.0
	 **/
	public function get_location_post_types() {
		return get_post_types( array( 'public' => true ) );
	}

	/**
	 * Add Location fields to applicable post types.
	 *
	 * @since 0.1.0
	 **/
	public function add_to_post_types() {
		$post_types   = $this->get_location_post_types();
		$post_types[] = Marker::POST_TYPE;

		foreach ( $post_types as $type ) {
			$this->register_flare_field( $type );
		}
	}
}
