import { Icon, Tooltip } from '@wordpress/components';

import cls from './edit-form.module.scss';

/**
 * An input label with an info icon with tooltip.
 *
 * @param {Object} props
 * @param {string} props.name    Text to display in the label
 * @param {string} props.tooltip Text to display in the tooltip.
 */
export default function Label( { name, tooltip } ) {
	return (
		<Tooltip text={ tooltip }>
			<div className={ cls.infoLabel }>
				<span>{ name }</span>
				<Icon icon="info" />
			</div>
		</Tooltip>
	);
}
