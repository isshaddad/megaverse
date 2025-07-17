const MegaverseAPI = require('./MegaverseAPI');
const Polyanet = require('./Polyanet');
const Logger = require('./utils/Logger');
const { API, LOGGING } = require('../config');

class MegaverseCreator {
  constructor() {
    this.api = new MegaverseAPI();
    this.logger = new Logger(LOGGING.LEVEL);
  }

  async createPhase1Pattern(size = 11, options = {}) {
    const { dryRun = false } = options;

    this.logger.info(
      `Starting Phase 1: Creating POLYanet X-shape on ${size}x${size} grid${
        dryRun ? ' (DRY RUN)' : ''
      }`
    );

    const polyanets = this.generateXPattern(size);

    if (dryRun) {
      return {
        success: true,
        dryRun: true,
        operations: polyanets.map((p) => ({
          type: 'POLYANET',
          row: p.row,
          column: p.column,
          action: 'create',
        })),
        totalObjects: polyanets.length,
      };
    }

    await this.createAstralObjects(polyanets, 'POLYanet X-shape');
    return { success: true, totalObjects: polyanets.length };
  }

  async createPolyanetX(size = 11) {
    return this.createPhase1Pattern(size);
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

  async createAstralObjects(
    astralObjects,
    operationName = 'astral objects',
    options = {}
  ) {
    const { dryRun = false } = options;
    const total = astralObjects.length;
    this.logger.info(
      `Starting creation of ${total} ${operationName}${
        dryRun ? ' (DRY RUN)' : ''
      }`
    );

    const operations = [];
    const errors = [];
    let completedOperations = 0;

    for (let i = 0; i < astralObjects.length; i++) {
      const obj = astralObjects[i];
      const { row, column } = obj.getPosition();

      try {
        if (!dryRun) {
          if (obj.getType() === 'polyanet') {
            await this.api.createPolyanet(row, column);
          } else if (obj.getType() === 'soloon') {
            await this.api.createSoloon(row, column, obj.color);
          } else if (obj.getType() === 'cometh') {
            await this.api.createCometh(row, column, obj.direction);
          }
        }

        const operation = {
          type: obj.getType().toUpperCase(),
          row,
          column,
          action: 'create',
          ...(obj.color && { color: obj.color }),
          ...(obj.direction && { direction: obj.direction }),
        };

        operations.push(operation);
        completedOperations++;

        if (LOGGING.ENABLE_PROGRESS) {
          const progress = (((i + 1) / total) * 100).toFixed(1);
          this.logger.info(`Progress: ${progress}% (${i + 1}/${total})`);
        }

        if (!dryRun) {
          await this.delay(API.RATE_LIMIT_DELAY);
        }
      } catch (error) {
        const errorMsg = `Failed to create ${obj.getType()} at (${row}, ${column}): ${
          error.message
        }`;
        this.logger.error(errorMsg, { error: error.message });
        errors.push(errorMsg);

        if (!dryRun) {
          throw error;
        }
      }
    }

    this.logger.info(
      `Successfully processed ${completedOperations} ${operationName}`
    );

    if (dryRun) {
      return {
        success: errors.length === 0,
        dryRun: true,
        operations,
        errors,
        completedOperations,
        totalObjects: total,
      };
    }

    return { success: true, completedOperations: total };
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

  async createPhase2Pattern(options = {}) {
    const { dryRun = false } = options;

    this.logger.info(
      `Starting Phase 2: Building megaverse from goal map${
        dryRun ? ' (DRY RUN)' : ''
      }`
    );

    try {
      const goal = await this.api.getGoalMap();
      const map = goal.goal;
      const size = map.length;
      const astralObjects = [];
      const errors = [];

      this.logger.info(`Parsing goal map (${size}x${size})`);

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const cell = map[row][col];
          try {
            if (cell === 'POLYANET') {
              astralObjects.push(new (require('./Polyanet'))(row, col));
            } else if (cell && cell.endsWith('SOLOON')) {
              const color = cell.split('_')[0].toLowerCase();
              astralObjects.push(new (require('./Soloon'))(row, col, color));
            } else if (cell && cell.endsWith('COMETH')) {
              const direction = cell.split('_')[0].toLowerCase();
              astralObjects.push(
                new (require('./Cometh'))(row, col, direction)
              );
            } else if (cell !== 'SPACE' && cell !== null) {
              errors.push(`Invalid object type: ${cell} at (${row}, ${col})`);
            }
          } catch (error) {
            errors.push(
              `Failed to parse object ${cell} at (${row}, ${col}): ${error.message}`
            );
          }
        }
      }

      this.logger.info(
        `Parsed ${astralObjects.length} astral objects from goal map`
      );

      if (errors.length > 0) {
        this.logger.warn(`Found ${errors.length} parsing errors:`, errors);
      }

      const result = await this.createAstralObjects(
        astralObjects,
        'astral objects from goal map',
        { dryRun }
      );

      if (dryRun) {
        return {
          ...result,
          errors: [...errors, ...result.errors],
          success: errors.length === 0 && result.success,
        };
      }

      return { success: true, totalObjects: astralObjects.length };
    } catch (error) {
      this.logger.error('Failed to build from goal map', {
        error: error.message,
      });
      throw error;
    }
  }

  async buildFromGoalMap() {
    return this.createPhase2Pattern();
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

  async validateGoalState() {
    this.logger.info('Starting goal state validation');

    try {
      const goal = await this.api.getGoalMap();
      const current = await this.api.getCurrentMap();

      if (!goal?.goal || !current?.map?.content) {
        throw new Error('Failed to get valid goal or current map');
      }

      const goalMap = goal.goal;
      const currentMap = current.map.content;
      const goalSize = goalMap.length;
      const currentSize = currentMap.length;
      const maxSize = Math.max(goalSize, currentSize);

      this.logger.info(
        `Validating goal (${goalSize}x${goalSize}) vs current (${currentSize}x${currentSize}) map state`
      );

      const missingObjects = [];
      const extraObjects = [];
      const goalObjects = new Set();
      const currentObjects = new Set();

      // Parse goal map objects
      for (let row = 0; row < goalSize; row++) {
        for (let col = 0; col < goalSize; col++) {
          const cell = goalMap[row][col];
          if (cell !== 'SPACE' && cell !== null) {
            goalObjects.add(`${cell}_${row}_${col}`);
          }
        }
      }

      // Parse current map objects (check all rows/cols up to max size)
      for (let row = 0; row < maxSize; row++) {
        for (let col = 0; col < maxSize; col++) {
          if (row < currentSize && col < currentSize) {
            const cell = currentMap[row][col];
            if (cell && cell !== null) {
              // Convert current map format to goal format for comparison
              let goalFormat = this.convertCurrentToGoalFormat(cell, row, col);
              if (goalFormat) {
                currentObjects.add(`${goalFormat}_${row}_${col}`);
              }
            }
          }
        }
      }

      for (const goalObj of goalObjects) {
        if (!currentObjects.has(goalObj)) {
          const parts = goalObj.split('_');
          const row = parts[parts.length - 2];
          const col = parts[parts.length - 1];
          const type = parts.slice(0, -2).join('_');
          missingObjects.push({
            type,
            row: parseInt(row),
            column: parseInt(col),
          });
        }
      }

      for (const currentObj of currentObjects) {
        if (!goalObjects.has(currentObj)) {
          const parts = currentObj.split('_');
          const row = parts[parts.length - 2];
          const col = parts[parts.length - 1];
          const type = parts.slice(0, -2).join('_');
          extraObjects.push({
            type,
            row: parseInt(row),
            column: parseInt(col),
          });
        }
      }

      const isValid = missingObjects.length === 0 && extraObjects.length === 0;

      this.logger.info(`Validation complete: ${isValid ? 'VALID' : 'INVALID'}`);
      if (missingObjects.length > 0) {
        this.logger.warn(
          `Missing ${missingObjects.length} objects:`,
          missingObjects
        );
      }
      if (extraObjects.length > 0) {
        this.logger.warn(`Extra ${extraObjects.length} objects:`, extraObjects);
      }

      return {
        isValid,
        missingObjects,
        extraObjects,
        totalGoalObjects: goalObjects.size,
        totalCurrentObjects: currentObjects.size,
      };
    } catch (error) {
      this.logger.error('Failed to validate goal state', {
        error: error.message,
      });
      throw error;
    }
  }

  convertCurrentToGoalFormat(cell, row, col) {
    if (cell.type === 0) {
      return 'POLYANET';
    } else if (cell.type === 1) {
      return `${cell.color.toUpperCase()}_SOLOON`;
    } else if (cell.type === 2) {
      return `${cell.direction.toUpperCase()}_COMETH`;
    }
    return null;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = MegaverseCreator;
