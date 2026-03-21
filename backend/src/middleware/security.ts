import helmet from 'helmet';
import { type Express } from 'express';

export const setupSecurity = (app: Express) => {
  app.use(helmet());
};
