import axios,
  {
   AxiosInstance,
   AxiosRequestConfig,
   AxiosResponse,
   CreateAxiosDefaults,
   InternalAxiosRequestConfig
  } from "axios";

import { useGlobalStore } from "~/stores/global";
import { antdUtils } from "~/utils/antd";

export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>;

class Requeset {

    private axiosInstance:AxiosInstance
    constructor(config?: CreateAxiosDefaults){
        this.axiosInstance = axios.create(config)

        this.axiosInstance.interceptors.request.use(
            (axiosConfig: InternalAxiosRequestConfig) => this.requestInterceptor(axiosConfig)
        )
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse<unknown, unknown>) => this.responseSuccessInterceptor(response),
            (error: any) => this.responseErrorInterceptor(error)
        )
    }

    private async requestInterceptor(axiosConfig: InternalAxiosRequestConfig){
         const {token} = useGlobalStore.getState();
           // 为每个接口注入token

           if(token) {
            axiosConfig.headers.Authorization = `Bearer ${token}`
           }

           return Promise.resolve(axiosConfig)
    } 

    private async responseSuccessInterceptor(response: AxiosResponse<any, any>):Promise<any>{
        return Promise.resolve([
            false,
            response.data,
            response
        ])
    }

    private async responseErrorInterceptor(error:any):Promise<any>{
        const {status} = error?.response || {}

        if(status === 401) {
              // TODO 刷新token
        } else {
            antdUtils.notification?.error({
                message: '出错了',
                description: error?.response?.data?.message
            })
        }
        return Promise.resolve([true, error?.response?.data]);
    }

    requset<T, D = any>(config: AxiosRequestConfig<D>):Response<T>{
        return this.axiosInstance(config)
    }

    get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T>{
        return this.axiosInstance.get(url, config)
    }

    post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T>{
        return this.axiosInstance.post(url, data, config)
    }

    put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T>{
        return this.axiosInstance.put(url, data, config)
    }
    
    delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
        return this.axiosInstance.delete(url, config);
      }
}

const request = new Requeset({timeout: 30000})

export default request