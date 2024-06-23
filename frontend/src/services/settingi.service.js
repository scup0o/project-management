import createApiClient from "./api.service";

class SettingiService {
  constructor(baseUrl = "/api/settingi") {
    this.api = createApiClient(baseUrl);
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getAll(id) {
    return (await this.api.get(`/all/${id}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(data) {
    return (await this.api.put(`/`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async updateServer(data) {
    return (await this.api.put(`/server/update`, data)).data;
  }

  async deleteServer(id) {
    return (await this.api.delete(`/server/delete/${id}`)).data;
  }
  /*async addServer(data) {
    return (await this.api.post(`/server/add`, data)).data;
  }*/
}

export default new SettingiService();
