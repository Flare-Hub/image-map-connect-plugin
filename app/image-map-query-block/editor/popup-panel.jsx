import {
	BaseControl,
	PanelBody,
	ToggleControl,
	ButtonGroup,
	Button,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalBorderBoxControl as BorderBoxControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

import cls from './popup-panel.module.scss';
import { __ } from '@wordpress/i18n';

/**
 * @typedef Popup
 * @property {{height: string, width: string}}                            dimensions      Popup size.
 * @property {{show: boolean, height: number, width: number}}             image           Aspect ratio to display the featured image in.
 * @property {Object}                                                     title           Title styling
 * @property {boolean}                                                    title.show      Show the title in the popup.
 * @property {{ top:string, right: string, bottom: string, left: string}} title.margins   Title margins.
 * @property {string}                                                     title.tag       Heading tag number for the title.
 * @property {Object}                                                     meta            Metadata styling.
 * @property {boolean}                                                    meta.show       Show the metadata in the popup.
 * @property {{ top:string, right: string, bottom: string, left: string}} meta.margins    Metadata margins.
 * @property {string}                                                     meta.size       Font size for the metadata.
 * @property {Object}                                                     excerpt         Excerpt styling.
 * @property {boolean}                                                    excerpt.show    Show the excerpt in the popup.
 * @property {{ top:string, right: string, bottom: string, left: string}} excerpt.margins Excerpt margins.
 * @property {string}                                                     excerpt.size    Font size for the excerpt.
 * @property {number}                                                     excerpt.line    Line height for the excerpt.
 */

/**
 * Sidebar panel to manage the marker popup settings.
 *
 * @param {Object}                 props
 * @param {Popup}                  props.popup    Popup settings
 * @param {(popup: Popup) => void} props.setPopup Settings change handler.
 */
export default function PopupPanel({ popup, setPopup }) {
	/** @param {Popup['dimensions']} val */
	function setDimensions(val) {
		setPopup({ ...popup, dimensions: { ...popup.dimensions, ...val } });
	}

	/** @param {Popup['image']} val */
	function setImage(val) {
		setPopup({ ...popup, image: { ...popup.image, ...val } });
	}

	/** @param {Popup['title']} val */
	function setTitle(val) {
		setPopup({ ...popup, title: { ...popup.title, ...val } });
	}

	/** @param {Popup['meta']} val */
	function setMeta(val) {
		setPopup({ ...popup, meta: { ...popup.meta, ...val } });
	}

	/** @param {Popup['excerpt']} val */
	function setExcerpt(val) {
		setPopup({ ...popup, excerpt: { ...popup.excerpt, ...val } });
	}

	return (
		<PanelBody
			title={__('Marker Popup', 'flare-imc')}
			initialOpen={false}
			className={cls.panel}
		>
			<div className={cls.columns}>
				<UnitControl
					label={__('Height')}
					value={popup.dimensions.height}
					onChange={(val) => setDimensions({ height: val })}
				/>
				<UnitControl
					label={__('Width')}
					value={popup.dimensions.width}
					onChange={(val) => setDimensions({ width: val })}
				/>
			</div>
			<ToggleControl
				label={__('Display Featured Image', 'flare-imc')}
				className={cls.include}
				checked={popup.image.show}
				onChange={(val) => setImage({ show: val })}
				__nextHasNoMarginBottom
			/>
			{popup.image.show && (
				<BaseControl
					label={__('Image Ratio', 'flare-imc')}
					id="imc-image-ratio"
					__nextHasNoMarginBottom
				>
					<div className={`${cls.columns} ${cls.imageRatio}`}>
						<NumberControl
							value={popup.image.width}
							onChange={(val) => setImage({ width: val })}
						/>
						<NumberControl
							value={popup.image.height}
							onChange={(val) => setImage({ height: val })}
						/>
					</div>
				</BaseControl>
			)}
			<ToggleControl
				label={__('Display Title', 'flare-imc')}
				className={cls.include}
				checked={popup.title.show}
				onChange={(val) => setTitle({ show: val })}
				__nextHasNoMarginBottom
			/>
			{popup.title.show && (
				<>
					<BorderBoxControl
						label={__('Margins')}
						className={cls.borders}
						value={popup.title.margins}
						onChange={(val) => setTitle({ margins: val })}
						__experimentalIsRenderedInSidebar
					/>
					<BaseControl
						label={__('Tag')}
						id="imc-header-tag-selector"
						__nextHasNoMarginBottom
					>
						<ButtonGroup>
							{['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
								(heading) => (
									<Button
										key={heading}
										variant={
											heading === popup.title.tag &&
											'primary'
										}
										onClick={() =>
											setTitle({ tag: heading })
										}
									>
										{heading.toUpperCase()}
									</Button>
								)
							)}
						</ButtonGroup>
					</BaseControl>
				</>
			)}
			<ToggleControl
				label={__('Display metadata', 'flare-imc')}
				className={cls.include}
				checked={popup.meta.show}
				onChange={(val) => setMeta({ show: val })}
				__nextHasNoMarginBottom
			/>
			{popup.meta.show && (
				<>
					<BorderBoxControl
						label={__('Margins')}
						className={cls.borders}
						value={popup.meta.margins}
						onChange={(val) => setMeta({ margins: val })}
						__experimentalIsRenderedInSidebar
					/>
					<div className={cls.columns}>
						<UnitControl
							label={__('Font Size')}
							value={popup.meta.size}
							onChange={(val) => setMeta({ size: val })}
						/>
					</div>
				</>
			)}
			<ToggleControl
				label={__('Display excerpt', 'flare-imc')}
				className={cls.include}
				checked={popup.excerpt.show}
				onChange={(val) => setExcerpt({ show: val })}
				__nextHasNoMarginBottom
			/>
			{popup.excerpt.show && (
				<>
					<BorderBoxControl
						label={__('Margins')}
						className={cls.borders}
						value={popup.excerpt.margins}
						onChange={(val) => setExcerpt({ margins: val })}
						__experimentalIsRenderedInSidebar
					/>
					<div className={cls.columns}>
						<UnitControl
							label={__('Font Size')}
							value={popup.excerpt.size}
							onChange={(val) => setExcerpt({ size: val })}
						/>
						<NumberControl
							label={__('Line Height')}
							value={popup.excerpt.line}
							onChange={(val) => setExcerpt({ line: val })}
						/>
					</div>
				</>
			)}
		</PanelBody>
	);
}
