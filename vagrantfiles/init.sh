#!/bin/bash
echo "----> Backend: Installing dependencies"
npm install --prefix /vagrant/backend

echo "----> Language Server Proxy: Installing dependencies"
npm install --prefix /vagrant/language-server-proxy

echo "----> Database: Create tables"
mysql -uroot -e "CREATE USER 'moderncloud'@'%' IDENTIFIED WITH mysql_native_password BY 'password';"
mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO 'moderncloud'@'%' WITH GRANT OPTION;FLUSH PRIVILEGES;"
mysql -uroot -e 'CREATE DATABASE moderncloud;'
mysql -uroot moderncloud < /vagrant/backend/migration/000000000.sql

echo "----> Modern Cloud is ready! https://moderncloud.io"