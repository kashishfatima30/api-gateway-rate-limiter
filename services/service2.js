const fastify = require("fastify")();

fastify.get("/", async () => {
  return { service: "Service 2", message: "Hello from Service 2" };
});

fastify.listen({ port: 4002, host: "0.0.0.0" }, () => {
  console.log("Service2 running on 4002");
});