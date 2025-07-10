const AstralObject = require('./AstralObject');

class Cometh extends AstralObject {
  constructor(row, column, direction) {
    super(row, column);
    this.direction = direction;
  }

  getType() {
    return 'cometh';
  }
}

module.exports = Cometh;
