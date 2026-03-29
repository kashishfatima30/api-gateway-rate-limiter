module.exports = async function (fastify) {
  fastify.register(require("@fastify/http-proxy"), {
    upstream: "http://localhost:3001",
    prefix: "/service1",
  });

  fastify.register(require("@fastify/http-proxy"), {
    upstream: "http://localhost:3002",
    prefix: "/service2",
  });
};