const MegaverseAPI = require('../../src/MegaverseAPI');
const MegaverseCreator = require('../../src/MegaverseCreator');

jest.mock('axios');
jest.mock('../../src/utils/RetryHandler');
jest.mock('../../src/utils/Logger');

describe('Megaverse Integration Tests', () => {
  let api;
  let creator;
  let mockAxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    };
    require('axios').create.mockReturnValue(mockAxiosInstance);

    // Mock RetryHandler
    const RetryHandler = require('../../src/utils/RetryHandler');
    RetryHandler.mockImplementation(() => ({
      executeWithRetry: jest.fn().mockImplementation(async (fn) => {
        return await fn(); // This will throw errors from the API calls
      }),
    }));

    // Mock Logger
    const Logger = require('../../src/utils/Logger');
    Logger.mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    }));

    api = new MegaverseAPI();
    creator = new MegaverseCreator();
  });

  describe('Phase 1 Integration', () => {
    test('should create X pattern successfully', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });
      mockAxiosInstance.get.mockResolvedValue({
        data: {
          map: {
            content: [],
          },
        },
      });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.createPhase1Pattern();

      expect(result.success).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(13);
    });

    test('should handle API errors during pattern creation', async () => {
      mockAxiosInstance.post.mockRejectedValue(new Error('API Error'));

      creator.delay = jest.fn().mockResolvedValue(undefined);

      await expect(creator.createPhase1Pattern()).rejects.toThrow('API Error');
    });
  });

  describe('Phase 2 Integration', () => {
    test('should create goal map pattern successfully', async () => {
      const mockGoalMap = {
        goal: [
          ['SPACE', 'POLYANET', 'SPACE'],
          ['SPACE', 'RED_SOLOON', 'SPACE'],
          ['SPACE', 'UP_COMETH', 'SPACE'],
        ],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockGoalMap });
      mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.createPhase2Pattern();

      expect(result.success).toBe(true);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(3);
    });

    test('should handle empty goal map', async () => {
      const mockGoalMap = { goal: [] };

      mockAxiosInstance.get.mockResolvedValue({ data: mockGoalMap });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.createPhase2Pattern();

      expect(result.success).toBe(true);
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });
  });

  describe('Dry Run Mode', () => {
    test('should simulate operations without making API calls', async () => {
      const mockGoalMap = {
        goal: [
          ['SPACE', 'POLYANET', 'SPACE'],
          ['SPACE', 'RED_SOLOON', 'SPACE'],
        ],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockGoalMap });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.createPhase2Pattern({ dryRun: true });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.operations).toHaveLength(2);
      expect(mockAxiosInstance.post).not.toHaveBeenCalled();
    });

    test('should validate operations in dry run mode', async () => {
      const mockGoalMap = {
        goal: [
          ['SPACE', 'POLYANET', 'SPACE'],
          ['SPACE', 'INVALID_OBJECT', 'SPACE'],
        ],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockGoalMap });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.createPhase2Pattern({ dryRun: true });

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Invalid object type');
    });
  });

  describe('Validation Tests', () => {
    test('should validate goal state against current state', async () => {
      const mockGoalMap = {
        goal: [
          ['SPACE', 'POLYANET', 'SPACE'],
          ['SPACE', 'RED_SOLOON', 'SPACE'],
        ],
      };

      const mockCurrentMap = {
        map: {
          content: [
            [null, { type: 0, row: 0, column: 1 }, null],
            [null, { type: 1, row: 1, column: 1, color: 'red' }, null],
          ],
        },
      };

      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: mockGoalMap })
        .mockResolvedValueOnce({ data: mockCurrentMap });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.validateGoalState();

      expect(result.isValid).toBe(true);
      expect(result.missingObjects).toHaveLength(0);
      expect(result.extraObjects).toHaveLength(0);
    });

    test('should detect missing objects', async () => {
      const mockGoalMap = {
        goal: [
          ['SPACE', 'POLYANET', 'SPACE'],
          ['SPACE', 'RED_SOLOON', 'SPACE'],
        ],
      };

      const mockCurrentMap = {
        map: {
          content: [
            [null, { type: 0, row: 0, column: 1 }, null],
            [null, null, null],
          ],
        },
      };

      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: mockGoalMap })
        .mockResolvedValueOnce({ data: mockCurrentMap });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.validateGoalState();

      expect(result.isValid).toBe(false);
      expect(result.missingObjects).toHaveLength(1);
      expect(result.missingObjects[0]).toEqual({
        type: 'RED_SOLOON',
        row: 1,
        column: 1,
      });
    });

    test('should detect extra objects', async () => {
      const mockGoalMap = {
        goal: [
          ['SPACE', 'POLYANET', 'SPACE'],
          ['SPACE', 'SPACE', 'SPACE'],
        ],
      };

      const mockCurrentMap = {
        map: {
          content: [
            [null, { type: 0, row: 0, column: 1 }, null],
            [null, { type: 1, row: 1, column: 1, color: 'red' }, null],
          ],
        },
      };

      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: mockGoalMap })
        .mockResolvedValueOnce({ data: mockCurrentMap });

      creator.delay = jest.fn().mockResolvedValue(undefined);

      const result = await creator.validateGoalState();

      expect(result.isValid).toBe(false);
      expect(result.extraObjects).toHaveLength(1);
      expect(result.extraObjects[0]).toEqual({
        type: 'RED_SOLOON',
        row: 1,
        column: 1,
      });
    });
  });

  describe('Error Recovery', () => {
    test('should handle API errors gracefully', async () => {
      const mockGoalMap = {
        goal: [
          ['SPACE', 'POLYANET', 'SPACE'],
          ['SPACE', 'RED_SOLOON', 'SPACE'],
        ],
      };

      mockAxiosInstance.get.mockResolvedValue({ data: mockGoalMap });
      mockAxiosInstance.post.mockRejectedValue(new Error('API Error'));

      creator.delay = jest.fn().mockResolvedValue(undefined);

      await expect(creator.createPhase2Pattern()).rejects.toThrow('API Error');
    });

    test('should handle goal map fetch errors', async () => {
      mockAxiosInstance.get.mockRejectedValue(new Error('Network Error'));

      creator.delay = jest.fn().mockResolvedValue(undefined);

      await expect(creator.createPhase2Pattern()).rejects.toThrow(
        'Network Error'
      );
    });
  });
});
