import {
	BaseControl,
	Button,
	ButtonGroup,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';

/**
 * Description
 *
 * @param {Object}                            props
 * @param {boolean}                           props.hasQuery          Query attributes are available.
 * @param {string}                            props.queryType         Whether the query is scoped to the page or the query loop.
 * @param {(queryType: string) => void}       props.setQueryType      Setter for queryType.
 * @param {boolean}                           props.showStandAlone    Whether to standalone markers in the map.
 * @param {(showStandAlone: boolean) => void} props.setShowStandAlone Setter for showStandAlone.
 */
export default function MarkerQueryPanel( {
	hasQuery,
	queryType,
	setQueryType,
	showStandAlone,
	setShowStandAlone,
} ) {
	const btnGroupId = useRef(
		'btn-grp-' + Math.floor( Math.random() * 100000000 )
	);

	return (
		<PanelBody title={ __( 'Marker query' ) }>
			{ hasQuery && (
				<>
					<BaseControl
						label={ __( 'Show markers for', 'flare-im' ) }
						help={ __( 'Help text goes here', 'flare-im' ) }
						id={ btnGroupId.current }
					>
						<ButtonGroup id={ btnGroupId.current }>
							<Button
								variant={
									queryType === 'page'
										? 'primary'
										: 'secondary'
								}
								onClick={ () => setQueryType( 'page' ) }
							>
								{ __( 'Current page' ) }
							</Button>
							<Button
								variant={
									queryType === 'query'
										? 'primary'
										: 'secondary'
								}
								onClick={ () => setQueryType( 'query' ) }
							>
								{ __( 'Whole query loop' ) }
							</Button>
						</ButtonGroup>
					</BaseControl>
					<ToggleControl
						label={ __(
							'Also display standalone markers',
							'flare-im'
						) }
						checked={ showStandAlone }
						onChange={ () => setShowStandAlone( ! showStandAlone ) }
						help={ __( 'Help text goes here', 'flare-im' ) }
					/>
				</>
			) }
			{ ! hasQuery && (
				<p>
					{ __(
						'This block will show all posts on the selected map.',
						'flare'
					) +
						' ' +
						__(
							'To filter the posts, place this block inside a query block.',
							'flare'
						) }
				</p>
			) }
		</PanelBody>
	);
}
