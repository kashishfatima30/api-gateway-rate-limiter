module.exports = async function (fastify) {
  fastify.register(require("@fastify/http-proxy"), {
    upstream: "http://service1:4001",
    prefix: "/service1",
  });

  fastify.register(require("@fastify/http-proxy"), {
    upstream: "http://service2:4002",
    prefix: "/service2",
  });
};