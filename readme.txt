=== Image Map Connect - Display Posts as Image Hotspots ===
Contributors: dutchigor, daniela2017
Tags: Image map, Interactive image, Indoor map, Image hotspot, Floor plan, Custom map, Stylized map, Event map, Infographic, Map markers, Map filters, Dynamic map
Requires at least: 6.2
Tested up to: 6.4
Stable tag: 1.0.2
Requires PHP: 7.2
License: GPL-3.0-or-later
Add any image to your WordPress posts, pages, or archives and make it interactive: display your existing and new posts as markers.




== Description ==

## What is Image Map Connect Plugin? ##

Image Map Connect allows you to add any image to your WordPress website and make it an interactive image map. On the image map you can:

1. Display your existing and/or new posts as markers, including custom post types
2. Show post details in a popup
3. Filter markers
4. Switch between layers
5. Zoom in and out
6. Use block settings to visually configure the plugin

The plugin uses built-in WordPress features where possible, for example it extends the current posts and makes use of the default blocks like the query block.



## What Can You Use the Plugin for? ##

Among other things, you can use the plugin provide an interactive

- **Indoor maps** (e.g. for campus facilities, grocery stores, hotels, conferences, museums, and exhibitions)
- **Simplified or stylised outdoor maps** (e.g. for events, routes, towns and villages)
- **Infographics** to introduce a complex concept (e.g. technical frameworks)
- **Technical drawings** to provide context
- **Product images** with highlighted product features



## Key Features ##

- Create unlimited amount of image maps, layers, and markers
- Embed the image map in block theme templates
- Add the image map to block-based widget area in classic themes
- Embed the image map in any pages or (custom) posts
- Display your existing and new posts as markers, including custom post types
- Show post details in a popup
- Define image map center, height and zoom level
- Modify marker and popup styling
- Filter markers based on query loop or archive
- Add multiple layers
- The image map is responsive



## Help and Support ##

You can contact us in two ways at the moment:

- If you have any questions, you can send an email to [info@flarehub.io](mailto:info@flarehub.io)
- If you find a bug or have a feature request, you can send an email or report an issue in our [Github repository](https://github.com/Flare-Hub/image-map-connect-plugin/issues). Please just make sure to search the existing issues and only report new ones.




== Frequently Asked Questions ==

=What is an image map?=

Image map is an image with clickable areas that can be used e.g. to navigate to different pages of the same website.


=Can I add an image map to an archive page?=

Yes. In a block theme, you can include the image map in the archive template. If you embed it in the query loop block, only markers for the posts in the archive will be displayed on the image map.

In a classic theme, you can add it to the widget area. Any widgets on an archive page will automatically only show markers for the posts in the archive.


=Can I make the image map style compatible with my theme?=

Yes. The image map size, borders and background color are configurable. The popup text styling is taken from your theme by default and you can further modify the style to align with your theme.




== Screenshots ==

1. Example of image map in action
2. Process to set up the plugin
3. Plugin Admin Page / Maps Tab
4. Plugin Admin Page / Layers Tab
5. Plugin Admin Page / Markers Tab - type: Posts
6. Plugin Admin Page / Markers Tab - type: Standalone marker
7. Block / Styling
8. Block / Settings




== Installation ==

## Install Image Map Connect within WordPress ##

1. Visit the plugins page within your dashboard and select ‘Add New’
2. Search for ‘Image Map Connect’
3. Activate the Image Map Connect plugin from your Plugins page
4. See the section ‘After activation’ below.


## Install Image Map Connect manually ##

1. Upload the ‘image-map-connect’ folder to the /wp-content/plugins/ directory
2. Activate the Image Map Connect plugin from your Plugins page
3. See the section ‘After activation’ below.


## After activation ##

1. Click 'Image Maps' in WordPress sidebar menu
2. You can find more instructions on the 'Info' tab
3. Set up the plugin for your site by creating a map and adding layer(s) and markers. Tooltips included in the Maps/Layers/Markers tabs help you when filling in the details.
4. Add Image Map Connect block to your page or template.




== Development ==

## Source Code

The code can be found on [Github](https://github.com/Flare-Hub/image-map-connect-plugin)


## Development environment setup ##

This plugin makes use of both Node and Composer as development tools. For this reason, ensure both are installed and execute the following commands after cloning the project:
- `npm install`
- `composer install`

The javascript for this plugin is built with the [wordpress scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/) package, which requires the javascript to be built. To build the corresponding assets, run one of the following:
- `npm run build` to execute wp-scripts build with the correct configuration
- `npm run watch` to execute wp-scripts start with the correct configuration

There is also a Docker configuration included to aid the development. If you wish to use this, make sure docker in installed and run `npm run start` to:
- Start the docker containers
- Execute wp-scripts start
- Start browser sync to refresh the browser on code updates


## Folder structure ##

This is a brief description of the folder structure used in this plugin.

### .vscode ###
plugin recommendations, settings and debug configuration for VS Code.

### app ###
The javascript source code.

### docker ###
The docker configuration and setup files.

### inc ###
The php classes and helper files.

### releases ###
The files to send to the wordpress plugin library.

### scripts ###
javascript development scripts

### root ###
The root folder contains all the necessary configuration files for all the development tools used in this plugin:
- Git
- ESLint
- Browsersync
- Composer
- NPM
- Webpack


## Dependencies ##

This plugin makes use of multiple independent open source packages, both from NPM and from Packagist. You can find a list of all the projects we have the pleasure of including on this plugin in the composer.json and package.json files. For a more comprehensive list, including all the packages that these packages use, see composer.lock and package-lock.json.




== Changelog ==

= 1.0.1 =
* Fixed Fixed: missing sanitization of REST API field updates.
