import { type Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { slowDown } from 'express-slow-down';
import { rateLimit } from 'express-rate-limit';

export const setupSecurity = (app: Express) => {
  // 1. HTTP Headers (Security Best Practices)
  // Sets various HTTP headers to prevent common attacks like Clickjacking, XSS, etc.
  app.use(helmet());

  // 2. HTTP Parameter Pollution (HPP)
  // Prevents multiple parameters with the same name (e.g., ?user=1&user=2)
  app.use(hpp());

  // 3. Slow Down
  // Slows down responses for repeated requests from the same IP to mitigate brute-force attacks
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Start slowing down after 50 requests
    delayMs: (hits) => hits * 100, // Increase delay by 100ms for each request after the threshold
  });

  // 4. Rate Limiting
  // Limits the number of requests from a single IP to prevent brute-force attacks
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: {
      status: 429,
      message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: 'draft-8', // Use the latest standard for rate limit headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet: 56, // Treats IPv6 addresses as /56 subnets to prevent abuse from large IPv6 blocks
  });

  app.use(speedLimiter, limiter);
};
