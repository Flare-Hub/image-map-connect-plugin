import { PanelBody, Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import cls from './initial-view.module.scss';

/**
 *
 * @param {Object}     props
 * @param {string}     props.icon    Remixicon name.
 * @param {boolean}    props.active  Whether the icon is displayed as active.
 * @param {() => void} props.onClick Click handler.
 * @param {number}     props.size    Icon size in pixels.
 */
function Icon({ icon, active, size, onClick }) {
	return (
		<Button onClick={onClick}>
			<i
				className={'ri-' + icon}
				style={{
					fontSize: size,
					color: active ? '#000' : '#d1d1d1',
				}}
			/>
		</Button>
	);
}
/**
 * Toggle responsiveness and explain how the initial view works for different devices.
 */
export default function InitialViewPanel() {
	const preview = useSelect((select) =>
		select('core/edit-post').__experimentalGetPreviewDeviceType()
	);

	const { __experimentalSetPreviewDeviceType: setPreview } =
		useDispatch('core/edit-post');

	return (
		<PanelBody title={__('Initial Image Frame')} initialOpen={false}>
			<div className={cls.buttons}>
				<Icon
					icon={'macbook-fill'}
					active={preview === 'Desktop'}
					onClick={() => setPreview('Desktop')}
					size={24}
				/>
				<Icon
					icon={'tablet-fill'}
					active={preview === 'Tablet'}
					onClick={() => setPreview('Tablet')}
					size={24}
				/>
				<Icon
					icon={'smartphone-fill'}
					active={preview === 'Mobile'}
					onClick={() => setPreview('Mobile')}
					size={22}
				/>
			</div>
			{__(
				'To set the initial layer, position and zoom level:',
				'flare-imc'
			)}
			<ol>
				<li>
					{__(
						'Select the layer from the layer selector.',
						'flare-imc'
					)}
				</li>
				<li>
					{__('Pan/zoom to frame the image as desired.', 'flare-imc')}
				</li>
				<li>
					{__(
						'Press the device icon with the lock. This will set the initial view for the selected device type.',
						'flare-imc'
					)}
				</li>
				<li>
					{__(
						'Change the preview mode using the buttons above and repeat the process to change the image frame on different device types.',
						'flare-imc'
					)}
				</li>
			</ol>
		</PanelBody>
	);
}
