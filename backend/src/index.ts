import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { healthCheck as rustHealth } from './services/rust.client';

const startServer = async () => {
  // Wait for Rust service to be ready
  let rustReady = false;
  for (let i = 0; i < 10; i++) {
    const ok = await rustHealth();
    if (ok) {
      rustReady = true;
      break;
    }
    logger.info('Waiting for Rust service...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  if (!rustReady) {
    logger.error('Rust service not available, exiting');
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
