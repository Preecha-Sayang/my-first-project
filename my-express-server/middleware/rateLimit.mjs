import rateLimit from 'express-rate-limit';

// ✅ General API Rate Limit: 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});


export const getRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // More lenient for GET requests
  standardHeaders: true,
  legacyHeaders: false,
});



export const commentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,

  message: 'You are commenting too frequently. Please slow down.',

  keyGenerator: (req) => `comment:user:${req.user.id}`,

  standardHeaders: true,
  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 5, // สมัครได้ 5 ครั้ง

  message: 'Too many registration attempts, please try again later.',

  standardHeaders: true,
  legacyHeaders: false,
});