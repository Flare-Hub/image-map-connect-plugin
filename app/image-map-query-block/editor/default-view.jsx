import { PanelBody, Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import cls from './default-view.module.scss';

/**
 * Toggle responsiveness and explain how the initial view works for different devices.
 */
export default function DefaultViewPanel() {
	const preview = useSelect((select) => {
		const editPost = select('core/edit-post');
		return editPost ? editPost.__experimentalGetPreviewDeviceType() : null;
	});

	const dispatchPost = useDispatch('core/edit-post');
	const setPreview = dispatchPost?.__experimentalSetPreviewDeviceType;

	const devices = [
		{ name: 'Desktop', icon: 'desktop' },
		{ name: 'Tablet', icon: 'tablet' },
		{ name: 'Mobile', icon: 'smartphone' },
	];

	return (
		<PanelBody title={__('Initial Image Frame')} initialOpen={false}>
			{preview && (
				<div className={cls.buttons}>
					{devices.map((device) => (
						<Button
							key={device.name}
							onClick={() => setPreview(device.name)}
							icon={device.icon}
							variant={device.name === preview ? 'tertiary' : ''}
						/>
					))}
				</div>
			)}
			{__(
				'To set the default layer, and its position and zoom level:',
				'flare-imc'
			)}
			<ol>
				<li>
					{__(
						'If the map has multiple layers, select the layer to set as default from the layer selector.',
						'flare-imc'
					)}
				</li>
				<li>
					{__('Pan/zoom to frame the image as desired.', 'flare-imc')}
				</li>
				<li>
					{__(
						'Press the device icon with the lock. This will set the selected view and layer as the default for the selected device type.',
						'flare-imc'
					)}
				</li>
				{preview && (
					<li>
						{__(
							'Change the preview mode using the buttons above and repeat the process to change the image frame on different device types.',
							'flare-imc'
						)}
					</li>
				)}
			</ol>
		</PanelBody>
	);
}
