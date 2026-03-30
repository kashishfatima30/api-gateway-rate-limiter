const redis = require("../config/redis");
const fs = require("fs");
const path = require("path");
const { getTier } = require("../config/tierStore");

const luaScript = fs.readFileSync(
  path.join(__dirname, "../utils/tokenBucket.lua"),
  "utf8"
);


const tiers = {
  "free-user": { capacity: 50, refillRate: 5 },
  "premium-user": { capacity: 200, refillRate: 20 },
};

async function rateLimiter(request, reply) {
  try {
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      return reply.status(401).send({ error: "API key required" });
    }

    
    const tier = await getTier(apiKey);

    if (!tier) {
      return reply.status(403).send({ error: "Invalid API key" });
    }

   
    const { capacity, refillRate } = tiers[tier] || tiers["free-user"];
    console.log("Tier:", tier, "Capacity:", capacity, "Refill:", refillRate);

    
    const key = `rate_limit:${apiKey}`;

    const [allowed, remaining] = await redis.eval(
      luaScript,
      1,
      key,
      capacity,
      refillRate,
      Math.floor(Date.now() / 1000)
    );
    reply.header("X-RateLimit-Remaining", remaining);
    reply.header("X-RateLimit-Limit", capacity);

       
    if (!allowed) {
      return reply.status(429).send({
        error: "Rate limit exceeded",
        tier,
      });
    }

  } catch (err) {
    console.error("Rate limiter failed, allowing request:", err);
    return;
  }
}

module.exports = rateLimiter;