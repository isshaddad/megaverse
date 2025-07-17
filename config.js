module.exports = {
  BASE_URL: 'https://challenge.crossmint.io/api',
  CANDIDATE_ID: '71ff9e01-ebfd-4f12-bcd1-bdc2be0e52ea',
  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    BASE_DELAY: 2000,
    RATE_LIMIT_DELAY: 5000,
  },

  // Logging configuration
  LOGGING: {
    LEVEL: 'debug',
    ENABLE_PROGRESS: true,
  },

  // API configuration
  API: {
    TIMEOUT: 10000,
    RATE_LIMIT_DELAY: 2000,
  },
};
