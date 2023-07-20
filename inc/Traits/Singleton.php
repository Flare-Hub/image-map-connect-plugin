<?php

namespace Flare\ImageMap\Traits;

/**
 * Singleton trait to implements Singleton pattern in any classes where this trait is used.
 */
trait Singleton {

	/** @var stdClass The single instance of the class */
	protected static $instance;

	/**
	 * Protected class constructor to prevent direct object creation.
	 */
	protected function __construct() { }

	/**
	 * Prevent object cloning
	 */
	final protected function __clone() { }

	/**
	 * To return new or existing Singleton instance of the class from which it is called.
	 * As it sets to final it can't be overridden.
	 *
	 * @param array ...$params the parameters to construct the instance with.
	 * @return object Singleton instance of the class.
	 */
	final public static function get_instance( ...$params ) {
		if ( ! self::$instance ) {
			$called_class   = get_called_class();
			self::$instance = new $called_class( ...$params );
		}

		return self::$instance;
	}
}
