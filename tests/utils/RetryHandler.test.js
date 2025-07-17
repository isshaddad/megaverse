const RetryHandler = require('../../src/utils/RetryHandler');

describe('RetryHandler', () => {
  let retryHandler;
  let consoleSpy;

  beforeEach(() => {
    retryHandler = new RetryHandler(3, 100);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should create retry handler with default values', () => {
      const defaultHandler = new RetryHandler();
      expect(defaultHandler.maxRetries).toBe(3);
      expect(defaultHandler.baseDelay).toBe(2000);
    });

    test('should create retry handler with custom values', () => {
      expect(retryHandler.maxRetries).toBe(3);
      expect(retryHandler.baseDelay).toBe(100);
    });
  });

  describe('executeWithRetry', () => {
    test('should execute successful operation on first try', async () => {
      const mockOperation = jest.fn().mockResolvedValue('success');

      const result = await retryHandler.executeWithRetry(
        mockOperation,
        'test operation'
      );

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    test('should retry on retryable error and eventually succeed', async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValueOnce({ response: { status: 429 } })
        .mockRejectedValueOnce({ response: { status: 500 } })
        .mockResolvedValue('success');

      const result = await retryHandler.executeWithRetry(
        mockOperation,
        'test operation'
      );

      expect(result).toBe('success');
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    test('should fail after max retries', async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValue({ response: { status: 429 } });

      await expect(
        retryHandler.executeWithRetry(mockOperation, 'test operation')
      ).rejects.toThrow('test operation failed after 4 attempts');

      expect(mockOperation).toHaveBeenCalledTimes(4);
    });

    test('should not retry on non-retryable error', async () => {
      const mockOperation = jest
        .fn()
        .mockRejectedValue({ response: { status: 400 } });

      await expect(
        retryHandler.executeWithRetry(mockOperation, 'test operation')
      ).rejects.toEqual({ response: { status: 400 } });

      expect(mockOperation).toHaveBeenCalledTimes(1);
    });
  });

  describe('shouldRetry', () => {
    test('should retry on 429 status code', () => {
      const error = { response: { status: 429 } };
      expect(retryHandler.shouldRetry(error)).toBe(true);
    });

    test('should retry on 500 status code', () => {
      const error = { response: { status: 500 } };
      expect(retryHandler.shouldRetry(error)).toBe(true);
    });

    test('should not retry on 400 status code', () => {
      const error = { response: { status: 400 } };
      expect(retryHandler.shouldRetry(error)).toBe(false);
    });

    test('should retry on network errors', () => {
      const error = { code: 'ECONNRESET' };
      expect(retryHandler.shouldRetry(error)).toBe(true);
    });
  });

  describe('calculateDelay', () => {
    test('should calculate exponential backoff', () => {
      expect(retryHandler.calculateDelay(0)).toBe(100);
      expect(retryHandler.calculateDelay(1)).toBe(200);
      expect(retryHandler.calculateDelay(2)).toBe(400);
    });
  });
});
