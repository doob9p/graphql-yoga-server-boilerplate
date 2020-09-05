# **🚀 GraphQL 서버 환경설정**

<br>
<br>
<br>

# 🏷 프로젝트 생성

```bash
mkdir [프로젝트 이름 / ex: server]
cd server
npm init -y
```

- 원하는 프로젝트 이름으로 폴더를 생성한다.
- 생성한 폴더로 들어가서 `npm init` 명령어와 `-y`, `-yes` 디폴트 값 설정 옵션의 커맨드를 실행시킨다.

<br>
<br>
<br>

# 🏷 babel 설정

## (1) 패키지 모듈 설치

```bash
npm install -D @babel/node @babel/core @babel/preset-env
```

- babel은 es6,7의 언어를 es5로 변환시켜주는 트랜스파일러이다.

<br>

## (2) .babelrc 파일 생성

```json
{
    "presets": ["@babel/preset-env"]
}
```

- 프로젝트 루트에 babel 패키지의 설정 파일인 .babelrc 파일을 생성한다.

<br>

## (3) package.json 파일 scripts 수정

```json
...
"scripts": {
    "dev": "nodemon src/index.js --exec babel-node"
},
...
```

<br>
<br>
<br>

# 🏷 GraphQL Yoga 설치

## (1) 설치

```bash
npm install graphql-yoga
```

<br>

## (2) src/index.js 생성

```jsx
import { GraphQLServer } from "graphql-yoga";

const port = process.env.PORT || 4000;

const typeDefs = `
type Query {
    hello: String!
}
`;

const resolvers = {
  Query: {
    hello: () => "Hello!!!!",
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start({ port }, () =>
  console.log(`Graphql Server Running on http://localhost:${port}`)
);
```

- 프로젝트 루트에 src 폴더 생성 후 그 안에 index.js를 생성한다.

<br>

## (3) 쿼리 실행

```json
{
  hello
}
```

```json
{
  "data": {
    "hello": "Hello!!!!"
  }
}
```

- [localhost:4000](http://localhost:4000) 에 접속하여 hello 쿼리를 실행해 본다.

<br>
<br>
<br>

# 🏷 GraphQL Query, Resolver를 한 폴더에서 관리

## (1) 모듈 설치

```bash
npm install graphql-tools merge-graphql-schemas
```

<br>

## (2) src/schema.js 생성

```jsx
import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';

const allTypes = fileLoader(path.join(__dirname, '/graphql/**/*.graphql'));
const allResolvers = fileLoader(path.join(__dirname, '/graphql/**/*.js'));

const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers),
});
```

- graphql 폴더내에 생성할 .js 파일은 리졸버로 .graphql 파일은 타입으로 모두 가져와 합쳐준다.

<br>

## (3) src/index.js 수정

```jsx
...

import schema from "./schema";

...

const server = new GraphQLServer({
  schema,
});

...
```

<br>

## (4) graphql/hello 생성

```graphql
// graphql/hello/hello.js 생성

export default {
  Query: {
    hello: () => "Hello!",
  },
};

// graphql/hello/hello.graphql 생성

type Query {
    hello: String!
}
```

<br>
<br>
<br>

# 🏷 env 설정

## (1) 모듈 설치

```bash
npm install dotenv
```

<br>

## (2) .env.development, .env.production

- 프로젝트 루트에 .env.development, .env.production 파일 생성

<br>

## (3) src/env.js 생성

```jsx
import dotenv from "dotenv";
import pathModule from "path";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: pathModule.resolve(__dirname, "../.env.production") });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: pathModule.resolve(__dirname, "../.env.development") });
} else {
  throw new Error("env 설정이 올바르지 않습니다.");
}
```

- package.json의 스트립트 커맨드에 따른 NODE_ENV 개발/운영 설정에 따라 .env 파일을 분기처리 해준다.

<br>
<br>
<br>

# 🏷 context 설정

- context: 모든 resolver 함수에 전달되며, 현재 로그인한 사용자, 데이터베이스 액세스와 같은 중요한 문맥 정보를 보유하는 값이다.

## (1) src/context.js 생성

```jsx
function context({ request }) {
  return {
    request,
  };
}

export default context;
```

<br>

## (2) src/index.js 수정

```jsx
...

import schema from "./schema";
import context from "./context";
...

const server = new GraphQLServer({
  schema,
	context
});

...
```

<br>
<br>
<br>

# 🏷 서버 옵션 설정

## (1) 모듈 설치

```bash
npm install graphql-disable-introspection
```

<br>

## (2) src/index.js 수정

```jsx
...

import NoIntrospection from "graphql-disable-introspection";

...

server.start(
  {
    port,
		debug: process.env.NODE_ENV === "development",
    validationRules:
      process.env.NODE_ENV === "development" ? null : [NoIntrospection],
		playground: process.env.NODE_ENV === "development" ? "/" : false,
  },
  () => console.log(`Graphql Server Running on http://localhost:${port}`)
);
```

- debug: 에러가 발생할 경우 추가적인 로깅을 해준다.
- validationRules: 기본적으로 인증되지 않은 사용자가 GrapQL 스키마를 분석할 수 있게 되는데 보안적인 측면에서 GraphQL introspection을 production 모드에서 제한한다.
- playground: production 모드에서 보이지 않게 해준다.

<br>
<br>
<br>

# 🏷 docker-compose로 mysql 실행

## (1) docker-compose.yml 파일 수정

```docker
version: "3"
services:
  mysql:
    image: mysql:5.7
    restart: "no"
    container_name: mysql-container # 컨테이너 이름 설정
    environment:
	    - MYSQL_ROOT_USER=root       # root 이름 설정
      - MYSQL_ROOT_PASSWORD=root   # root 비밀번호 설정
      - MYSQL_DATABASE=database    # 데이터베이스 스키마명 설정
      - MYSQL_USER=user            # user 이름 설정
      - MYSQL_PASSWORD=user        # user 비밀번호 설정
      - MYSQL_ROOT_HOST=%
    ports:
      - "3306:3306"     # 외부 포트: 컨테이너 내부 포트
    command:
      - "mysqld"
      - "--character-set-server=utf8mb4"
      - "--collation-server=utf8mb4_unicode_ci"
    volumes:
      - /Users/brook/mysql-container/name:/var/lib/mysql # mysql 데이터를 지정한 경로에 저장한다
```

<br>

## (2) docker-compose 커맨드로 컨테이너 실행

```docker
docker-compose up -d
```

- -d: 컨테이너를 백그라운드에서 실행하게 하는 옵션, 옵션을 주지 않으면 터미널 창을 닫을 때 Docker 컨테이너가 같이 종료된다.

<br>
<br>
<br>

# 🏷 prisma 설정

## (1) 모듈 설치

```bash
npm install -D @prisma/cli

npm install @prisma/client
```

<br>

## (2) prisma 초기설정

```bash
npx prisma init
```

- 위 커맨드 실행시 prisma 폴더가 생성된다.

<br>

## (3) prisma/.env 수정

```bash
DATABASE_URL="mysql://root:root@localhost:3306/database"
```

- `mysql`: 사용할 데이터베이스 명
- `root`: 데이터 베이스 유저명
- `root`: 데이터 베이스 유저 비밀번호
- `localhost`: 데이터 베이스 host
- `3306`: 포트
- `database`: 데이터 베이스 스키마명

<br>

## (4) prisma/schema.prisma 수정

```graphql
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

- provider를 mysql로 수정해준다

<br>

## (5) prisma.js 인스턴스 생성

```graphql
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error"],
});

export default prisma;
```

- src/prisma.js 생성한다.

<br>

## (6) package.json에 scripts를 수정해준다.

```graphql
...

"scripts": {
    "presync": "npx prisma migrate save --experimental",
    "sync": "npx prisma migrate up --experimental",
    "preprod": "npx prisma generate",
    "prod": "NODE_ENV=production nodemon src/index.js --exec babel-node",
    "predev": "npx prisma generate",
    "dev": "NODE_ENV=development nodemon src/index.js --exec babel-node"
  },

...
```

- `npx prisma migrate save --experimental`: prisma/schema.prisma 파일의 변경된 내용을 prisma/migrations 폴더에 저장한다.
- `npx prisma migrate up --experimental`:  prisma/migrations 폴더에 있는 마이그레이션 내역을 mysql 에 동기화 시켜준다.
- `npx prisma generate`: 변경된 prisma 내역을 읽어 node_modules에 있는 @prisma/client를 업데이트 해준다.