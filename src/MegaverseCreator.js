const MegaverseAPI = require('./MegaverseAPI');
const Polyanet = require('./Polyanet');
const Logger = require('./utils/Logger');
const { API, LOGGING } = require('../config');

class MegaverseCreator {
  constructor() {
    this.api = new MegaverseAPI();
    this.logger = new Logger(LOGGING.LEVEL);
  }

  async createPolyanetX(size = 11) {
    this.logger.info(
      `Starting Phase 1: Creating POLYanet X-shape on ${size}x${size} grid`
    );
    const polyanets = this.generateXPattern(size);
    await this.createAstralObjects(polyanets, 'POLYanet X-shape');
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

    this.logger.info(`Generated X-pattern with ${polyanets.length} POLYanets`);
    return polyanets;
  }

  async createAstralObjects(astralObjects, operationName = 'astral objects') {
    const total = astralObjects.length;
    this.logger.info(`Starting creation of ${total} ${operationName}`);

    for (let i = 0; i < astralObjects.length; i++) {
      const obj = astralObjects[i];
      const { row, column } = obj.getPosition();

      try {
        if (obj.getType() === 'polyanet') {
          await this.api.createPolyanet(row, column);
        } else if (obj.getType() === 'soloon') {
          await this.api.createSoloon(row, column, obj.color);
        } else if (obj.getType() === 'cometh') {
          await this.api.createCometh(row, column, obj.direction);
        }

        if (LOGGING.ENABLE_PROGRESS) {
          const progress = (((i + 1) / total) * 100).toFixed(1);
          this.logger.info(`Progress: ${progress}% (${i + 1}/${total})`);
        }

        await this.delay(API.RATE_LIMIT_DELAY);
      } catch (error) {
        this.logger.error(
          `Failed to create ${obj.getType()} at (${row}, ${column})`,
          { error: error.message }
        );
        throw error;
      }
    }

    this.logger.info(`Successfully created ${total} ${operationName}`);
  }

  async clearPolyanets(size = 11) {
    this.logger.info(`Starting to clear POLYanets from ${size}x${size} grid`);
    const polyanets = this.generateXPattern(size);

    for (let i = 0; i < polyanets.length; i++) {
      const obj = polyanets[i];
      const { row, column } = obj.getPosition();

      try {
        await this.api.deletePolyanet(row, column);

        if (LOGGING.ENABLE_PROGRESS) {
          const progress = (((i + 1) / polyanets.length) * 100).toFixed(1);
          this.logger.info(
            `Clear progress: ${progress}% (${i + 1}/${polyanets.length})`
          );
        }

        await this.delay(API.RATE_LIMIT_DELAY);
      } catch (error) {
        this.logger.error(`Failed to delete POLYanet at (${row}, ${column})`, {
          error: error.message,
        });
        throw error;
      }
    }

    this.logger.info(`Successfully cleared ${polyanets.length} POLYanets`);
  }

  async buildFromGoalMap() {
    this.logger.info('Starting Phase 2: Building megaverse from goal map');

    try {
      const goal = await this.api.getGoalMap();
      const map = goal.goal;
      const size = map.length;
      const astralObjects = [];

      this.logger.info(`Parsing goal map (${size}x${size})`);

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

      this.logger.info(
        `Parsed ${astralObjects.length} astral objects from goal map`
      );
      await this.createAstralObjects(
        astralObjects,
        'astral objects from goal map'
      );
    } catch (error) {
      this.logger.error('Failed to build from goal map', {
        error: error.message,
      });
      throw error;
    }
  }

  async clearAll() {
    this.logger.info(
      '🗑️ Starting comprehensive map reset - clearing all astral objects'
    );

    try {
      const currentMap = await this.api.getCurrentMap();

      if (!currentMap?.map?.content) {
        throw new Error('Failed to get valid current map response');
      }

      const map = currentMap.map.content;
      const size = map.length;

      this.logger.info(
        `Analyzing current map (${size}x${size}) to identify objects to clear`
      );

      let totalObjects = 0;

      //count objects
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (map[row][col] && map[row][col] !== null) {
            totalObjects++;
          }
        }
      }

      this.logger.info(`Found ${totalObjects} objects to clear`);

      if (totalObjects === 0) {
        this.logger.info('✅ Map is already empty');
        return;
      }

      //delete objects
      let processed = 0;
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const cell = map[row][col];

          if (cell && cell !== null) {
            try {
              // Try to delete all types since we don't know the exact structure
              let deleted = false;

              // Try POLYanet first
              try {
                await this.api.deletePolyanet(row, col);
                deleted = true;
              } catch (polyError) {
                // If it's not a POLYanet, try SOLoon
                try {
                  await this.api.deleteSoloon(row, col);
                  deleted = true;
                } catch (soloonError) {
                  // If it's not a SOLoon, try ComETH
                  try {
                    await this.api.deleteCometh(row, col);
                    deleted = true;
                  } catch (comethError) {
                    this.logger.warn(
                      `Failed to delete object at (${row}, ${col}) - tried all types`
                    );
                  }
                }
              }

              if (deleted) {
                processed++;
                if (LOGGING.ENABLE_PROGRESS) {
                  const progress = ((processed / totalObjects) * 100).toFixed(
                    1
                  );
                  this.logger.info(
                    `Clear progress: ${progress}% (${processed}/${totalObjects})`
                  );
                }
              }

              await this.delay(API.RATE_LIMIT_DELAY);
            } catch (error) {
              this.logger.warn(
                `Failed to delete object at (${row}, ${col}): ${error.message}`
              );
            }
          }
        }
      }

      this.logger.info(`✅ Map reset completed!`);
    } catch (error) {
      this.logger.error('Failed to clear all objects', {
        error: error.message,
      });
      throw error;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = MegaverseCreator;
