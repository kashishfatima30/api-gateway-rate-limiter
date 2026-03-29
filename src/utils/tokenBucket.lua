local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local current_time = tonumber(ARGV[3])

local data = redis.call("HMGET", key, "tokens", "last_refill")

local tokens = tonumber(data[1])
local last_refill = tonumber(data[2])

if tokens == nil then
    tokens = capacity
    last_refill = current_time
end

local delta = math.max(0, current_time - last_refill)
local refill = delta * refill_rate
tokens = math.min(capacity, tokens + refill)

local allowed = 0

if tokens >= 1 then
    tokens = tokens - 1
    allowed = 1
end

redis.call("HMSET", key,
    "tokens", tokens,
    "last_refill", current_time
)

redis.call("EXPIRE", key, 60)

return {allowed, tokens}