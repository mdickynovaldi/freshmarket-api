import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { apiReference } from "@scalar/hono-api-reference";

import { ProcessEnv } from "./env";
import { rootRoute } from "./routes/root";
import { productsRoute } from "./routes/products";

const app = new OpenAPIHono();

// Configure Middlewares
app.use("*", logger()).use("*", cors());

// Configure API Routes
const apiRoutes = app
  .basePath("/")
  .route("/", rootRoute)
  .route("/products", productsRoute);

apiRoutes
  .doc("/openapi.json", {
    openapi: "3.1.0",
    info: {
      title: "FreshMarket API",
      description: "FreshMarket products.",
      version: "v1",
    },
  })
  .get("/docs", apiReference({ spec: { url: "/openapi.json" } }))
  .get("/swagger", swaggerUI({ url: "/openapi.json" }))
  .onError((err, c) => {
    return c.json({ code: 500, status: "error", message: err.message }, 500);
  });

console.info(`🍊 FreshMarket Backend API

💽 DATABASE_URL: ${ProcessEnv.DATABASE_URL}
`);

export default app;

export type ApiRoutes = typeof apiRoutes;
