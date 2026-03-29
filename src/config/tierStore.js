const redis = require("./redis");
const db = require("./db");

const CACHE_TTL = 60;        
const REDIS_TTL = 3600;    
const DEFAULT_TIER = "free-user";

const cache = new Map();

function now() {
  return Math.floor(Date.now() / 1000);
}

async function getTier(apiKey) {
  process.stdout.write("\n [getTier] CALLED\n");

  if (!apiKey) {
    process.stdout.write(" [CACHE] No API key → default tier\n");
    return DEFAULT_TIER;
  }

  //  MEMORY CACHE
  const cached = cache.get(apiKey);
  if (cached && cached.expiresAt > now()) {
    process.stdout.write("[CACHE] MEMORY HIT\n");
    return cached.tier;
  }

  try {
    // REDIS CACHE
    const redisTier = await redis.get(`api_tier:${apiKey}`);
    if (redisTier) {
      process.stdout.write("⚡ [CACHE] REDIS HIT\n");

      cache.set(apiKey, {
        tier: redisTier,
        expiresAt: now() + CACHE_TTL,
      });

      return redisTier;
    }

    // DATABASE
    process.stdout.write("🚨 [CACHE] DB HIT\n");

    const [rows] = await db.execute(
      "SELECT tier FROM api_keys WHERE api_key = ?",
      [apiKey]
    );

    const tier = rows.length ? rows[0].tier : DEFAULT_TIER;

    await redis.set(`api_tier:${apiKey}`, tier, "EX", REDIS_TTL);


    cache.set(apiKey, {
      tier,
      expiresAt: now() + CACHE_TTL,
    });

    return tier;

  } catch (err) {
    process.stdout.write("[CACHE] ERROR\n");
    console.error(err);
    return DEFAULT_TIER;
  }
}

module.exports = { getTier };


