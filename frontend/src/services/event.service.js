import createApiClient from "./api.service";

class EventService {
  constructor(baseUrl = "/api/event") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(id_da) {
    return (await this.api.get(`/da/${id_da}`)).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
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
}

export default new EventService();
