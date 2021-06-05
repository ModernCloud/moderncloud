# Motivation

# How to try?

We are using [Vagrant](https://www.vagrantup.com/intro) for development. Please check the [installation](https://learn.hashicorp.com/tutorials/vagrant/getting-started-install?in=vagrant/getting-started) page before you start.

Please create your own environment files with the following commands. These environment files work out-of-the-box with our Vagrantfile. You can edit these files if you are planning to use on different system.

```bash
$ cp Vagrantfile.sample Vagrantfile
$ cp backend/env.sample backend/.env
$ cp language-proxy-server/env.sample language-proxy-server/.env
$ vagrant up
```

**Modern Cloud** is ready! :tada: You can access to the **Modern Cloud Console** via http://127.0.0.1:8080

## Development

### Backend

If you want to make some changes on the project, please use **vagrantfiles/ecosystem_dev.json** for development. You can change this setting in Vagrantfile.

```ruby
config.vm.provision "pm2", after: "migration", type: "shell", inline: "pm2-dev start /vagrant/vagrantfiles/ecosystem_dev.json >/dev/null 2>&1", run: "always", privileged: true
```

### Frontend

Development server port is 8081. Please use http://127.0.0.1:8081 to access the **Modern Cloud Console**.

```bash
$ cd frontend
$ npm install
$ npm run serve
``` 