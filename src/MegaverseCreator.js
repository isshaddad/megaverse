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
      await this.delay(2000);
    }
    console.log(`🌌 Created ${astralObjects.length} astral objects`);
  }

  async clearPolyanets(size = 11) {
    const polyanets = this.generateXPattern(size);
    for (const obj of polyanets) {
      const { row, column } = obj.getPosition();
      await this.api.deletePolyanet(row, column);
      await this.delay(2000);
    }
    console.log(`🗑️ Cleared ${polyanets.length} POLYanets`);
  }

  async buildFromGoalMap() {
    const goal = await this.api.getGoalMap();
    const map = goal.goal;
    const size = map.length;
    const astralObjects = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cell = map[row][col];
        if (cell === 'POLYANET') {
          astralObjects.push(new (require('./Polyanet'))(row, col));
        } else if (cell.endsWith('SOLOON')) {
          const color = cell.split('_')[0].toLowerCase();
          astralObjects.push(new (require('./Soloon'))(row, col, color));
        } else if (cell.endsWith('COMETH')) {
          const direction = cell.split('_')[0].toLowerCase();
          astralObjects.push(new (require('./Cometh'))(row, col, direction));
        }
      }
    }

    for (const obj of astralObjects) {
      const { row, column } = obj.getPosition();
      if (obj.getType() === 'polyanet') {
        await this.api.createPolyanet(row, column);
      } else if (obj.getType() === 'soloon') {
        await this.api.createSoloon(row, column, obj.color);
      } else if (obj.getType() === 'cometh') {
        await this.api.createCometh(row, column, obj.direction);
      }
      await this.delay(2000);
    }
    console.log('🌌 Finished building the megaverse from goal map!');
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = MegaverseCreator;
