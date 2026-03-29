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
      "SELECT api_key FROM api_keys WHERE api_key = ?",
      [apiKey]
    );

    if (rows.length === 0) {
      return reply.status(401).send({
        error: "Invalid API key",
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