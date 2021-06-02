# Motivation

# How to try?

Please create your own environment files with the following commands. These environment files work with our Vagrantfile. You can edit these files if you are planning to use on different system.

```bash
$ cp Vagrantfile.sample Vagrantfile
$ cp backend/env.sample backend/.env
$ cp language-proxy-server/env.sample language-proxy-server/.env
$ vagrant up
```

**Modern Cloud** is ready! :tada: You can access to the **Modern Cloud Console** via http://127.0.0.1:8080

# How to develop?

If you want to make some changes on the project, please use **vagrantfiles/ecosystem_dev.json** for development. You can change this setting in Vagrantfile.

```ruby
config.vm.provision "pm2", after: "mysql", type: "shell", inline: "pm2 startOrReload /vagrant/vagrantfiles/ecosystem_dev.json", run: "always", privileged: true
```

Development server port is 8081. Please use http://127.0.0.1:8081 to access the **Modern Cloud Console**. It takes time because of frontend files. 