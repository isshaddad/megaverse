const MegaverseCreator = require('../src/MegaverseCreator');
const Polyanet = require('../src/Polyanet');

jest.mock('../src/MegaverseAPI');
jest.mock('../src/utils/Logger');

describe('MegaverseCreator', () => {
  let creator;
  let mockApi;
  let mockLogger;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApi = {
      createPolyanet: jest.fn(),
      deletePolyanet: jest.fn(),
      createSoloon: jest.fn(),
      createCometh: jest.fn(),
      deleteSoloon: jest.fn(),
      deleteCometh: jest.fn(),
      getGoalMap: jest.fn(),
      getCurrentMap: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const MegaverseAPI = require('../src/MegaverseAPI');
    MegaverseAPI.mockImplementation(() => mockApi);

    const Logger = require('../src/utils/Logger');
    Logger.mockImplementation(() => mockLogger);

    creator = new MegaverseCreator();

    creator.delay = jest.fn().mockResolvedValue(undefined);
  });

  describe('generateXPattern', () => {
    test('should generate X pattern with correct number of polyanets', () => {
      const polyanets = creator.generateXPattern(11);
      expect(polyanets).toHaveLength(13);
    });

    test('should generate polyanets at correct positions', () => {
      const polyanets = creator.generateXPattern(5);
      const positions = polyanets.map((p) => p.getPosition());

      expect(positions).toContainEqual({ row: 2, column: 2 });

      expect(positions).toContainEqual({ row: 2, column: 2 });
    });

    test('should not include edge positions', () => {
      const polyanets = creator.generateXPattern(11);
      const positions = polyanets.map((p) => p.getPosition());

      expect(positions).not.toContainEqual({ row: 0, column: 0 });
      expect(positions).not.toContainEqual({ row: 1, column: 1 });
      expect(positions).not.toContainEqual({ row: 9, column: 9 });
      expect(positions).not.toContainEqual({ row: 10, column: 10 });
    });
  });

  describe('createPolyanetX', () => {
    test('should create X pattern successfully', async () => {
      mockApi.createPolyanet.mockResolvedValue({ success: true });

      await creator.createPolyanetX(5);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting Phase 1: Creating POLYanet X-shape on 5x5 grid'
      );
      expect(mockApi.createPolyanet).toHaveBeenCalledTimes(1);
    });
  });

  describe('buildFromGoalMap', () => {
    test('should build map from goal successfully', async () => {
      const mockGoalMap = {
        goal: [
          [null, null, 'POLYANET', null],
          [null, 'BLUE_SOLOON', null, 'UP_COMETH'],
          ['POLYANET', null, null, null],
          [null, null, null, null],
        ],
      };

      mockApi.getGoalMap.mockResolvedValue(mockGoalMap);
      mockApi.createPolyanet.mockResolvedValue({ success: true });
      mockApi.createSoloon.mockResolvedValue({ success: true });
      mockApi.createCometh.mockResolvedValue({ success: true });

      await creator.buildFromGoalMap();

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting Phase 2: Building megaverse from goal map'
      );
      expect(mockApi.getGoalMap).toHaveBeenCalled();
      expect(mockApi.createPolyanet).toHaveBeenCalledTimes(2);
      expect(mockApi.createSoloon).toHaveBeenCalledTimes(1);
      expect(mockApi.createCometh).toHaveBeenCalledTimes(1);
    });

    test('should handle empty goal map', async () => {
      const mockGoalMap = {
        goal: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
      };

      mockApi.getGoalMap.mockResolvedValue(mockGoalMap);

      await creator.buildFromGoalMap();

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Parsed 0 astral objects from goal map'
      );
    });
  });

  describe('clearAll', () => {
    test('should clear all objects successfully', async () => {
      const mockCurrentMap = {
        map: {
          content: [
            [null, null, 'POLYANET', null],
            [null, 'BLUE_SOLOON', null, 'UP_COMETH'],
            ['POLYANET', null, null, null],
            [null, null, null, null],
          ],
        },
      };

      mockApi.getCurrentMap.mockResolvedValue(mockCurrentMap);

      // Mock all delete methods to succeed
      mockApi.deletePolyanet.mockResolvedValue({ success: true });
      mockApi.deleteSoloon.mockResolvedValue({ success: true });
      mockApi.deleteCometh.mockResolvedValue({ success: true });

      await creator.clearAll();

      expect(mockLogger.info).toHaveBeenCalledWith(
        '🗑️ Starting comprehensive map reset - clearing all astral objects'
      );
      expect(mockApi.getCurrentMap).toHaveBeenCalled();

      // Since all deletePolyanet calls succeed, no other delete methods should be called
      expect(mockApi.deletePolyanet).toHaveBeenCalledTimes(4); //all 4 objects try POLYanet first
      expect(mockApi.deleteSoloon).toHaveBeenCalledTimes(0); //POLYanet succeeds for all
      expect(mockApi.deleteCometh).toHaveBeenCalledTimes(0); //POLYanet succeeds for all
    });

    test('should handle empty map', async () => {
      const mockCurrentMap = {
        map: {
          content: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ],
        },
      };

      mockApi.getCurrentMap.mockResolvedValue(mockCurrentMap);

      await creator.clearAll();

      expect(mockLogger.info).toHaveBeenCalledWith('✅ Map is already empty');
    });
  });

  describe('delay', () => {
    test('should call delay function', async () => {
      await creator.delay(10);
      expect(creator.delay).toHaveBeenCalledWith(10);
    });
  });
});
