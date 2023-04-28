<?php

namespace Flare\ImageMap;

/**
 * Manage Markers post type.
 *
 * @since 0.1.0
 */
class Marker {
	/** @var string $post_type The custom post type name for markers. */
	public const POST_TYPE = 'marker';

	/**
	 * Register Markers post type
	 *
	 * @since 0.1.0
	 **/
	public function register_marker_cpt() {
		$labels = array(
			'name'                  => _x( 'Markers', 'Post Type General Name', 'flare-im' ),
			'singular_name'         => _x( 'Marker', 'Post Type Singular Name', 'flare-im' ),
			'menu_name'             => _x( 'Markers', 'Admin Menu text', 'flare-im' ),
			'name_admin_bar'        => _x( 'Marker', 'Add New on Toolbar', 'flare-im' ),
			'archives'              => __( 'Marker Archives', 'flare-im' ),
			'attributes'            => __( 'Marker Attributes', 'flare-im' ),
			'parent_item_colon'     => __( 'Parent Marker:', 'flare-im' ),
			'all_items'             => __( 'All Markers', 'flare-im' ),
			'add_new_item'          => __( 'Add New Marker', 'flare-im' ),
			'add_new'               => __( 'Add New', 'flare-im' ),
			'new_item'              => __( 'New Marker', 'flare-im' ),
			'edit_item'             => __( 'Edit Marker', 'flare-im' ),
			'update_item'           => __( 'Update Marker', 'flare-im' ),
			'view_item'             => __( 'View Marker', 'flare-im' ),
			'view_items'            => __( 'View Markers', 'flare-im' ),
			'search_items'          => __( 'Search Marker', 'flare-im' ),
			'not_found'             => __( 'Not found', 'flare-im' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'flare-im' ),
			'featured_image'        => __( 'Featured Image', 'flare-im' ),
			'set_featured_image'    => __( 'Set featured image', 'flare-im' ),
			'remove_featured_image' => __( 'Remove featured image', 'flare-im' ),
			'use_featured_image'    => __( 'Use as featured image', 'flare-im' ),
			'insert_into_item'      => __( 'Insert into Marker', 'flare-im' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Marker', 'flare-im' ),
			'items_list'            => __( 'Markers list', 'flare-im' ),
			'items_list_navigation' => __( 'Markers list navigation', 'flare-im' ),
			'filter_items_list'     => __( 'Filter Markers list', 'flare-im' ),
		);
		$args   = array(
			'label'               => __( 'Marker', 'flare-im' ),
			'description'         => __( 'Markers on an image map.', 'flare-im' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'excerpt', 'thumbnail', 'author', 'custom-fields' ),
			'taxonomies'          => array( ImageMap::NAME, MarkerIcon::NAME ),
			'public'              => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'show_in_admin_bar'   => false,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'hierarchical'        => false,
			'exclude_from_search' => true,
			'show_in_rest'        => true,
			'rest_base'           => 'markers',
			'publicly_queryable'  => false,
			'capability_type'     => 'post',
		);
		register_post_type( self::POST_TYPE, $args );
	}

	/**
	 * Include post types with location meta in the REST list route for markers,
	 * and exclude given post types.
	 *
	 * @param array            $args The query args used to get the list.
	 * @param \WP_REST_Request $request The REST request.
	 * @return array The updated query args.
	 * @since 0.1.0
	 **/
	public function filter_rest_query( array $args, \WP_REST_Request $request ) {
		$imagemaps = $request->get_param( 'imagemaps' );

		// If no imagemap is provided, update query to include posts with any imagemap set.
		$post_types = $request->get_param( 'post_types' );
		if ( ! $imagemaps && 'unlinked' !== $post_types ) {
			$tax_query         = array_key_exists( 'tax_query', $args ) ? $args['tax_query'] : array();
			$args['tax_query'] = $this->get_marker_tax_query( $tax_query ); //phpcs:ignore
		}

		// Get all post types to include in the query.
		$map_id            = $request->get_param( 'map' )
			?? $this->get_parent_map( $imagemaps ? $imagemaps[0] : false );
		$args['post_type'] = $this->get_req_post_types( $post_types, $args['post_type'], $map_id );

		return $args;
	}

	/**
	 * Add search to tax query to include any post with an imagemap.
	 *
	 * @param array $tax_query The query arg by the same name.
	 * @return array The updated tax query.
	 * @since 0.1.0
	 **/
	public function get_marker_tax_query( array $tax_query ) {
		$tax_query[] = array(
			'taxonomy' => 'imagemap',
			'operator' => 'EXISTS',
		);

		return $tax_query;
	}

	/**
	 * Get parent map for a given layer.
	 *
	 * @param int $layer Child layer.
	 * @return int|false Map ID.
	 * @since 0.1.0
	 **/
	public function get_parent_map( int $layer ) {
		if ( ! $layer ) {
			return false;
		}

		$map_hierarchy = get_ancestors( $layer, ImageMap::NAME );
		return $map_hierarchy ? end( $map_hierarchy ) : $layer;
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
					return get_term_meta( $map_id, 'post_types', false );
				}
				// If no map provided, return post type as is.

			case 'standalone':
				// Return post type as is.
				return $post_type;

			default:
				// Get standalone and map post types.
				$arg_types = is_array( $post_type ) ? $post_type : array( $post_type );
				$map_types = $map_id ? get_term_meta( $map_id, 'post_types', false ) : array();
				return array_merge( $map_types, $arg_types ?? array() );
		}
	}
}
