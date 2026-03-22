import { type Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

export const setupSecurity = (app: Express) => {
  // 1. HTTP Headers (Security Best Practices)
  // Sets various HTTP headers to prevent common attacks like Clickjacking, XSS, etc.
  app.use(helmet());

  // 2. HTTP Parameter Pollution (HPP)
  // Prevents multiple parameters with the same name (e.g., ?user=1&user=2)
  app.use(hpp());

  // 3. Rate Limiting
  // Limits the number of requests from a single IP to prevent brute-force attacks
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Each IP is limited to 100 requests per 15 mins
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(limiter);
};
