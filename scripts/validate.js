const MegaverseCreator = require('../src/MegaverseCreator');
const Logger = require('../src/utils/Logger');

class MegaverseValidator {
  constructor() {
    this.creator = new MegaverseCreator();
    this.logger = new Logger('info');
  }

  async validate() {
    console.log('🔍 Starting Megaverse validation...\n');

    try {
      const result = await this.creator.validateGoalState();

      console.log('📊 VALIDATION RESULTS');
      console.log('=====================');
      console.log(`Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
      console.log(`Goal Objects: ${result.totalGoalObjects}`);
      console.log(`Current Objects: ${result.totalCurrentObjects}`);

      if (result.missingObjects.length > 0) {
        console.log(`\n❌ Missing Objects (${result.missingObjects.length}):`);
        result.missingObjects.forEach((obj) => {
          console.log(`   - ${obj.type} at (${obj.row}, ${obj.column})`);
        });
      }

      if (result.extraObjects.length > 0) {
        console.log(`\n⚠️  Extra Objects (${result.extraObjects.length}):`);
        result.extraObjects.forEach((obj) => {
          console.log(`   - ${obj.type} at (${obj.row}, ${obj.column})`);
        });
      }

      if (result.isValid) {
        console.log(
          '\n🎉 Congratulations! Your megaverse matches the goal state perfectly!'
        );
      } else {
        console.log('\n💡 Recommendations:');
        if (result.missingObjects.length > 0) {
          console.log('   - Run Phase 2 to create missing objects');
        }
        if (result.extraObjects.length > 0) {
          console.log('   - Run reset script to clear extra objects');
        }
      }

      return result;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      throw error;
    }
  }

  async dryRunPhase1(size = 11) {
    console.log(`🧪 Dry run Phase 1 (${size}x${size} X pattern)...\n`);

    try {
      const result = await this.creator.createPhase1Pattern(size, {
        dryRun: true,
      });

      console.log('📋 PHASE 1 DRY RUN RESULTS');
      console.log('==========================');
      console.log(`Success: ${result.success}`);
      console.log(`Total Operations: ${result.totalObjects}`);
      console.log(`Operations:`);

      result.operations.forEach((op, index) => {
        console.log(
          `   ${index + 1}. Create ${op.type} at (${op.row}, ${op.column})`
        );
      });

      return result;
    } catch (error) {
      console.error('❌ Phase 1 dry run failed:', error.message);
      throw error;
    }
  }

  async dryRunPhase2() {
    console.log('🧪 Dry run Phase 2 (goal map)...\n');

    try {
      const result = await this.creator.createPhase2Pattern({ dryRun: true });

      console.log('📋 PHASE 2 DRY RUN RESULTS');
      console.log('==========================');
      console.log(`Success: ${result.success}`);
      console.log(`Total Operations: ${result.totalObjects}`);
      console.log(`Completed Operations: ${result.completedOperations}`);

      if (result.errors.length > 0) {
        console.log(`\n❌ Errors (${result.errors.length}):`);
        result.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }

      if (result.operations.length > 0) {
        console.log(`\nOperations:`);
        result.operations.forEach((op, index) => {
          const details = [];
          if (op.color) details.push(`color: ${op.color}`);
          if (op.direction) details.push(`direction: ${op.direction}`);
          const detailsStr =
            details.length > 0 ? ` (${details.join(', ')})` : '';
          console.log(
            `   ${index + 1}. Create ${op.type} at (${op.row}, ${
              op.column
            })${detailsStr}`
          );
        });
      }

      return result;
    } catch (error) {
      console.error('❌ Phase 2 dry run failed:', error.message);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const validator = new MegaverseValidator();
  const args = process.argv.slice(2);

  try {
    switch (args[0]) {
      case 'validate':
        await validator.validate();
        break;
      case 'dry-run:phase1':
        const size = parseInt(args[1]) || 11;
        await validator.dryRunPhase1(size);
        break;
      case 'dry-run:phase2':
        await validator.dryRunPhase2();
        break;
      case 'all':
        console.log('Running all validations...\n');
        await validator.dryRunPhase1();
        console.log('\n' + '='.repeat(50) + '\n');
        await validator.dryRunPhase2();
        console.log('\n' + '='.repeat(50) + '\n');
        await validator.validate();
        break;
      default:
        console.log('Usage:');
        console.log(
          '  node scripts/validate.js validate          - Validate current state vs goal'
        );
        console.log(
          '  node scripts/validate.js dry-run:phase1    - Dry run Phase 1'
        );
        console.log(
          '  node scripts/validate.js dry-run:phase2    - Dry run Phase 2'
        );
        console.log(
          '  node scripts/validate.js all               - Run all validations'
        );
        break;
    }
  } catch (error) {
    console.error('❌ Validation script failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = MegaverseValidator;
