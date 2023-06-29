<?php

namespace Flare\ImageMap;

/**
 * Manage REST access to maps.
 *
 * @since 0.1.0
 */
class RestMapsController extends \WP_REST_Posts_Controller {
	/**
	 * Deletes a single map.
	 *
	 * @param \WP_REST_Request $request  Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 * @since 0.1.0
	 **/
	public function delete_item( $request ) {
		$post = $this->get_post( $request['id'] );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$layers = wp_get_post_terms(
			$post->ID,
			Layer::NAME,
			array( 'fields' => 'ids' )
		);

		if ( count( $layers ) > 0 ) {
			return new \WP_Error(
				'has_layers',
				__( 'You can not delete a map that has related layers.', 'flare-imc' ),
				array( 'status' => 409 )
			);
		}

		return parent::delete_item( $request );
	}
}
