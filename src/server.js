require("dotenv").config();

const fastify = require("fastify")({
  logger: true
});

const routes = require("./routes/gatewayRoutes");

async function start() {
  try {
    await fastify.register(routes);
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("API Gateway running on port 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();