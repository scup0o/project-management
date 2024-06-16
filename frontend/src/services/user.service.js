import createApiClient from "./api.service";

class UserService {
    constructor(baseUrl = "/api/user") {
        this.api = createApiClient(baseUrl);
    }

    async logout() {
        return (await this.api.get("/"));
    }

    async login(data) {
        return (await this.api.post("/login", data)).data;
    }

    async create(data) {
        return (await this.api.post("/add",data)).data;
    }

    async get(id){
        return (await this.api.post(`/${id}`)).data;
    }

    async getmnv(mnv){
        return (await this.api.get(`/${mnv}`)).data;
    }

    async getAll(){
        return (await this.api.get("/all")).data;
    }

    async delete(id){
        return (await this.api.delete(`/${id}`)).data
    }

    async update(data){
        return (await this.api.put(`/`,data)).data
    }

    async changePassword(data){
        return (await this.api.put(`/cp`,data)).data
    }

    async forgotPassword(data){
        return (await this.api.post('/forgot',data)).data
    }

    /*async findByEmailOrUsername(data){
        return (await this.api.post("/find", data)).data;
    }*/
}

export default new UserService();