import axios from "axios";

/*axios.interceptors.request.use(request => {
    const counter = useCartCounter()
    request.headers.Authorization = counter.authToken;
})*/
    const commonConfig = {
        headers: {
        "Content-Type": "application/json",
        'Content-Type' : 'image/png',
        'Content-Type': 'multipart/form-data',
        Accept: "application/json",
        },
    };

    /*const axiosClient = axios.create({
        baseURL: 'http://127.0.0.1:5678/res-api'
    });
    
    axiosClient.interceptors.request.use((config) => {
        const authStore = useAuthStore();
        config.headers.Authorization = `Bearer ${authStore.getToken}`;
        config.headers.Accept = "application/json";
        return config
    })*/
    
    export default (baseURL) => {
        return axios.create({
        baseURL,
        ...commonConfig,
    })/*.interceptors.request.use((config) => {
        const counter = useCartCounter();
        config.headers.Authorization = `Bearer ${counter.getToken}`;});*/
};