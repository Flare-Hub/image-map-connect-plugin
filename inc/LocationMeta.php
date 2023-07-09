<?php

namespace Flare\ImageMap;

use WP_REST_Request;

/**
 * Metadata for Custom Post Types that can be displayed on the map.
 *
 * @since 0.1.0
 */
class LocationMeta {
	/** @var string $rest_field Name of the rest field t register. */
	public const LOC_FIELD = 'imc_loc';

	/** @var string $lat_field Name of the latitude field in the post meta. */
	public const LAT_FIELD = 'lat';

	/** @var string $lng_field Name of the longitude field in the post meta. */
	public const LNG_FIELD = 'lng';

	/** @var string IMG_FIELD Name of the image tag source field. */
	public const IMG_FIELD = 'imc_img_tag';

	/**
	 * Register the Flare location REST API fields with the provided post type.
	 *
	 * @param string $post_type The name of the post type to register with.
	 * @since 0.1.0
	 **/
	public function register_flare_field( string $post_type ) {
		register_rest_field(
			$post_type,
			self::LOC_FIELD,
			array(
				'get_callback'    => array( $this, 'get_fields' ),
				'update_callback' => array( $this, 'update_fields' ),
				'schema'          => array(
					'type'        => 'object',
					'properties'  => array(
						self::LAT_FIELD => array( 'type' => 'number' ),
						self::LNG_FIELD => array( 'type' => 'number' ),
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
		return get_post_meta( $post['id'], self::LOC_FIELD, true );
	}

	/**
	 * Validate the REST post request before updating.
	 *
	 * @param array $value The value coming from the REST request.
	 * @return boolean Whether the fields are valid
	 * @since 0.1.0
	 **/
	public function validate_fields( array $value ) {
		$lat = $value[ self::LAT_FIELD ];
		$lng = $value[ self::LNG_FIELD ];
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
		if ( $coordinates ) {
			update_post_meta( $post->ID, self::LOC_FIELD, $coordinates );
		} else {
			delete_post_meta( $post->ID, self::LOC_FIELD );
		}
	}

	/**
	 * Register featured image tag field on location post types if the field is explicitly requested.
	 *
	 * @param string $type Post type to register for.
	 * @since 0.1.0
	 **/
	public function register_featured_image_tag( $type ) {
		register_rest_field(
			$type,
			self::IMG_FIELD,
			array( 'get_callback' => array( $this, 'get_featured_image_tag' ) )
		);
	}

	/**
	 * Get the image tag for the featured image if it is explicitly requested and it exists.
	 *
	 * @param array           $post The requested post.
	 * @param string          $field The Field name to get.
	 * @param WP_REST_Request $request The API request object.
	 * @return string|void The image tag if available.
	 */
	public function get_featured_image_tag( array $post, string $field, WP_REST_Request $request ) {
		if ( ! isset( $post['type'] ) ) {
			return;
		}

		if ( 'attachment' === $post['type'] && isset( $post['id'] ) ) {
			$attachment_id = $post['id'];
		} elseif ( isset( $post['featured_media'] ) ) {
			$attachment_id = $post['featured_media'];
		} else {
			return;
		}

		$fields = explode( ',', $request->get_param( '_fields' ) );
		if ( in_array( $field, $fields, true ) ) {
			return wp_get_attachment_image( $attachment_id, 'full' );
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
			$this->register_featured_image_tag( $type );
		}
	}
}
