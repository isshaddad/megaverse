const AstralObject = require('../src/AstralObject');

describe('AstralObject', () => {
  let astralObject;

  beforeEach(() => {
    astralObject = new AstralObject(5, 10);
  });

  describe('constructor', () => {
    test('should create an astral object with row and column', () => {
      expect(astralObject.row).toBe(5);
      expect(astralObject.column).toBe(10);
    });
  });

  describe('getPosition', () => {
    test('should return position object with row and column', () => {
      const position = astralObject.getPosition();
      expect(position).toEqual({ row: 5, column: 10 });
    });
  });
});
