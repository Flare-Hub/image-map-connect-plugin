FROM wordpress:php7.4

# Install WP-cli
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
	&& chmod +x wp-cli.phar \
	&& mv wp-cli.phar /usr/local/bin/wp

# Enable xdebug
RUN pecl install "xdebug" && docker-php-ext-enable xdebug

# Prepare installation script
RUN apt-get -q update && apt-get -qy install netcat
COPY wait-for.sh /usr/local/bin/wait-for
COPY wp-setup.sh /usr/local/bin/apache2-wpsetup
RUN chmod +x /usr/local/bin/apache2-wpsetup \
	&& chmod +rx /usr/local/bin/wait-for

# Change user
USER www-data
