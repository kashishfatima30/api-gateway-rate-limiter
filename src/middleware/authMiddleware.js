const db = require("../config/db");

async function authMiddleware(request, reply) {
  try {
    const apiKey = request.headers["x-api-key"];

    
    if (!apiKey) {
      return reply.status(401).send({
        error: "API key required",
      });
    }
   
    const [rows] = await db.execute(
      "SELECT user_id FROM api_keys WHERE api_key = ?",
      [apiKey]
    );

    if (rows.length === 0) {
      return reply.status(401).send({
        error: "Invalid API key",
      });
    }
    console.log("JWT user:", request.user);
    console.log("API key owner:", rows[0].user_id);
    
    const apiKeyOwnerId = rows[0].user_id;

    if (request.user.id !== apiKeyOwnerId) {
      return reply.status(403).send({
        error: "API key does not belong to user",
      });
    }

  } catch (err) {
    console.error("Auth error:", err);
    return reply.status(500).send({
      error: "Internal server error",
    });
  }
}

module.exports = authMiddleware;