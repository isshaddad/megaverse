class AstralObject {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  getPosition() {
    return { row: this.row, column: this.column };
  }
}

module.exports = AstralObject;
