const axios = require('axios');
const MegaverseAPI = require('../src/MegaverseAPI');
const RetryHandler = require('../src/utils/RetryHandler');
const Logger = require('../src/utils/Logger');

jest.mock('axios');
jest.mock('../src/utils/RetryHandler');
jest.mock('../src/utils/Logger');

describe('MegaverseAPI', () => {
  let api;
  let mockAxiosInstance;
  let mockRetryHandler;
  let mockLogger;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios instance
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    };
    axios.create.mockReturnValue(mockAxiosInstance);

    mockRetryHandler = {
      executeWithRetry: jest.fn(),
    };
    RetryHandler.mockImplementation(() => mockRetryHandler);

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };
    Logger.mockImplementation(() => mockLogger);

    api = new MegaverseAPI();
  });

  describe('constructor', () => {
    test('should initialize with correct configuration', () => {
      expect(axios.create).toHaveBeenCalledWith({
        timeout: 10000,
      });
      expect(RetryHandler).toHaveBeenCalledWith(3, 2000);
      expect(Logger).toHaveBeenCalledWith('debug');
      expect(api.baseURL).toBe('https://challenge.crossmint.io/api');
      expect(api.candidateId).toBe('71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea');
    });
  });

  describe('createPolyanet', () => {
    test('should create polyanet successfully', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.createPolyanet(2, 3);

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Create POLYanet at (2, 3)'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/polyanets',
        {
          row: 2,
          column: 3,
          candidateId: '71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea',
        }
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Created POLYanet at (2, 3)'
      );
      expect(result).toEqual({ success: true });
    });

    test('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockAxiosInstance.post.mockRejectedValue(mockError);
      mockRetryHandler.executeWithRetry.mockImplementation(async (fn) => {
        try {
          await fn();
        } catch (error) {
          throw error;
        }
      });

      await expect(api.createPolyanet(2, 3)).rejects.toThrow('API Error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'createPolyanet failed: API Error',
        { context: { row: 2, column: 3 } }
      );
    });
  });

  describe('deletePolyanet', () => {
    test('should delete polyanet successfully', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.deletePolyanet(2, 3);

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Delete POLYanet at (2, 3)'
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/polyanets',
        {
          data: {
            row: 2,
            column: 3,
            candidateId: '71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea',
          },
        }
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Deleted POLYanet at (2, 3)'
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('createSoloon', () => {
    test('should create soloon successfully', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.createSoloon(2, 3, 'blue');

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Create SOLoon (blue) at (2, 3)'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/soloons',
        {
          row: 2,
          column: 3,
          color: 'blue',
          candidateId: '71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea',
        }
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Created SOLoon (blue) at (2, 3)'
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('createCometh', () => {
    test('should create cometh successfully', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.createCometh(2, 3, 'up');

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Create ComETH (up) at (2, 3)'
      );
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/comeths',
        {
          row: 2,
          column: 3,
          direction: 'up',
          candidateId: '71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea',
        }
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Created ComETH (up) at (2, 3)'
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('getGoalMap', () => {
    test('should fetch goal map successfully', async () => {
      const mockResponse = { data: { goal: [['SPACE', 'POLYANET']] } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.getGoalMap();

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Get goal map'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/map/71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea/goal'
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Successfully fetched goal map'
      );
      expect(result).toEqual({ goal: [['SPACE', 'POLYANET']] });
    });
  });

  describe('getCurrentMap', () => {
    test('should fetch current map successfully', async () => {
      const mockResponse = { data: { map: { content: [] } } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.getCurrentMap();

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Get current map'
      );
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/map/71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea'
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Successfully fetched current map'
      );
      expect(result).toEqual({ map: { content: [] } });
    });
  });

  describe('deleteSoloon', () => {
    test('should delete soloon successfully', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.deleteSoloon(2, 3);

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Delete SOLoon at (2, 3)'
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/soloons',
        {
          data: {
            row: 2,
            column: 3,
            candidateId: '71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea',
          },
        }
      );
      expect(mockLogger.info).toHaveBeenCalledWith('Deleted SOLoon at (2, 3)');
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteCometh', () => {
    test('should delete cometh successfully', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockImplementation(
        async (fn) => await fn()
      );

      const result = await api.deleteCometh(2, 3);

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'Delete ComETH at (2, 3)'
      );
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        'https://challenge.crossmint.io/api/comeths',
        {
          data: {
            row: 2,
            column: 3,
            candidateId: '71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea',
          },
        }
      );
      expect(mockLogger.info).toHaveBeenCalledWith('Deleted ComETH at (2, 3)');
      expect(result).toEqual({ success: true });
    });
  });

  describe('handleApiError', () => {
    test('should handle server error response', () => {
      const error = {
        response: {
          status: 429,
          data: { error: 'Rate limit exceeded' },
        },
      };

      api.handleApiError(error, 'createPolyanet', { row: 2, column: 3 });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'createPolyanet failed with status 429: Rate limit exceeded',
        {
          status: 429,
          data: { error: 'Rate limit exceeded' },
          context: { row: 2, column: 3 },
        }
      );
    });

    test('should handle network error', () => {
      const error = {
        request: {},
      };

      api.handleApiError(error, 'createPolyanet', { row: 2, column: 3 });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'createPolyanet failed: Network error - no response received',
        { context: { row: 2, column: 3 } }
      );
    });

    test('should handle other errors', () => {
      const error = {
        message: 'Timeout error',
      };

      api.handleApiError(error, 'createPolyanet', { row: 2, column: 3 });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'createPolyanet failed: Timeout error',
        { context: { row: 2, column: 3 } }
      );
    });

    test('should handle error without context', () => {
      const error = {
        message: 'Generic error',
      };

      api.handleApiError(error, 'getGoalMap');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'getGoalMap failed: Generic error',
        { context: {} }
      );
    });
  });

  describe('retry integration', () => {
    test('should use retry handler for all operations', async () => {
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      mockRetryHandler.executeWithRetry.mockResolvedValue(mockResponse.data);

      await api.createPolyanet(1, 1);
      await api.createSoloon(1, 1, 'red');
      await api.createCometh(1, 1, 'down');
      await api.getGoalMap();
      await api.getCurrentMap();

      expect(mockRetryHandler.executeWithRetry).toHaveBeenCalledTimes(5);
    });
  });
});
