<?php
namespace Flare\ImageMap;

/**
 * Manage plugin blocks for the block editor.
 */
class BlockMgr {
		const ASSETDIR = 'assets/build/';

	/** @var string $plugin_dir Directory of this plugin. */
	protected $plugin_dir;

	/**
	 * Constructor.
	 *
	 * @since 0.1.0
	 **/
	public function __construct() {
		$this->plugin_dir = plugin_dir_path( __DIR__ ) . self::ASSETDIR;
	}

	/**
	 * Register all blocks with WordPress.
	 *
	 * @since 0.1.0
	 **/
	public function register_blocks() {
		register_block_type(
			$this->plugin_dir . 'map-query-block',
			array( 'render_callback' => array( $this, 'render_map_query' ) )
		);
	}

	/**
	 * Provide the html container for the map query block.
	 *
	 * @param array     $attributes The attributes as stored in the block html.
	 * @param string    $content The inner html of the block coming from the post html.
	 * @param \WP_Block $block The block instance.
	 * @return string|void The
	 * @since 0.1.0
	 **/
	public function render_map_query( $attributes, $content, \WP_Block $block ) {
		// Do nothing if no ID is set for the map.
		if ( ! isset( $attributes['mapId'] ) ) {
			return;
		}

		// HTML attributes to add to the map div.
		$block_attr = array();

		// Check if the block is inside a query loop block.
		if ( isset( $block->context['query'] ) ) {
			$block_attr['data-post-ids'] = $this->get_query_post_ids( $attributes, $block );
		}

			// Set data attributes for the map div.
			$block_attr['style']                 = 'height: ' . $attributes['height'] . ';';
			$block_attr['data-map-id']           = $attributes['mapId'];
			$block_attr['data-show-standalone']  = $attributes['showStandAlone'];
			$block_attr['data-initial-layer']    = $attributes['initialView']['layer'];
			$block_attr['data-initial-zoom']     = $attributes['initialView']['zoom'];
			$block_attr['data-initial-center-x'] = $attributes['initialView']['center'][0];
			$block_attr['data-initial-center-y'] = $attributes['initialView']['center'][1];

		// Default marker popup template.
		$template = apply_filters( 'flare_marker_popup_template', '', $attributes['mapId'] );

		// Return div to place map in with post IDs of markers to include.
		ob_start();
		?>
		<div <?php echo wp_kses_data( get_block_wrapper_attributes( $block_attr ) ); ?>>
			<template>
				<?php echo wp_kses_post( $template ); ?>
			</template>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get post IDs in the parent query loop.
	 *
	 * @param array     $attributes The attributes as stored in the block html.
	 * @param \WP_Block $block The block instance.
	 * @return string Comma seperated list of post IDs.
	 * @since 0.1.0
	 **/
	public function get_query_post_ids( array $attributes, \WP_Block $block ) {
					// If the query loop is inherited from the template, get the global query parameters.
		if ( $block->context['query']['inherit'] ) {
			/** @global \WP_Query $wp_the_query */
			global $wp_the_query;
			$query_args = $wp_the_query->query;
		} else {
			// Get the query parameters from the query loop block, for the provided page if necessary.
			$page_key = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
			// @codingStandardsIgnoreStart
			$page     = (( 'query' === $attributes['queryType'] ) || empty( $_GET[ $page_key ] ))
				? 1	: (int) $_GET[ $page_key ];
			// @codingStandardsIgnoreEnd

			$query_args = build_query_vars_from_query_block( $block, $page );
		}

			// Only the post ids are required here. The map will fetch the required details from the REST API.
			$query_args['fields'] = 'ids';

			// Disable paging if the full query is required.
		if ( 'query' === $attributes['queryType'] ) {
			$query_args['nopaging']       = true;
			$query_args['posts_per_page'] = -1;
		}

		// Run the query to add it's post ids.
		$query = new \WP_Query( $query_args );

		return implode( ',', $query->get_posts() );
	}

	/**
	 * Get default popup template. This is a mustache template that is processed on the frontend.
	 *
	 * @param string $template the template passed by the filter.
	 * @return string The Mustache template.
	 * @since 0.1.0
	 **/
	public function get_popup_template( string $template ) {
		ob_start();
		?>
		{{#standalone}}
			<h4>{{ title.rendered }}</h4>
		{{/standalone}}
		{{^standalone}}
			<a href="{{ link }}"><h4>{{ title.rendered }}</h4></a>
		{{/standalone}}
		<div>
			<img
				class="flare-popup-thumbnail"
				src="{{ featured_media.media_details.sizes.thumbnail.source_url }}"
				alt="{{ featured_media.alt_text }}"
			/>
			{{{ excerpt.rendered }}}
		</div>
		{{^standalone}}
			<a href="{{ link }}">Read more...</a>
		{{/standalone}}
		<?php

		return ob_get_clean();
	}
}
