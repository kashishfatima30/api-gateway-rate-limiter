const fastify = require("fastify")();

fastify.get("/", async () => {
  return { service: "Service 2", message: "Hello from Service 2" };
});

fastify.listen({ port: 3002 }, () => {
  console.log("Service2 running on 3002");
});