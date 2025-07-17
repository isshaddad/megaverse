const axios = require('axios');
const { BASE_URL, CANDIDATE_ID, RETRY, API, LOGGING } = require('../config');
const RetryHandler = require('./utils/RetryHandler');
const Logger = require('./utils/Logger');

class MegaverseAPI {
  constructor() {
    this.baseURL = BASE_URL;
    this.candidateId = CANDIDATE_ID;
    this.retryHandler = new RetryHandler(RETRY.MAX_RETRIES, RETRY.BASE_DELAY);
    this.logger = new Logger(LOGGING.LEVEL);

    // Configure axios with timeout
    this.axiosInstance = axios.create({
      timeout: API.TIMEOUT,
    });
  }

  async createPolyanet(row, column) {
    return this.retryHandler.executeWithRetry(async () => {
      try {
        const response = await this.axiosInstance.post(
          `${this.baseURL}/polyanets`,
          {
            row,
            column,
            candidateId: this.candidateId,
          }
        );

        this.logger.info(`Created POLYanet at (${row}, ${column})`);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'createPolyanet', { row, column });
        throw error;
      }
    }, `Create POLYanet at (${row}, ${column})`);
  }

  async deletePolyanet(row, column) {
    return this.retryHandler.executeWithRetry(async () => {
      try {
        const response = await this.axiosInstance.delete(
          `${this.baseURL}/polyanets`,
          {
            data: {
              row,
              column,
              candidateId: this.candidateId,
            },
          }
        );

        this.logger.info(`Deleted POLYanet at (${row}, ${column})`);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'deletePolyanet', { row, column });
        throw error;
      }
    }, `Delete POLYanet at (${row}, ${column})`);
  }

  async createSoloon(row, column, color) {
    return this.retryHandler.executeWithRetry(async () => {
      try {
        const response = await this.axiosInstance.post(
          `${this.baseURL}/soloons`,
          {
            row,
            column,
            color,
            candidateId: this.candidateId,
          }
        );

        this.logger.info(`Created SOLoon (${color}) at (${row}, ${column})`);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'createSoloon', { row, column, color });
        throw error;
      }
    }, `Create SOLoon (${color}) at (${row}, ${column})`);
  }

  async createCometh(row, column, direction) {
    return this.retryHandler.executeWithRetry(async () => {
      try {
        const response = await this.axiosInstance.post(
          `${this.baseURL}/comeths`,
          {
            row,
            column,
            direction,
            candidateId: this.candidateId,
          }
        );

        this.logger.info(
          `Created ComETH (${direction}) at (${row}, ${column})`
        );
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'createCometh', { row, column, direction });
        throw error;
      }
    }, `Create ComETH (${direction}) at (${row}, ${column})`);
  }

  async getGoalMap() {
    return this.retryHandler.executeWithRetry(async () => {
      try {
        const response = await this.axiosInstance.get(
          `${this.baseURL}/map/${this.candidateId}/goal`
        );
        this.logger.info('Successfully fetched goal map');
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'getGoalMap');
        throw error;
      }
    }, 'Get goal map');
  }

  async deleteSoloon(row, column) {
    return this.retryHandler.executeWithRetry(async () => {
      try {
        const response = await this.axiosInstance.delete(
          `${this.baseURL}/soloons`,
          {
            data: {
              row,
              column,
              candidateId: this.candidateId,
            },
          }
        );

        this.logger.info(`Deleted SOLoon at (${row}, ${column})`);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'deleteSoloon', { row, column });
        throw error;
      }
    }, `Delete SOLoon at (${row}, ${column})`);
  }

  async deleteCometh(row, column) {
    return this.retryHandler.executeWithRetry(async () => {
      try {
        const response = await this.axiosInstance.delete(
          `${this.baseURL}/comeths`,
          {
            data: {
              row,
              column,
              candidateId: this.candidateId,
            },
          }
        );

        this.logger.info(`Deleted ComETH at (${row}, ${column})`);
        return response.data;
      } catch (error) {
        this.handleApiError(error, 'deleteCometh', { row, column });
        throw error;
      }
    }, `Delete ComETH at (${row}, ${column})`);
  }

  handleApiError(error, operation, context = {}) {
    let errorMessage = `${operation} failed`;

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      errorMessage += ` with status ${status}`;

      if (data && data.error) {
        errorMessage += `: ${data.error}`;
      }

      this.logger.error(errorMessage, { status, data, context });
    } else if (error.request) {
      // Network error
      errorMessage += ': Network error - no response received';
      this.logger.error(errorMessage, { context });
    } else {
      // Other error
      errorMessage += `: ${error.message}`;
      this.logger.error(errorMessage, { context });
    }
  }
}

module.exports = MegaverseAPI;
