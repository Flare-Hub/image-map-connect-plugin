<?php

namespace Flare\ImageMap;

/**
 * Manage Markers post type.
 *
 * @since 0.1.0
 */
class Marker {
	/** @var string $post_type The custom post type name for markers. */
	public const POST_TYPE = 'imc-marker';

	/**
	 * Register Markers post type.
	 *
	 * @since 0.1.0
	 **/
	public function register_marker_cpt() {
		$labels = array(
			'name'                  => _x( 'Markers', 'Post Type General Name', 'flare-imc' ),
			'singular_name'         => _x( 'Marker', 'Post Type Singular Name', 'flare-imc' ),
			'menu_name'             => _x( 'Markers', 'Admin Menu text', 'flare-imc' ),
			'name_admin_bar'        => _x( 'Marker', 'Add New on Toolbar', 'flare-imc' ),
			'archives'              => __( 'Marker Archives', 'flare-imc' ),
			'attributes'            => __( 'Marker Attributes', 'flare-imc' ),
			'parent_item_colon'     => __( 'Parent Marker:', 'flare-imc' ),
			'all_items'             => __( 'All Markers', 'flare-imc' ),
			'add_new_item'          => __( 'Add New Marker', 'flare-imc' ),
			'add_new'               => __( 'Add New', 'flare-imc' ),
			'new_item'              => __( 'New Marker', 'flare-imc' ),
			'edit_item'             => __( 'Edit Marker', 'flare-imc' ),
			'update_item'           => __( 'Update Marker', 'flare-imc' ),
			'view_item'             => __( 'View Marker', 'flare-imc' ),
			'view_items'            => __( 'View Markers', 'flare-imc' ),
			'search_items'          => __( 'Search Marker', 'flare-imc' ),
			'not_found'             => __( 'Not found', 'flare-imc' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'flare-imc' ),
			'featured_image'        => __( 'Featured Image', 'flare-imc' ),
			'set_featured_image'    => __( 'Set featured image', 'flare-imc' ),
			'remove_featured_image' => __( 'Remove featured image', 'flare-imc' ),
			'use_featured_image'    => __( 'Use as featured image', 'flare-imc' ),
			'insert_into_item'      => __( 'Insert into Marker', 'flare-imc' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Marker', 'flare-imc' ),
			'items_list'            => __( 'Markers list', 'flare-imc' ),
			'items_list_navigation' => __( 'Markers list navigation', 'flare-imc' ),
			'filter_items_list'     => __( 'Filter Markers list', 'flare-imc' ),
		);
		$args   = array(
			'label'               => __( 'Marker', 'flare-imc' ),
			'description'         => __( 'Markers on an image map.', 'flare-imc' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'excerpt', 'thumbnail', 'author', 'custom-fields' ),
			'taxonomies'          => array( Layer::NAME, MarkerIcon::NAME ),
			'public'              => false,
			'show_ui'             => false,
			'show_in_menu'        => false,
			'show_in_admin_bar'   => false,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'hierarchical'        => false,
			'exclude_from_search' => true,
			'show_in_rest'        => true,
			'rest_base'           => 'imc_markers',
			'publicly_queryable'  => false,
			'capability_type'     => 'post',
		);
		register_post_type( self::POST_TYPE, $args );
	}

	/**
	 * Include post types with location meta in the REST list for markers,
	 * and exclude given post types.
	 *
	 * @param array            $args The query args used to get the list.
	 * @param \WP_REST_Request $request The REST request.
	 * @return array The updated query args.
	 * @since 0.1.0
	 **/
	public function filter_rest_query( array $args, \WP_REST_Request $request ) {
		$layers     = $request->get_param( 'imc_layers' );
		$post_types = $request->get_param( 'post_types' );

		if ( ! $layers ) {
			// For unlinked posts, query for posts that do not have a location set.
			if ( 'unlinked' === $post_types ) {
				if ( empty( $args['meta_query'] ) ) {
				$args['meta_query'] = array(); //phpcs:ignore
				}
				$args['meta_query'][] = array(
					'key'     => LocationMeta::LOC_FIELD,
					'compare' => 'NOT EXISTS',
				);
				// If no layer is provided, update query to include posts with any layer set.
			} else {
				if ( empty( $args['tax_query'] ) ) {
					$args['tax_query'] = array(); //phpcs:ignore
				}
				$args['tax_query'][] = array(
					'taxonomy' => Layer::NAME,
					'operator' => 'EXISTS',
				);
			}
		}

		// Get all post types to include in the query.
		$map_id            = $request->get_param( 'map' );
		$args['post_type'] = $this->get_req_post_types( $post_types, $args['post_type'], $map_id );

		return $args;
	}

	/**
	 * Get post types to query for a given marker rest request.
	 *
	 * @param string|null               $req_types Post types parameter in the request.
	 * @param string|array<int, string> $post_type The post type query arg.
	 * @param int|false                 $map_id ID for the queried map.
	 * @return string|array<int, string> Post types to add to the query args.
	 * @since 0.1.0
	 **/
	public function get_req_post_types( $req_types, $post_type, $map_id ) {
		switch ( $req_types ) {
			case 'linked':
			case 'unlinked':
				// Get post types linked to map.
				if ( $map_id ) {
					return get_post_meta( $map_id, 'post_types', false );
				}
				// If no map provided, return post type as is.

			case 'standalone':
				// Return post type as is.
				return $post_type;

			default:
				// Get standalone and map post types.
				$arg_types = is_array( $post_type ) ? $post_type : array( $post_type );
				$map_types = $map_id ? get_post_meta( $map_id, 'post_types', false ) : array();
				return array_merge( $map_types, $arg_types ?? array() );
		}
	}
}
