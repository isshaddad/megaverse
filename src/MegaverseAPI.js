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
}

module.exports = MegaverseAPI;
