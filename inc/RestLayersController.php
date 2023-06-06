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
				__( 'You can not delete a layer that has related markers.', 'flare-im' ),
				array( 'status' => 409 )
			);
		}

		return parent::delete_item( $request );
	}
}
