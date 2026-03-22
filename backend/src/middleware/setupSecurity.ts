import { type Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';

export const setupSecurity = (app: Express) => {
  // 1. HTTP Headers (Security Best Practices)
  // Sets various HTTP headers to prevent common attacks like Clickjacking, XSS, etc.
  app.use(helmet());

  // 5. HTTP Parameter Pollution (HPP)
  // Prevents multiple parameters with the same name (e.g., ?user=1&user=2)
  app.use(hpp());
};
