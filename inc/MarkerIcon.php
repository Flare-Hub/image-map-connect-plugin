<?php

namespace Flare\ImageMap;

/**
 * Manage Marker Icon taxonomy.
 *
 * @since 0.1.0
 */
class MarkerIcon {
	/**
	 * Register Marker Icon taxonomy.
	 *
	 * @since 0.1.0
	 **/
	public function register_marker_icon() {
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
		register_taxonomy( 'marker-icon', array( 'marker' ), $args );
	}

	/**
	 * Register Marker Icon's image field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_icon() {
		$meta_args = array(
			'object_subtype' => 'marker-icon',
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'icon', $meta_args );
	}

	/**
	 * Register Marker Icon's image field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_colour() {
		$meta_args = array(
			'object_subtype' => 'marker-icon',
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => true,
		);
		register_meta( 'term', 'colour', $meta_args );
	}

	/**
	 * Register Marker Map field with the rest API.
	 *
	 * @since 0.1.0
	 **/
	public function register_map() {
		register_rest_field(
			'marker-icon',
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
	 * @return integer The parent ID.
	 * @since 0.1.0
	 **/
	public function get_map( $object ) {
		return $object['parent'];
	}

	/**
	 * Description
	 *
	 * @param integer  $value Map value as set in the message body.
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

}
