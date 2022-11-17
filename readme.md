# Setup

1. Install recommended plugins
1. Update variables in docker.env
1. Update plugin header in your-plugin.php
1. Rename your-plugin, YourPlugin and YourOrg
	* Recommend to use vscode search-replace.
	* Located in:
		* Composer.json: org, plugin, namespace
		* your-plugin.php: comments
		* Plugin name constant in plugin.php
		* Namespace in all php files
		* text domain in
			* phpcs.xml.dist
			* Dummy.php
1. Run composer install
1. Run npm install

# Usage

1. npm run start
1. Reuse or remove Dummy class
	* Hooked in to admin_menu method in Plugin
1. Reuse or remove dummy-menu app
	* Inserted into admin menu in the Dummy class

# Structure
1. Wordpress runs in docker, react is built locally.
1. OOP design
	 * When object needs to be hooked in to wordpress
		 * Instantiate object in loader and add hook there
1. React included
	 * use ReactApp class to add react app divs, scripts and styles.
	 * Create a new react app by adding a folder to the app folder and including an index.(js, jsx, ts or tsx) file
	   * Requires restart of wp-scripts (included in start script)
