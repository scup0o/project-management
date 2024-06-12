import createApiClient from "./api.service";

class FileService {
    constructor(baseUrl = "/api/file") {
        this.api = createApiClient(baseUrl);
    }

    async upload(filename, data) {
        return (await this.api.post(`/${filename}`,data)).data;
    }
}

export default new FileService();