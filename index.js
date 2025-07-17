const MegaverseCreator = require('./src/MegaverseCreator');
const Logger = require('./src/utils/Logger');
const { LOGGING } = require('./config');

async function main() {
  const creator = new MegaverseCreator();
  const logger = new Logger(LOGGING.LEVEL);
  const phase = process.argv[2];

  try {
    logger.info('🚀 Starting Megaverse Challenge');

    if (phase === 'phase2') {
      logger.info('Phase 2: Building Crossmint logo from goal map');
      await creator.buildFromGoalMap();
      logger.info('✅ Phase 2 completed successfully!');
    } else {
      logger.info('Phase 1: Creating POLYanet X-shape');
      await creator.createPolyanetX();
      logger.info('✅ Phase 1 completed successfully!');
    }

    logger.info('🎉 All operations completed successfully!');
  } catch (error) {
    logger.error('❌ Fatal error during execution', {
      error: error.message,
      stack: error.stack,
      phase: phase || 'phase1',
    });

    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  const logger = new Logger(LOGGING.LEVEL);
  logger.error('Unhandled Promise Rejection', { reason, promise });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  const logger = new Logger(LOGGING.LEVEL);
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

main();
