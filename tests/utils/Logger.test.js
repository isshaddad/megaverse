const Logger = require('../../src/utils/Logger');

describe('Logger', () => {
  let logger;
  let consoleSpy;

  beforeEach(() => {
    logger = new Logger('info');
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should create logger with default level', () => {
      const defaultLogger = new Logger();
      expect(defaultLogger.level).toBe('info');
    });

    test('should create logger with custom level', () => {
      expect(logger.level).toBe('info');
    });
  });

  describe('log levels', () => {
    test('should log info messages when level is info', () => {
      logger.info('test message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test message')
      );
    });

    test('should not log debug messages when level is info', () => {
      logger.debug('debug message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    test('should log debug messages when level is debug', () => {
      const debugLogger = new Logger('debug');
      debugLogger.debug('debug message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] debug message')
      );
    });

    test('should log warn messages', () => {
      logger.warn('warning message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] warning message')
      );
    });

    test('should log error messages', () => {
      logger.error('error message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] error message')
      );
    });
  });

  describe('log with data', () => {
    test('should log message with object data', () => {
      const data = { key: 'value' };
      logger.info('test message', data);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test message')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Data:'),
        expect.stringContaining('"key"')
      );
    });

    test('should log message with string data', () => {
      logger.info('test message', 'string data');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test message')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Data:'),
        'string data'
      );
    });
  });

  describe('setLevel', () => {
    test('should change log level', () => {
      logger.setLevel('debug');
      expect(logger.level).toBe('debug');
    });

    test('should throw error for invalid level', () => {
      expect(() => logger.setLevel('invalid')).toThrow('Invalid log level');
    });
  });

  describe('timestamp format', () => {
    test('should include timestamp in log messages', () => {
      logger.info('test message');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
      );
    });
  });
});
