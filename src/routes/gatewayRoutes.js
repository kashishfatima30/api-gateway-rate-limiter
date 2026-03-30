const rateLimiter = require("../middleware/rateLimiter");
const authMiddleware = require("../middleware/authMiddleware");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const proxyRoutes = require("../services/proxyService");
const { generateToken } = require("../utils/jwt");
const crypto = require("crypto");
const pool = require("../config/db");

async function routes(fastify) {

  
  fastify.post("/login", async (request, reply) => {
  
  const { username } = request.body;

  if (!username) {
    return reply.status(400).send({ error: "Username required" });
  }

  

  try {
   
    const [users] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    let userId;

    if (users.length === 0) {
     
      const [result] = await pool.query(
        "INSERT INTO users (username) VALUES (?)",
        [username]
      );
      userId = result.insertId;
    } else {
      userId = users[0].id;
    }
    const token = generateToken({ id: userId});

    
    const [keys] = await pool.query(
      "SELECT api_key FROM api_keys WHERE user_id = ?",
      [userId]
    );

    let apiKey;

    if (keys.length > 0) {     
      apiKey = keys[0].api_key;
    } else {
      apiKey = crypto.randomBytes(32).toString("hex");

      await pool.query(
        "INSERT INTO api_keys (api_key, tier, user_id) VALUES (?, ?, ?)",
        [apiKey, "free-user", userId]
      );
    }

    return reply.send({
      token,
      apiKey,
    });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Internal server error" });
  }
});

  fastify.register(async function (protectedRoutes) {

    protectedRoutes.addHook("preHandler", jwtMiddleware);
    protectedRoutes.addHook("preHandler", authMiddleware);
    protectedRoutes.addHook("preHandler", rateLimiter);

    await proxyRoutes(protectedRoutes);

  }, { prefix: "/api" });  

}

module.exports = routes;