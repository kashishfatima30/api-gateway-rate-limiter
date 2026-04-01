const fastify = require("fastify")();

fastify.get("/", async () => {
  return { service: "Service 1", message: "Hello from Service 1" };
});

fastify.listen({ port: 4001, host: "0.0.0.0" }, () => {
  console.log("Service1 running on 4001");
});