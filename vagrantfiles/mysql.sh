#!/bin/bash
rm -rf /etc/mysql/mysql.conf.d/mysqld.cnf
ln -sf /vagrant/vagrantfiles/mysqld.cnf /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql