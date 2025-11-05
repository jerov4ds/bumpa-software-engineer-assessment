#!/bin/bash
set -e

cd /var/www/html

# install composer deps if vendor not present
if [ ! -d "vendor" ]; then
  composer install --no-interaction --prefer-dist
fi

# Ensure storage perms
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true

# run php-fpm
php-fpm
