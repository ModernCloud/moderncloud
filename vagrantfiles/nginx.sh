#!/bin/bash
rm -rf /etc/nginx/conf.d/default.conf
ln -sf /vagrant/vagrantfiles/vhost.conf /etc/nginx/conf.d/default.conf
service nginx restart