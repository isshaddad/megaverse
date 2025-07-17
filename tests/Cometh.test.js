const Cometh = require('../src/Cometh');

describe('Cometh', () => {
  let cometh;

  beforeEach(() => {
    cometh = new Cometh(6, 8, 'up');
  });

  describe('constructor', () => {
    test('should create a cometh with row, column and direction', () => {
      expect(cometh.row).toBe(6);
      expect(cometh.column).toBe(8);
      expect(cometh.direction).toBe('up');
    });

    test('should inherit from AstralObject', () => {
      expect(cometh.getPosition).toBeDefined();
      expect(typeof cometh.getPosition).toBe('function');
    });
  });

  describe('getType', () => {
    test('should return cometh type', () => {
      expect(cometh.getType()).toBe('cometh');
    });
  });

  describe('getPosition', () => {
    test('should return correct position', () => {
      const position = cometh.getPosition();
      expect(position).toEqual({ row: 6, column: 8 });
    });
  });

  describe('direction property', () => {
    test('should store the correct direction', () => {
      const downCometh = new Cometh(1, 1, 'down');
      expect(downCometh.direction).toBe('down');
    });
  });
});
