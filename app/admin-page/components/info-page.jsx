import { Card, CardBody, Panel, PanelBody } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import cls from './info-page.module.scss';
import processDiagram from '../images/process-diagram.svg';

/**
 * The info tab with the plugin documentation.
 */
export default function InfoPage() {
	return (
		<Card>
			<CardBody>
				<div className="col-9">
					<div className={cls.content}>
						<h2 id="about">
							{__('About the Plugin', 'flare-imc')}
						</h2>
						<p>
							{__(
								`Image Map Connect allows you to add any image to your website as an image map, and make it interactive. On the image map you can:`,
								'flare-imc'
							)}
						</p>
						<ul>
							<li>
								{__(
									'Display your posts as markers, including custom post types',
									'flare-imc'
								)}
							</li>
							<li>
								{__(
									'Show post details in a popup',
									'flare-imc'
								)}
							</li>
							<li>{__('Filter markers', 'flare-imc')}</li>
							<li>{__('Switch between layers', 'flare-imc')}</li>
							<li>{__('Zoom in and out', 'flare-imc')}</li>
						</ul>
						<h2 id="use">
							{__('How to Use the Plugin', 'flare-imc')}
						</h2>
						<figure className={cls.diagram}>
							<img src={processDiagram} alt="Process diagram" />
							<figcaption>
								{__('Image Map Connect steps', 'flare-imc')}
							</figcaption>
						</figure>
						<h3 id="admin">{__('Admin Page', 'flare-imc')}</h3>
						<p>
							{__(
								'The Admin page is the page you are currently on and has 4 tabs:',
								'flare-imc'
							)}
						</p>
						<Panel className={cls.panel}>
							<PanelBody
								title={__('Maps', 'flare-imc')}
								initialOpen={false}
							>
								<p>
									{__(
										'On the Maps tab you can manage your image map details. An image map can be added to a page or template in a block.',
										'flare-imc'
									)}
								</p>
								<p>
									{__(
										'Image map details include:',
										'flare-imc'
									)}
								</p>
								<ul>
									<li>{__('A name', 'flare-imc')}</li>
									<li>
										{__(
											'A description. This is not used anywhere else and is just for your own clarification.',
											'flare-imc'
										)}
									</li>
									<li>
										{__(
											'Post types. The post types that markers on this map can reference, e.g. Page, Post or a custom post type.',
											'flare-imc'
										)}
									</li>
									<li>
										{__(
											'Icon types. The icons that the markers will use. This keeps the style of each map consistent.',
											'flare-imc'
										)}
									</li>
								</ul>
							</PanelBody>
							<PanelBody
								title={__('Layers', 'flare-imc')}
								initialOpen={false}
							>
								<p>
									{__(
										'On the Layers tab you can manage the layers for the selected map. A map can consist of one or more layers. Each layer defines an image to display, e.g. a floor of a building. Only one layer is visible at the time and the user can switch between them.',
										'flare-imc'
									)}
								</p>
								<p>{__('All layers have:', 'flare-imc')}</p>
								<ul>
									<li>
										{__(
											'A name. The user sees this name in the public interface when selecting a layer on the map.',
											'flare-imc'
										)}
									</li>
									<li>{__('An image.', 'flare-imc')}</li>
									<li>
										{__(
											'A minimum and maximum zoom level.',
											'flare-imc'
										)}
									</li>
								</ul>
							</PanelBody>
							<PanelBody
								title={__('Markers', 'flare-imc')}
								initialOpen={false}
							>
								<p>
									{__(
										'On the Markers tab you can manage the markers of the selected layer. Markers are placed at specific coordinates on a layer and reference a post or content.',
										'flare-imc'
									)}
								</p>
								<p>
									{__(
										'When a marker is clicked, it displays a popup with marker specific details (featured image, title and excerpt). These details can either be taken from a related post or defined directly in this tab.',
										'flare-imc'
									)}
								</p>
								<p>{__('All markers have:', 'flare-imc')}</p>
								<ul>
									<li>
										{__(
											'Coordinates. Its location on the image',
											'flare-imc'
										)}
										<ul>
											<li>
												{__(
													'For new markers, these are provided by clicking on the map on the desired location.',
													'flare-imc'
												)}
											</li>
											<li>
												{__(
													'For existing markers, the marker can be dragged to change the location.',
													'flare-imc'
												)}
											</li>
										</ul>
									</li>
									<li>
										{__(
											'An icon. Displayed at the given coordinates on the map.',
											'flare-imc'
										)}
									</li>
								</ul>
								<p>
									{__(
										'A standalone marker is a marker that is not related to any post type. For these you also have to enter the following details:',
										'flare-imc'
									)}
								</p>
								<ul>
									<li>{__('A title.', 'flare-imc')}</li>
									<li>
										{__('Rich text content.', 'flare-imc')}
									</li>
									<li>
										{__('A featured image.', 'flare-imc')}
									</li>
								</ul>
							</PanelBody>
							<PanelBody
								title={__('Info', 'flare-imc')}
								initialOpen={false}
							>
								<p>
									{__(
										'The tab you are currently on.',
										'flare-imc'
									)}
								</p>
							</PanelBody>
						</Panel>
						<h3 id="block">
							{__('Interactive Image Map block', 'flare-imc')}
						</h3>
						<p>
							{__(
								'Image Map Connect includes the Interactive Image Map block. This block will show the image map in the public user interface (UI).',
								'flare-imc'
							)}
						</p>
						<Panel className={cls.panel}>
							<PanelBody
								title={__('Block placement', 'flare-imc')}
								initialOpen={false}
							>
								<p>
									{__(
										'The block can be added to any page. Additionally, this block supports block themes so it can be added to templates or template parts.',
										'flare-imc'
									)}
								</p>
							</PanelBody>
							<PanelBody
								title={__('Framing the image in the block')}
								initialOpen={false}
							>
								<p>
									{__(
										'The initial layer, zoom level and position in the public UI is based on the selected layer, position and zoom level defined in the block editor. To fix this position, press the device with lock icon on the map.',
										'flare-imc'
									)}
								</p>
							</PanelBody>
							<PanelBody
								title={__('Filtering Markers', 'flare-imc')}
								initialOpen={false}
							>
								<p>
									{__(
										'To filter the markers that are displayed on the map, place the block inside a Query Loop block. In this case only the markers referencing posts in the query loop will be displayed on the map. ',
										'flare-imc'
									)}
								</p>
								<p>
									{__(
										'You can choose to display standalone markers alongside the query loop posts by enabling this option in the block settings. However, it is not possible to filter them as they are not part of the query loop.',
										'flare-imc'
									)}
								</p>
							</PanelBody>
						</Panel>
						<h2 id="faq">
							{__('Frequently Asked Questions', 'flare-imc')}
						</h2>
						<Panel className={cls.panel}>
							<PanelBody title="Question 1" initialOpen={false}>
								Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Sapiente corporis, natus saepe
								quaerat aliquid eum, rem voluptatum ratione
								tempora ea maxime cum libero fugit tenetur
								eligendi minima et quisquam vel.
							</PanelBody>
							<PanelBody title="Question 2" initialOpen={false}>
								Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Sapiente corporis, natus saepe
								quaerat aliquid eum, rem voluptatum ratione
								tempora ea maxime cum libero fugit tenetur
								eligendi minima et quisquam vel.
							</PanelBody>
						</Panel>
						<h2 id="support">
							{__(
								'Support and Enhancement Requests',
								'flare-imc'
							)}
						</h2>
						<p>
							{/* TODO: Specify proper license in the below paragraph */}
							{__(
								'Image Map Connect is an open-source plugin with a GNU General Public License v3.0 license. As such we do not provide any warranty. Of course, we like to see our plugin used and want to keep our users happy. As such we do our best to fix any issues that you might encounter.',
								'flare-imc'
							)}
						</p>
						<p>
							{__(
								'We are also happy to hear about any features you think would be a great addition to the plugin.',
								'flare-imc'
							)}
						</p>
						<p
							dangerouslySetInnerHTML={{
								__html: sprintf(
									// translators: %s: Link to the issues page.
									__(
										'To manage the plugin and track these tickets we make use of Github. Any issues or request can be reported %s. Please just make sure to search the existing issues and only report new ones.',
										'flare-imc'
									),
									`<a href="https://github.com/Flare-Hub/image-map-connect-plugin/issues" target="_blank" rel="noreferrer"> ${__(
										'there',
										'flare-imc'
									)}</a>`
								),
							}}
						/>
						<h2 id="author">
							{__('About the Plugin Author', 'flare-imc')}
						</h2>
						<p
							dangerouslySetInnerHTML={{
								__html: sprintf(
									// translators: %s: Link to our homepage with company name as link text.
									__(
										'We are a couple who enjoy working with solutions that smoothen user experience and processes, and offer informative and useful content. Through our company %s we help organisations to design and build intuitive digital products.',
										'flare-imc'
									),
									'<a href="https://flarehub.io" target="_blank" rel="noreferrer">Flare Hub</a>'
								),
							}}
						/>
					</div>
				</div>
				<div className={cls.toc + ' col-3'}>
					<h2 id="toc">{__('Page contents', 'flare-imc')}</h2>
					<ul>
						<li>
							<a href="#about">
								{__('About the Plugin', 'flare-imc')}
							</a>
						</li>
						<li>
							<a href="#use">
								{__('How to Use the Plugin', 'flare-imc')}
							</a>
							<ul>
								<li>
									<a href="#admin">
										{__('Admin Page', 'flare-imc')}
									</a>
								</li>
								<li>
									<a href="#block">
										{__(
											'Interactive Image Map block',
											'flare-imc'
										)}
									</a>
								</li>
							</ul>
						</li>
						<li>
							<a href="#faq">
								{__('Frequently Asked Questions', 'flare-imc')}
							</a>
						</li>
						<li>
							<a href="#support">
								{__(
									'Support and Enhancement Requests',
									'flare-imc'
								)}
							</a>
						</li>
						<li>
							<a href="#author">
								{__('About the Plugin Author', 'flare-imc')}
							</a>
						</li>
					</ul>
				</div>
			</CardBody>
		</Card>
	);
}
