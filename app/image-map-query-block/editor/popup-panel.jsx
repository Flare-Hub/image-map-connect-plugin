import {
	BaseControl,
	PanelBody,
	ToggleControl,
	ButtonGroup,
	Button,
	CheckboxControl,
	RangeControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUnitControl as UnitControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalBoxControl as BoxControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { useBlockContext } from './block-context';

import cls from './popup-panel.module.scss';

/** @typedef {import('./edit').Popup} Popup */

/**
 * Sidebar panel to manage the marker popup settings.
 *
 * @param {Object}                           props
 * @param {{width: number, height: number }} props.mapSize Dimensions of the map canvas
 */
export default function PopupPanel({ mapSize }) {
	// Bet block attributes
	const {
		attributes: { popup },
		setAttributes,
	} = useBlockContext();

	// Determine maximum popup dimensions based on block size.
	const sizeLimits = useMemo(() => {
		if (!mapSize) return { width: 2000, height: 2000 };
		return {
			width: { min: 150, max: mapSize.width - 20 },
			height: { min: 150, max: mapSize.height - 20 },
		};
	}, [mapSize]);

	/** @param {Popup} val */
	function setPopup(val) {
		setAttributes({ popup: { ...popup, ...val } });
	}

	/** @param {Popup['dimensions']} val */
	function setDimensions(val) {
		setPopup({ dimensions: { ...popup.dimensions, ...val } });
	}

	/** @param {Popup['image']} val */
	function setImage(val) {
		setPopup({ image: { ...popup.image, ...val } });
	}

	/** @param {Popup['title']} val */
	function setTitle(val) {
		setPopup({ title: { ...popup.title, ...val } });
	}

	/** @param {Popup['meta']} val */
	function setMeta(val) {
		setPopup({ meta: { ...popup.meta, ...val } });
	}

	/** @param {Popup['excerpt']} val */
	function setExcerpt(val) {
		setPopup({ excerpt: { ...popup.excerpt, ...val } });
	}

	return (
		<PanelBody
			title={__('Marker Popup', 'flare-imc')}
			initialOpen={false}
			className={cls.panel}
		>
			<BaseControl label={__('Maximum Height')} id="flare-popup-height">
				<RangeControl
					value={popup.dimensions.height}
					onChange={(val) => setDimensions({ height: val })}
					{...sizeLimits.height}
				/>
			</BaseControl>
			<BaseControl label={__('Maximum Width')} id="flare-popup-width">
				<RangeControl
					value={popup.dimensions.width}
					onChange={(val) => setDimensions({ width: val })}
					{...sizeLimits.width}
				/>
			</BaseControl>
			<BoxControl
				label={__('Text margins', 'flare-imc')}
				values={popup.margins}
				onChange={(val) => setPopup({ margins: val })}
			/>
			<CheckboxControl
				label={__('Open post in new tab', 'flare-imc')}
				checked={popup.blankTarget}
				onChange={(val) => setPopup({ blankTarget: val })}
				__nextHasNoMarginBottom
			/>
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
					<div className={cls.imageRatio}>
						<NumberControl
							value={popup.image.width}
							onChange={(val) => setImage({ width: val })}
						/>
						<span>/</span>
						<NumberControl
							value={popup.image.height}
							onChange={(val) => setImage({ height: val })}
						/>
						<Button
							variant="secondary"
							isDestructive
							size="compact"
							text={__('Clear')}
							onClick={() =>
								setImage({ height: null, width: null })
							}
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
				<BaseControl
					label={__('Tag')}
					id="imc-header-tag-selector"
					__nextHasNoMarginBottom
				>
					<ButtonGroup>
						{['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((heading) => (
							<Button
								key={heading}
								variant={
									heading === popup.title.tag && 'primary'
								}
								onClick={() => setTitle({ tag: heading })}
							>
								{heading.toUpperCase()}
							</Button>
						))}
					</ButtonGroup>
				</BaseControl>
			)}
			<ToggleControl
				label={__('Display metadata', 'flare-imc')}
				className={cls.include}
				checked={popup.meta.show}
				onChange={(val) => setMeta({ show: val })}
				__nextHasNoMarginBottom
			/>
			{popup.meta.show && (
				<div className={cls.columns}>
					<UnitControl
						label={__('Font Size')}
						value={popup.meta.size}
						onChange={(val) => setMeta({ size: val })}
					/>
					<UnitControl
						label={__('Top Margin')}
						value={popup.meta.marginTop}
						onChange={(val) => setMeta({ marginTop: val })}
					/>
				</div>
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
					<div className={cls.columns}>
						<UnitControl
							label={__('Top Margin')}
							value={popup.excerpt.marginTop}
							onChange={(val) => setExcerpt({ marginTop: val })}
						/>
					</div>
				</>
			)}
		</PanelBody>
	);
}
