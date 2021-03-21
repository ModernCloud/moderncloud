Backend

```bash
$ cp backend/env.sample backend/.env
$ cp docker-compose.yml.sample docker-compose.yml
$ docker-compose up -d
$ docker-compose logs -f 
```

Frontend

```bash
$ cd frontend
$ npm install
$ npm run serve
```