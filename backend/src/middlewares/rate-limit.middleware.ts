import { slowDown } from 'express-slow-down';
import { rateLimit } from 'express-rate-limit';
import { config } from '#/config/config.js';

const { windowMs, maxRequests } = config.security.rateLimit;

export const speedLimiter = slowDown({
  windowMs: windowMs,
  delayAfter: Math.floor(maxRequests / 2), // Start slowing down after half the max requests
  delayMs: (hits) => hits * 100, // Increase delay by 100ms for each request after the threshold
});

export const generalLimiter = rateLimit({
  windowMs,
  limit: maxRequests,
  message: {
    status: 429,
    message: 'Too many requests, try again later.',
  },
  standardHeaders: 'draft-8', // Use the latest standard for rate limit headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  ipv6Subnet: 56, // Treats IPv6 addresses as /56 subnets to prevent abuse from large IPv6 blocks
});

// Separate limiter for auth routes to allow fewer attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Allow only 5 attempts per 15 minutes
  message: {
    status: 429,
    message: 'Too many login attempts.',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});
