import createApiClient from "./api.service";

class DoctypeService {
  constructor(baseUrl = "/api/doctype") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(type) {
    return (await this.api.get(`/all/${type}`)).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getType(type) {
    return (await this.api.get(`/type/${type}`)).data;
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

  async deleteAll(type) {
    return (await this.api.delete(`/dA/${type}`)).data;
  }
}

export default new DoctypeService();
