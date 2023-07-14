import { PanelBody, Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import cls from './initial-view.module.scss';

/**
 * Toggle responsiveness and explain how the initial view works for different devices.
 */
export default function InitialViewPanel() {
	const preview = useSelect((select) => {
		const editPost = select('core/edit-post');
		return editPost ? editPost.__experimentalGetPreviewDeviceType() : null;
	});

	const dispatchPost = useDispatch('core/edit-post');
	const setPreview = dispatchPost?.__experimentalSetPreviewDeviceType;

	const devices = [
		{ name: 'Desktop', icon: 'macbook-fill', size: 24 },
		{ name: 'Tablet', icon: 'tablet-fill', size: 24 },
		{ name: 'Mobile', icon: 'smartphone-fill', size: 22 },
	];

	return (
		<PanelBody title={__('Initial Image Frame')} initialOpen={false}>
			{preview && (
				<div className={cls.buttons}>
					{devices.map((device) => (
						<Button
							key={device.name}
							onClick={() => setPreview(device.name)}
						>
							<i
								className={'ri-' + device.icon}
								style={{
									fontSize: device.size,
									color:
										preview === device.name
											? '#000'
											: '#d1d1d1',
								}}
							/>
						</Button>
					))}
				</div>
			)}
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
