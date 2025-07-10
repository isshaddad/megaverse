const MegaverseCreator = require('./src/MegaverseCreator');

async function main() {
  const creator = new MegaverseCreator();

  try {
    console.log('🚀 Starting Phase 1: Creating POLYanet X-shape...');
    await creator.createPolyanetX();
    console.log('✅ Phase 1 completed successfully!');
  } catch (error) {
    console.error('❌ Error during execution:', error.message);
    process.exit(1);
  }
}

main();
