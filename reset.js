const MegaverseCreator = require('./src/MegaverseCreator');
const Logger = require('./src/utils/Logger');
const { LOGGING } = require('./config');

async function reset() {
  const creator = new MegaverseCreator();
  const logger = new Logger(LOGGING.LEVEL);

  try {
    logger.info('🗑️ Starting comprehensive megaverse map reset');
    await creator.clearAll();
    logger.info('✅ Comprehensive map reset completed successfully!');
  } catch (error) {
    logger.error('❌ Error during reset', {
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
}

reset();
