class RetryHandler {
  constructor(maxRetries = 3, baseDelay = 2000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  async executeWithRetry(operation, operationName = 'API call') {
    let lastError;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries) {
          throw new Error(
            `${operationName} failed after ${this.maxRetries + 1} attempts: ${
              error.message
            }`
          );
        }

        if (this.shouldRetry(error)) {
          const delay = this.calculateDelay(attempt);
          console.log(
            `⚠️ ${operationName} failed (attempt ${attempt + 1}/${
              this.maxRetries + 1
            }), retrying in ${delay}ms...`
          );
          await this.delay(delay);
        } else {
          throw error; // Don't retry if it's not a retryable error
        }
      }
    }
  }

  shouldRetry(error) {
    // Retry on network errors, 429 (rate limit), 500+ (server errors)
    const retryableStatusCodes = [429, 500, 502, 503, 504];
    const retryableErrors = [
      'ECONNRESET',
      'ENOTFOUND',
      'ETIMEDOUT',
      'ECONNREFUSED',
    ];

    if (error.response) {
      return retryableStatusCodes.includes(error.response.status);
    }

    if (error.code) {
      return retryableErrors.includes(error.code);
    }

    return false;
  }

  calculateDelay(attempt) {
    // Exponential backoff: baseDelay * 2^attempt
    return this.baseDelay * Math.pow(2, attempt);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = RetryHandler;
