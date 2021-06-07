<p align="center">
  <img src='https://www.moderncloud.io/assets/img/logo.png' width='40%'>
</p>

---

[ModernCloud](https://www.moderncloud.io) is a browser-based serverless platform that lets developers build functions and endpoints in minutes.

Our long term vision is to build a holistic, easy-to-use interface for building cloud applications, end-to-end.

AWS and Lambdas are just the start.

## Motivation

Advancements in cloud solutions have been fascinating in recent years. There are now many tools under our belt, and we can build sophisticated and resilient systems way easier than before. However, there's still a long way to go. We are still dealing with an incredible amount of overhead when building our solutions: setting up local dev environments, challenges of integrating different solutions, searching code snippets that work, and dealing with terrible interfaces that cloud providers provide us. ModernCloud aims to provide a browser-based interface that eliminates these overheads and provides a batteries-included platform that lets you focus on the stuff that matters.

## Highlights

<p align="center">
  <img src='https://www.moderncloud.io/assets/img/image4.png?v=2' width='80%'>
</p>

- Browser-based interface, no need to set up a local dev environment
- An inline vs-code editor with auto-complete support
- Easily navigate your endpoints and functions in one place
- Observability: dashboards and alerts for your functions and endpoint
- Terraform based configuration, no custom layer
- Github integration (coming soon)

## How to try?

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

## How can I contribute?

There are multiple ways you can contribute. First, we value your ideas. Please share them on our [community page](https://github.com/ModernCloud/moderncloud/discussions). If you see any problem with the product, simply create an issue.

If you want to go a step further, clone the repo, try and test the product and feel free to create a PR to make the product a bit better.

If you want to reach us directly, shoot an email: contact@moderncloud.io

Thanks for helping us out!
