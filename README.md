Backend

```bash
$ cd backend/
$ npm install --exact
$ cp env.sample .env
$ cd ..
$ cp docker-compose.yml.sample docker-compose.yml
$ docker-compose up -d
$ docker-compose logs --tail=20 -f 
```

Frontend

```bash
$ cd frontend
$ npm install
$ npm run serve
```