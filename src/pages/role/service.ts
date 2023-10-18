import { PageData } from '~/interface';
import request from '~/request'

export interface Role {
    id?: string;
    name: string;
    code: string;
  }



const roleService = {

    getRoleListByPage: async({current, pageSize}: {current:number, pageSize: number}, formData:any) => {
        return request.get<PageData<Role>>('/api/role/page',  {
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

    removeRole: async(id:number) => {
        return request.delete('/api/role', {params: id})
    },
    addRole: async(data:Role) => {
         return request.post('/api/role', data)
    },
    updateRole: async(role:Role) => {
       return request.put('/api/role', role)
    }
}

export default roleService