import { PageData } from '~/interface';
import request from '~/request'
import { Menu } from '../menu/service';

export interface Role {
    id?: string;
    name: string;
    code: string;
  }
const roleService = {

    getRoleListByPage: async({current, pageSize}: {current:number, pageSize: number}, formData:any) => {
        return request.get<PageData<Role>>('/api/role/list',  {
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

    removeRole: async(id:string) => {
        return request.delete(`/api/role/${id}`,)
    },
    addRole: async(data:Role) => {
         return request.post('/api/role', data)
    },
    updateRole: async(role:Role) => {
       return request.put('/api/role', role)
    },

    getAllMenus:async () => {
      return request.get<Menu[]>('/api/menu')
    },

    getRoleMenus: async (roleId: string) => {
        return request.get<string[]>(`/api/role/menu/list/${roleId}`,)
    },

    setRoleMenus: (checkedKeys: string[], roleId:string) => {
      return request.post('/api/role/alloc/menu', {checkedKeys, roleId})
    }
}

export default roleService