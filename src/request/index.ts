import axios,
  {
   AxiosInstance,
   AxiosRequestConfig,
   AxiosResponse,
   CreateAxiosDefaults,
   InternalAxiosRequestConfig
  } from "axios";
import loginService from "~/pages/login/service";

import { useGlobalStore } from "~/stores/global";
import { antdUtils } from "~/utils/antd";
import {toLoginPage} from '~/router'
export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>;


const refreshTokenUrl = '/api/auth/refresh/token'
class Requeset {
   
    private axiosInstance:AxiosInstance
    private refreshTokenFlag = false
    private requestQueue: {resolve: any, config: any, type: 'request' | 'response'}[] = []
    private limit = 3
    private requestingCount = 0
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

    setLimit(limit: number) {
        this.limit = limit;
    }


    private async requestInterceptor(axiosConfig: InternalAxiosRequestConfig):Promise<any>{
        if(this.refreshTokenFlag || this.requestingCount >= this.limit) {
            return new Promise(resolve => {
                this.requestQueue.push({
                    resolve,
                    config: axiosConfig,
                    type: 'request'
                })
            })
        }
        this.requestingCount += 1;
         const {token} = useGlobalStore.getState();
           // 为每个接口注入token
           if(token) {
            axiosConfig.headers.Authorization = `Bearer ${token}`
           }
           return Promise.resolve(axiosConfig)
    } 

    private async responseSuccessInterceptor(response: AxiosResponse<any, any>):Promise<any>{
        if(response.config.url !== refreshTokenUrl){
            this.requestingCount -= 1
        }

        if(this.requestQueue.length) {
            this.requestByQueue()
        }
        return Promise.resolve([
            false,
            response.data,
            response
        ])
    }

    private async responseErrorInterceptor(error:any):Promise<any>{
        const {status, config} = error?.response || {}
        
        if(status === 401) {
              // TODO 刷新token
              return new Promise(resolve => {
                this.requestQueue.push({
                    resolve,
                    config,
                    type: 'response'
                })

                 //如果没有在刷新token,需要去刷新
              if(!this.refreshTokenFlag){
                this.refreshToken()
              }
              })
             
        } else {            
            antdUtils.notification?.error({
                message: '出错了',
                description: error?.response?.data?.message
            })
        }
        return Promise.resolve([true, error?.response?.data]);
    }

    private async refreshToken(){
        //准备刷新token,把标记设置为true

        this.refreshTokenFlag = true
        const {refreshToken, setToken, setRefreshToken} = useGlobalStore()

        //如果刷新token不存在跳转登录页

        if(!refreshToken) {
            this.toLoginPage()
        }
        //调刷新接口
        const [error, data] = await loginService.rerefshToken(refreshToken)
        if(error) {
            this.toLoginPage()
        }
        setToken(data.token)
        setRefreshToken(refreshToken)
        this.refreshTokenFlag = false

        this.requestByQueue()

        //回放队列里的接口，不能用for循环，因为又await,使用for,会让a回放变成同步执行
        Array
          .from({length: this.requestQueue.length})
          .forEach(async() => {
            const request = this.requestQueue.shift()
            if(request) {
                const {config, resolve, type} = request;
                //如果响应401,取到config再次请求一下
                if(type === 'response'){
                    resolve(await this.requset(config))
                    this.requestingCount += 1
                } else if(type === 'request'){
                        //如果在请求遇到拦截器拦截，只需要执行resolve方法，把config放进去，需要把新的token放进去
                        config.headers.Authorization = `Bearer ${data.token}`
                        resolve(config)
                }
            }
          })
    }

    private async requestByQueue(){
        if(!this.requestQueue.length) {
            return 
        }
        console.log(this.limit - this.requestingCount, 'count');
        
    }

   private toLoginPage(){
    toLoginPage()
    this.reset()
   }

   private reset(){
    this.refreshTokenFlag = false
    this.requestQueue = []
    this.requestingCount = 0
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