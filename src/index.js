import "./env";

import { GraphQLServer } from "graphql-yoga";
import NoIntrospection from "graphql-disable-introspection";
import morgan from "morgan";
import schema from "./schema";
import context from "./context";

const port = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context,
});

server.express.use(morgan("dev"));

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
