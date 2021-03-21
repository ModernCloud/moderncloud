Backend

```bash
$ cp backend/env.sample backend/.env
$ cp docker-compose.yml.sample docker-compose.yml
$ docker run --rm -it --workdir /data -v ${PWD}/backend:/data node:14.16.0-alpine3.10 npm install
$ docker-compose up -d
$ docker-compose logs -f 
```

Frontend

```bash
$ cd frontend
$ npm install
$ npm run serve
```