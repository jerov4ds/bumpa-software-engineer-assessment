
FROM php:8.2-fpm

# system deps
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libonig-dev curl zip \
    && docker-php-ext-install pdo_pgsql zip bcmath

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install php-amqplib or ext if needed later - we'll rely on php library
WORKDIR /var/www/html

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

EXPOSE 9000
CMD ["docker-entrypoint"]
