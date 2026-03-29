require("dotenv").config();
const fs = require("fs");
const fastify = require("fastify")({
  logger: true,
  https: {
    key: fs.readFileSync("./server.key"),
    cert: fs.readFileSync("./server.cert"),
  },
});

const routes = require("./routes/gatewayRoutes");

async function start() {
  try {
    await fastify.register(routes);
    await fastify.listen({ port: 3000 });
    console.log("HTTPS API Gateway running on port 3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();