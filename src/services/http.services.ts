import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const axiosConfig: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_BACKEND_API_BASE_URL,
    timeout: 15000
}

const instance:AxiosInstance = axios.create(axiosConfig);

instance.interceptors.request.use(function(config){
    return {
        ...config,
        withCredentials:true,
        headers:{Authorization: `Bearer ${"access_token"}`}
    }
}, function(error){
    return Promise.reject(error)
})

class Request {
    async get(url:string):Promise<AxiosResponse>{
        return instance.get(url).then(res=>res)
    }
    async post(url:string, body:any):Promise<AxiosResponse>{
        return instance.post(url,body).then(res=>res)
    }
    async update(url:string, body:any):Promise<AxiosResponse>{
        return instance.patch(url,body).then(res=>res)
    }
    async delete(url:string):Promise<AxiosResponse>{
        return instance.delete(url).then(res=>res)
    }
}

const httpReq = new Request();

export default httpReq;