import createApiClient from "./api.service";

class SettingiService {
  constructor(baseUrl = "/api/settingi") {
    this.api = createApiClient(baseUrl);
  }

  /*async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }*/

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

    async addDiary(data) {
      return (await this.api.post(`/diary/add`, data)).data;
    }
  
    async getDiary(id) {
      return (await this.api.get(`/diary/get/${id}`)).data;
    }

    async updateDiary(data) {
      return (await this.api.put(`/diary/update`, data)).data;
    }
  
    async deleteDiary(id) {
      return (await this.api.delete(`/diary/delete/${id}`)).data;
    }
    
}

export default new SettingiService();
