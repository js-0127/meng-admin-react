import request from "~/request";
import {PageData} from '../../interface'

export interface loginLogResult {
    userName?: string
    os?: string
    browser?: string
    ip?: string
    address?: string
    createAt?: Date
    status?: boolean
    message?: string
}


export const LoginLogService = {
       // 分页获取用户列表
   getUserListByPage: async({current, pageSize}: {current:number, pageSize: number}, formData:any) => {
    return request.get<PageData<loginLogResult>>('/api/login-log/',  {
     params: {
       page: current,
       size: pageSize,
       ...formData
     }
   }).then(([_, pageData]) => {
     return ({
       list: pageData.data,
       total: pageData.total,
     })
   })
         
   },
}