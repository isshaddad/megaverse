const AstralObject = require('./AstralObject');

class Polyanet extends AstralObject {
  constructor(row, column) {
    super(row, column);
  }

  getType() {
    return 'polyanet';
  }
}

module.exports = Polyanet;
