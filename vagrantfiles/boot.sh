#!/bin/bash
echo "----> Settings"
export DEBIAN_FRONTEND=noninteractive

echo "----> Install Packages"
apt-get update
apt-get install -y nginx rabbitmq-server docker.io unzip git python gcc g++ python-dev

echo "----> NodeJS"
curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source /root/.nvm/nvm.sh
nvm install --no-progress 14.16.0
ln -sf /root/.nvm/versions/node/v14.16.0/bin/node /usr/local/bin/node
ln -sf /root/.nvm/versions/node/v14.16.0/bin/npm /usr/local/bin/npm
npm install -g pm2
ln -sf /root/.nvm/versions/node/v14.16.0/bin/pm2 /usr/local/bin/pm2
npm config set package-lock false

echo "----> Terraform"
wget -q https://releases.hashicorp.com/terraform/0.14.8/terraform_0.14.8_linux_amd64.zip
unzip terraform_0.14.8_linux_amd64.zip
rm -f terraform_0.14.8_linux_amd64.zip
mv terraform /usr/bin/terraform
chmod +x /usr/bin/terraform

echo "----> MySQL"
apt-get install -y mysql-server mysql-client

echo "----> Services"
usermod -aG docker vagrant
systemctl enable --now docker
systemctl enable --now mysql
systemctl enable --now rabbitmq-server
systemctl enable --now nginx

echo "----> Docker images"
# TODO: use hub.docker.com
cd /
git clone https://github.com/ModernCloud/typescript-language-server.git
cd /typescript-language-server/
sh build.sh
cd /
git clone https://github.com/ModernCloud/python-language-server.git
cd /python-language-server
sh build.sh
cd /
rm -rf /typescript-language-server
rm -rf /python-language-server

echo "----> Modern Cloud is ready! https://moderncloud.io"