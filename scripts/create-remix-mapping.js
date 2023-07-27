const { readFileSync, writeFileSync } = require( 'fs' );
const JsonCSS = require( 'json-css' );
const { exit } = require( 'process' );

// Filename to write result to must be provided as argument in the console.
if ( ! process.argv[ 2 ] ) {
	// eslint-disable-next-line no-console
	console.error( 'Please provide a path to write the mapping json to.' );
	exit();
}

// Ge tthe remixicon css file and convert it to an object
const css = readFileSync(
	require.resolve( 'remixicon/fonts/remixicon.css' ),
	'utf-8'
);
const jsonCSS = new JsonCSS();
const styles = jsonCSS.toJSON( css );

// Extract the icon class names and their unicode characacter id from the styles.
const codes = {};
for ( const style in styles ) {
	if ( style.match( /^\.ri-.*:before$/ ) ) {
		const key = style.substring( 1 ).replace( ':before', '' );
		codes[ key ] = styles[ style ].content.substring( 1 );
	}
}

// Write the result to the file with the provided name.
writeFileSync( process.argv[ 2 ], JSON.stringify( codes ) );
