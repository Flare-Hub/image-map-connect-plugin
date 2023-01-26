<?php

namespace Flare\ImageMap;

/**
 * Manage the post types rest API route.
 *
 * @since 0.1.0
 */
class PostTypesRoute {
	/**
	 * Register Post Types route.
	 *
	 * @since 0.1.0
	 **/
	public function register_route() {
		register_rest_route(
			'flare/v1',
			'/post-types/',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_post_types' ),
				'permission_callback' => array( $this, 'check_permissions' ),
			)
		);
	}

	/**
	 * Get a list of public post types.
	 *
	 * @param \WP_REST_Request $data Options for the function.
	 * @since 0.1.0
	 **/
	public function get_post_types( \WP_REST_Request $data ) {
		$types = get_post_types( array( 'public' => true ) );
		return $types;
	}

	/**
	 * Check if the user has the permission to execute this rest api request.
	 *
	 * @since 0.1.0
	 **/
	public function check_permissions() {
		return current_user_can( AdminMenu::CAPABILITY );
	}
}
