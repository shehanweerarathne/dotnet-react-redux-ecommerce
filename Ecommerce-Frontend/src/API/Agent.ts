import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import {PaginatedResponse} from "../models/Pagination";
import {store} from "../store/configureStore";


const sleep = () => new Promise(resolve => setTimeout(resolve, 500));


axios.defaults.baseURL = 'http://localhost:5194/api/';
axios.defaults.withCredentials = true;


const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const user = localStorage.getItem('user')
    if(user){
        const userJSON = JSON.parse(user);
        if(userJSON.token){
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${userJSON.token}`,
            };
        }
    }

    return config;
})
axios.interceptors.response.use(async response => {
    await sleep();
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedResponse(response.data,JSON.parse(pagination));
        return response
    }
    return response;
}, (error: AxiosError) => {
    // @ts-ignore
    const { data, status } = error.response;
    switch (status) {
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title || 'Unauthorized');
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string,params?: URLSearchParams) => axios.get(url,{params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('Products',params),
    details: (id: string | undefined) => requests.get(`Products/${id}`),
    fetchFilters:()=>requests.get('products/filters')
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
}
const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: string, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: string, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const Account = {
    login: (values:any) => requests.post('Account/Login',values),
    register: (values:any) => requests.post('Account/Register',values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress')
};
const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: string) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values)
}

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders
}

export default agent;

