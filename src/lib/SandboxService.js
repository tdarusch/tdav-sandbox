import axios from "axios";

class SandboxService {
  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL
    });
  }

  async get(url, config = {}) {
    try {
      const { data: responseData } = await this.axiosInstance.get(url, config);
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async post(url, data, config = {}) {
    try {
      const { data: responseData } = await this.axiosInstance.post(url, data, config);
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async put(url, data, config = {}) {
    try {
      const { data: responseData } = await this.axiosInstance.post(url, data, config);
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async delete(url, data = {}, config = {}) {
    try {
      await this.axiosInstance.delete(url, { ...config, data });
    } catch (error) {
      throw error;
    }
  }
}

const sandboxService = new SandboxService(import.meta.env.VITE_API_BASE_URL);

export default sandboxService;