import axios from "axios";

class SandboxService {
  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async get(url, config = {}) {
    const configWithAuth = {...config, headers: { ...config?.headers, 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }};
    try {
      const { data: responseData } = await this.axiosInstance.get(url, configWithAuth);
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async post(url, data, config = {}) {
    const configWithAuth = {...config, headers: { ...config?.headers, 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }};
    try {
      const { data: responseData } = await this.axiosInstance.post(url, data, configWithAuth);
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async put(url, data, config = {}) {
    const configWithAuth = {...config, headers: { ...config?.headers, 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }};
    try {
      const { data: responseData } = await this.axiosInstance.put(url, data, configWithAuth);
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async delete(url, data = {}, config = {}) {
    const configWithAuth = {...config, headers: { ...config?.headers, 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }};
    try {
      await this.axiosInstance.delete(url, { ...configWithAuth, data });
    } catch (error) {
      throw error;
    }
  }
}

const sandboxService = new SandboxService(import.meta.env.VITE_API_BASE_URL);

export default sandboxService;