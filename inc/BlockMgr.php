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
			$this->plugin_dir . 'image-map-query-block',
			array(
				'render_callback' => array( $this, 'render_map_query' ),
			)
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

		// Should the query args be inherited from the default query loop?
		$inherit = ( ! wp_is_block_theme() && is_archive() )
			|| ( isset( $block->context['query'] ) && $block->context['query']['inherit'] );

		// Check if the block is inside a query loop block.
		if ( isset( $block->context['query'] ) || $inherit ) {
			$block_attr['data-post-ids'] = $this->get_query_post_ids( $attributes['queryType'], $inherit, $block );
		}

			// Set data attributes for the map div.
			$block_attr['style']                = sprintf( 'height: %s;', $attributes['style']['height'] );
			$block_attr['data-map-id']          = $attributes['mapId'];
			$block_attr['data-show-standalone'] = $attributes['showStandAlone'];
			$block_attr['data-initial-views']   = wp_json_encode( $attributes['initialViews'], JSON_NUMERIC_CHECK );

		// Return div to place map in with post IDs of markers to include.
		ob_start();

		$save_tags             = wp_kses_allowed_html( 'post' );
		$save_tags['template'] = array( 'class' => true );

		?>
		<div <?php echo wp_kses_data( get_block_wrapper_attributes( $block_attr ) ); ?>>
				<?php echo wp_kses( $content, $save_tags ); ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get post IDs in the parent query loop.
	 *
	 * @param string    $query_type Whether to show markers only for the current page or the whole query.
	 * @param bool      $inherit Whether to inherit the query ags from the default query loop.
	 * @param \WP_Block $block The block instance.
	 * @return string Comma seperated list of post IDs.
	 * @since 0.1.0
	 **/
	public function get_query_post_ids( string $query_type, bool $inherit, \WP_Block $block ) {
					// If the query loop is inherited from the template, get the global query parameters.
		if ( $inherit ) {
			/** @global \WP_Query $wp_the_query */
			global $wp_the_query;
			$query_args = $wp_the_query->query;
		} else {
			// Get the query parameters from the query loop block, for the provided page if necessary.
			$page_key = isset( $block->context['queryId'] ) ? 'query-' . $block->context['queryId'] . '-page' : 'query-page';
			$page_num = (int) get_query_var( $page_key, 1 );
			$page     = 'query' === $query_type ? 1 : $page_num;

			$query_args = build_query_vars_from_query_block( $block, $page );
		}

			// Only the post ids are required here. The map will fetch the required details from the REST API.
			$query_args['fields'] = 'ids';

			// Disable paging if the full query is required.
		if ( 'query' === $query_type ) {
			$query_args['nopaging']       = true;
			$query_args['posts_per_page'] = -1;
		}

		// Run the query to add it's post ids.
		$query = new \WP_Query( $query_args );

		return implode( ',', $query->get_posts() );
	}
}
