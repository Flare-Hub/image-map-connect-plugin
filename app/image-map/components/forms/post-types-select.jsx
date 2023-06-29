import { CheckboxControl } from '@wordpress/components';
import { useEffect, useState, forwardRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

import useNotice from '../../hooks/useNotice';

import cls from './post-types-select.module.scss';

/**
 * Post type selector.
 *
 * @param {Object}                         props
 * @param {Array<string>}                  props.selected   List of selected post types.
 * @param {(types: Array<string>) => void} props.onSelect   Callback that is called when a post type is selected.
 * @param {() => void}                     props.onBlur     Callback that is called when field focus is lost.
 * @param {string}                         props.inputClass Class to be added to the checkbox wrapper.
 *                                                          Will be provided a list of selected post types.
 * @param {string}                         props.id         ID of the container div.
 * @param {import('react').Ref}            ref
 */
function PostTypesSelect(
	{ selected, onSelect, onBlur, inputClass, id },
	ref
) {
	const [ types, setAll ] = useState( [] );
	const createNotice = useNotice();

	// Get public post types from WordPress.
	useEffect( () => {
		apiFetch( { path: 'flare/v1/post-types' } )
			.then( ( res ) => {
				setAll( Object.values( res ) );
			} )
			.catch( () => {
				createNotice( {
					message: __(
						'Unable to load post types. Please refresh to try again.',
						'flare-imc'
					),
					style: 'error',
				} );
			} );
	}, [ createNotice ] );

	/**
	 * Update the selected post types.
	 *
	 * @param {boolean}             checked Whether the checkbox is checked.
	 * @param {Object<any, string>} type    Post type details.
	 */
	function handleChange( checked, type ) {
		const updSelected = checked
			? [ ...selected, type ]
			: selected.filter( ( sel ) => sel !== type );
		onSelect( updSelected );
	}

	return (
		<div className={ inputClass } ref={ ref } id={ id }>
			{ types.map( ( type ) => (
				<CheckboxControl
					key={ type }
					label={ type }
					checked={ selected.includes( type ) }
					onChange={ ( checked ) => handleChange( checked, type ) }
					className={ cls.checkbox }
					onBlur={ onBlur }
				/>
			) ) }
		</div>
	);
}

export default forwardRef( PostTypesSelect );
