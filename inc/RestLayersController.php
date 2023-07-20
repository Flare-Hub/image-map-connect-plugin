<?php

namespace Flare\ImageMap;

/**
 * Manage REST access to layers.
 *
 * @since 0.1.0
 */
class RestLayersController extends \WP_REST_Terms_Controller {
	/**
	 * Deletes a single layer.
	 *
	 * @param \WP_REST_Request $request  Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 0.1.0
	 **/
	public function delete_item( $request ) {
		$layer = $this->get_term( $request['id'] );
		if ( is_wp_error( $layer ) ) {
			return $layer;
		}

		if ( $layer->count > 1 ) {
			return new \WP_Error(
				'has_markers',
				__( 'You can not delete a layer that has related markers.', 'flare-imc' ),
				array( 'status' => 409 )
			);
		}

		return parent::delete_item( $request );
	}

	/**
	 * Generate a preliminary slug to allow duplicate terms.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 0.1.4
	 **/
	public function create_item( $request ) {
		$req_slug = $request['slug'];
		$req_name = $request['name'];

		if ( $req_name && ! $req_slug ) {
			// Simulate a term object with a possibly duplicate slug.
			$item = $this->prepare_item_for_database( $request );
			$slug = sanitize_title( $req_name );
			$term = (object) wp_parse_args(
				$item,
				array(
					'slug'     => $slug,
					'taxonomy' => Layer::NAME,
				)
			);

			// Ensure slug is unique and add it to the request.
			$unique_slug     = wp_unique_term_slug( $slug, $term );
			$request['slug'] = $unique_slug;
		}

		return parent::create_item( $request );
	}
}
