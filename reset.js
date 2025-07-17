const MegaverseCreator = require('./src/MegaverseCreator');
const Logger = require('./src/utils/Logger');
const { LOGGING } = require('./config');

async function reset() {
  const creator = new MegaverseCreator();
  const logger = new Logger(LOGGING.LEVEL);

  try {
    logger.info('🔍 Reset script started');
    logger.info(`Arguments: ${process.argv.join(' ')}`);

    logger.info('🗑️ Starting sequential megaverse map reset');
    logger.info('About to call creator.clearAll()...');
    await creator.clearAll();
    logger.info('✅ Sequential map reset completed successfully!');
  } catch (error) {
    logger.error('❌ Error during reset', {
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
}

reset();
