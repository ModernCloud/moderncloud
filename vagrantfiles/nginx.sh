#!/bin/bash
rm -rf /etc/nginx/sites-enabled/default
ln -sf /vagrant/vagrantfiles/vhost.conf /etc/nginx/sites-enabled/default
systemctl restart nginx