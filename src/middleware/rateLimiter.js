import rateLimit from "express-rate-limit";

// Global limiter (applies to all routes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // overall requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// Strict limiter for write-heavy routes (sessions, etc.)
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // tighter limit
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many actions. Slow down." },

  // per-user limiting
  keyGenerator: (req) => {
    return req.dbUser?.id || req.ip;
  },
});