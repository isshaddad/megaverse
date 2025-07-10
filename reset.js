const MegaverseCreator = require('./src/MegaverseCreator');

async function reset() {
  const creator = new MegaverseCreator();

  try {
    console.log('🗑️ Resetting megaverse map...');
    await creator.clearPolyanets();
    console.log('✅ Map reset completed!');
  } catch (error) {
    console.error('❌ Error during reset:', error.message);
    process.exit(1);
  }
}

reset();
