const AstralObject = require('./AstralObject');

class Soloon extends AstralObject {
  constructor(row, column, color) {
    super(row, column);
    this.color = color;
  }

  getType() {
    return 'soloon';
  }
}

module.exports = Soloon;
