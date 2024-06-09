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

    async register(data) {
        return (await this.api.post("/register",data)).data;
    }

    async get(id){
        return (await this.api.get(`/${id}`)).data;
    }

    async getAll(){
        return (await this.api.get("/all/user")).data;
    }

    async delete(id){
        return (await this.api.delete(`/${id}`)).data
    }

    async update(id,data){
        return (await this.api.put(`${id}`,data)).data
    }

    async changePassword(id,data){
        return (await this.api.put(`/change/${id}`,data)).data
    }

    async forgotPassword(data){
        return (await this.api.post('/forgot',data)).data
    }

    /*async findByEmailOrUsername(data){
        return (await this.api.post("/find", data)).data;
    }*/
}

export default new UserService();