const axios = require('axios');
const { BASE_URL, CANDIDATE_ID } = require('../config');

class MegaverseAPI {
  constructor() {
    this.baseURL = BASE_URL;
    this.candidateId = CANDIDATE_ID;
  }

  async createPolyanet(row, column) {
    try {
      const response = await axios.post(`${this.baseURL}/polyanets`, {
        row,
        column,
        candidateId: this.candidateId,
      });
      console.log(`✅ Created POLYanet at (${row}, ${column})`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Failed to create POLYanet at (${row}, ${column}):`,
        error.message
      );
      throw error;
    }
  }

  async deletePolyanet(row, column) {
    try {
      const response = await axios.delete(`${this.baseURL}/polyanets`, {
        data: {
          row,
          column,
          candidateId: this.candidateId,
        },
      });
      console.log(`🗑️ Deleted POLYanet at (${row}, ${column})`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Failed to delete POLYanet at (${row}, ${column}):`,
        error.message
      );
      throw error;
    }
  }

  async createSoloon(row, column, color) {
    try {
      const response = await axios.post(`${this.baseURL}/soloons`, {
        row,
        column,
        color,
        candidateId: this.candidateId,
      });
      console.log(`✅ Created SOLoon (${color}) at (${row}, ${column})`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Failed to create SOLoon at (${row}, ${column}):`,
        error.message
      );
      throw error;
    }
  }

  async createCometh(row, column, direction) {
    try {
      const response = await axios.post(`${this.baseURL}/comeths`, {
        row,
        column,
        direction,
        candidateId: this.candidateId,
      });
      console.log(`✅ Created ComETH (${direction}) at (${row}, ${column})`);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Failed to create ComETH at (${row}, ${column}):`,
        error.message
      );
      throw error;
    }
  }

  async getGoalMap() {
    try {
      const response = await axios.get(
        `${this.baseURL}/map/${this.candidateId}/goal`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get goal map:', error.message);
      throw error;
    }
  }
}

module.exports = MegaverseAPI;
