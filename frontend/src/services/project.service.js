import createApiClient from "./api.service";

class ProjectService {
    constructor(baseUrl = "/api/project") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async getType(type){
        return (await this.api.get(`/type/${type}`)).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async create(data){
        return(await this.api.post("/",data)).data
    }

    async update(data) {
        return (await this.api.put(`/`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
}

export default new ProjectService();