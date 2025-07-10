const MegaverseCreator = require('./src/MegaverseCreator');

async function main() {
  const creator = new MegaverseCreator();
  const phase = process.argv[2];

  try {
    if (phase === 'phase2') {
      console.log('🚀 Starting Phase 2: Building from goal map...');
      await creator.buildFromGoalMap();
      console.log('✅ Phase 2 completed successfully!');
    } else {
      console.log('🚀 Starting Phase 1: Creating POLYanet X-shape...');
      await creator.createPolyanetX();
      console.log('✅ Phase 1 completed successfully!');
    }
  } catch (error) {
    console.error('❌ Error during execution:', error.message);
    process.exit(1);
  }
}

main();
