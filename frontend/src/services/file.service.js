import createApiClient from "./api.service";

class FileService {
  constructor(baseUrl = "/api/file") {
    this.api = createApiClient(baseUrl);
  }
  async exportData(id){
    return (await this.api.get(`/file/export/${id}`)).data
  }

  async upload(filename, data) {
    return (await this.api.post(`/upload/${filename}`, data)).data;
  }

  async get(data) {
    return (await this.api.post(`/doc/`,data)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(data) {
    return (await this.api.put(`/update/`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new FileService();
