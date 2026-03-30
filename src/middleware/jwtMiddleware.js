const { verifyToken } = require("../utils/jwt");

async function jwtMiddleware(request, reply) {
  try {
    const authHeader = request.headers["authorization"];

    if (!authHeader) {
      return reply.status(401).send({
        error: "JWT token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    // attach user info
    request.user = decoded;
    

  } catch (err) {
    return reply.status(401).send({
      error: "Invalid or expired token",
    });
  }
}

module.exports = jwtMiddleware;