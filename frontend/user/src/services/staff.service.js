import createApiClient from "./api.service";

class StaffService {
    constructor(baseUrl = "/api/staff") {
        this.api = createApiClient(baseUrl);
    }

    async create(data) {
        return (await this.api.post("/",data)).data;
    }

    async get(id){
        return (await this.api.get(`/${id}`)).data;
    }

    async getAll(){
        return (await this.api.get("/")).data;
    }

    async delete(id){
        return (await this.api.delete(`/${id}`)).data
    }
    async update(id, data){
        return (await this.api.put(`/${id}`,data)).data
    }

    async changePassword(id,data){
        return (await this.api.put(`/change/${id}`,data)).data
    }
}

export default new StaffService();