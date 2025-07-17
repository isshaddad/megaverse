const Soloon = require('../src/Soloon');

describe('Soloon', () => {
  let soloon;

  beforeEach(() => {
    soloon = new Soloon(2, 4, 'blue');
  });

  describe('constructor', () => {
    test('should create a soloon with row, column and color', () => {
      expect(soloon.row).toBe(2);
      expect(soloon.column).toBe(4);
      expect(soloon.color).toBe('blue');
    });

    test('should inherit from AstralObject', () => {
      expect(soloon.getPosition).toBeDefined();
      expect(typeof soloon.getPosition).toBe('function');
    });
  });

  describe('getType', () => {
    test('should return soloon type', () => {
      expect(soloon.getType()).toBe('soloon');
    });
  });

  describe('getPosition', () => {
    test('should return correct position', () => {
      const position = soloon.getPosition();
      expect(position).toEqual({ row: 2, column: 4 });
    });
  });

  describe('color property', () => {
    test('should store the correct color', () => {
      const redSoloon = new Soloon(1, 1, 'red');
      expect(redSoloon.color).toBe('red');
    });
  });
});
