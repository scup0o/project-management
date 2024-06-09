import createApiClient from "./api.service";

class FavoriteService {
    constructor(baseUrl = "/api/favorite") {
        this.api = createApiClient(baseUrl);
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

}

export default new FavoriteService();