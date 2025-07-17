const Polyanet = require('../src/Polyanet');

describe('Polyanet', () => {
  let polyanet;

  beforeEach(() => {
    polyanet = new Polyanet(3, 7);
  });

  describe('constructor', () => {
    test('should create a polyanet with row and column', () => {
      expect(polyanet.row).toBe(3);
      expect(polyanet.column).toBe(7);
    });

    test('should inherit from AstralObject', () => {
      expect(polyanet.getPosition).toBeDefined();
      expect(typeof polyanet.getPosition).toBe('function');
    });
  });

  describe('getType', () => {
    test('should return polyanet type', () => {
      expect(polyanet.getType()).toBe('polyanet');
    });
  });

  describe('getPosition', () => {
    test('should return correct position', () => {
      const position = polyanet.getPosition();
      expect(position).toEqual({ row: 3, column: 7 });
    });
  });
});
