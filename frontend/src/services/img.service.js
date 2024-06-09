import createApiClient from "./api.service";

class GenreService {
    constructor(baseUrl = "/api/img") {
        this.api = createApiClient(baseUrl);
    }

    async upload(data) {
        return (await this.api.post("/",data)).data;
    }
}

export default new GenreService();