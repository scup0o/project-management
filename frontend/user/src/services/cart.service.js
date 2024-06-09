import createApiClient from "./api.service";

class CartService {
    constructor(baseUrl = "/api/cart") {
        this.api = createApiClient(baseUrl);
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async create(data){
        return(await this.api.post("/",data)).data
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

}

export default new CartService();