import createApiClient from "./api.service";

class OrderService {
    constructor(baseUrl = "/api/order") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async find(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    
    async create(data){
        return(await this.api.post("/",data)).data
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
}

export default new OrderService();