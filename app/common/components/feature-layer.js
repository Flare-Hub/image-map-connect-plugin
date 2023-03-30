/**
 * For future reference when swapping from overlays to features for markers.
 * This uses the glyphs object from remix which contains html escaped characters.
 * This json is currently not included in the remix build,
 * so a better option might be to convert the remix css to a js object
 * and get the character from the content in each class.
 */

import { Style, Text } from "ol/style.js";
import glyphs from "./glyphs.json";

/** Convert html escaped character to unicode character. */
function htmlDecode(input) {
	var doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
}

// Create icon using remix font and glyphs escaped character.
const iconStyle = new Style({
	text: new Text({
		font: "24px remixicon",
		text: htmlDecode(glyphs["account-pin-circle-fill"].unicode),
	})
});
