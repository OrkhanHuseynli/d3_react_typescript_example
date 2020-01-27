import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
const ENDPOINT_UPLOAD = "/api/v1/upload";
const QUERY_ENDPOINT = "/api/v1/receive";

export default class RestClient {
    static post = (url: string, body: any, config: AxiosRequestConfig) : Promise<AxiosResponse> => {
        return axios({
            method: 'post',
            url: url,
            headers: {...config.headers},
            params: {...config.params}
        });
    };

    static get = (url: string, config: AxiosRequestConfig)  : Promise<AxiosResponse> => {
        return axios.get(url, config);
    };

    static sendFormData = (url: string, data: FormData, headers: Headers)  : Promise<AxiosResponse>  => {
       return  axios({
            method: 'post',
            url: url,
            data: data,
            headers: {'Content-Type': 'multipart/form-data', ...headers }
        });
    };
    static ENDPOINT_UPLOAD = ENDPOINT_UPLOAD;
    static QUERY_ENDPOINT = QUERY_ENDPOINT;
}