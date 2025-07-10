const MegaverseAPI = require('./MegaverseAPI');
const Polyanet = require('./Polyanet');

class MegaverseCreator {
  constructor() {
    this.api = new MegaverseAPI();
  }

  async createPolyanetX(size = 11) {
    const polyanets = this.generateXPattern(size);
    await this.createAstralObjects(polyanets);
  }

  generateXPattern(size) {
    const polyanets = [];
    const start = 2;
    const end = size - 3; // 8 for size 11

    for (let row = start; row <= end; row++) {
      for (let col = start; col <= end; col++) {
        const onPrimaryDiagonal = row === col;
        const onSecondaryDiagonal = row + col === size - 1;

        if (onPrimaryDiagonal || onSecondaryDiagonal) {
          polyanets.push(new Polyanet(row, col));
        }
      }
    }

    return polyanets;
  }

  async createAstralObjects(astralObjects) {
    for (const obj of astralObjects) {
      const { row, column } = obj.getPosition();
      await this.api.createPolyanet(row, column);
      await this.delay(1000); // 1 second delay between requests
    }
    console.log(`🌌 Created ${astralObjects.length} astral objects`);
  }

  async clearPolyanets(size = 11) {
    const polyanets = this.generateXPattern(size);
    for (const obj of polyanets) {
      const { row, column } = obj.getPosition();
      await this.api.deletePolyanet(row, column);
      await this.delay(1000); // 1 second delay between requests
    }
    console.log(`🗑️ Cleared ${polyanets.length} POLYanets`);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = MegaverseCreator;
