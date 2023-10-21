import request from '~/request'
import { Role } from '../role/service';

export interface Menu {
    id: string;
    parentId?: string;
    name?: string;
    icon?: string;
    type?: number;
    route: string;
    filePath?: string;
    orderNumber?: number;
    url?: string;
    show?: boolean;
    children?: Menu[];
    path?: string;
    Component?: any;
    parentPaths?: string[];
    authCode?: string;
  }

  export interface User {
    id: number;
    userName: string;
    nickName: string;
    phoneNumber: string;
    email: string;
    emailCaptcha?:string
    createDate: string;
    updateDate: string;
    avatar?: any;
    menus? :any
    
  }
  
 export interface pageData {
  data: User[]
  total: number
 } 


 const userService = {
   // 分页获取用户列表
   getUserListByPage: async({current, pageSize}: {current:number, pageSize: number}, formData:any) => {
     return request.get<pageData>('/api/user/list',  {
      params: {
        page: current,
        size: pageSize,
        ...formData
      }
    }).then(([error, pageData]) => {
      return ({
        list: pageData.data,
        total: pageData.total,
      })
    })
          
    },

   addUser: (data: User) => {
    return request.post('/api/user', data)
   },
   // 更新用户
  updateUser: (data: User) => {
    return request.put('/api/user', data);
  },
  // 删除用户
  deleteUser: (id: number) => {
    return request.delete(`/api/user/${id}`);
  },

  //获取当前用户信息
  getUserInfo: () => {
    return request.get<User>('/api/auth/current/user')
  },

  //发送邮箱验证吗
  sendEmailCaptcha: (email:string) => {
    return request.post('/api/user//send/email/captcha', {email})
  },

  //获取全部角色

  getAllRoles: () => {
    return request.get<Role[]>('/api/role')
  }

 }
 export default userService