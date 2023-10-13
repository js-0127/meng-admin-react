import { PageData } from '~/interface';
import request from '~/request';

export interface Menu {
  parentId?: string;
  name?: string;
  icon?: string;
  type?: number;
  route?: string;
  filePath?: string;
  orderNumber?: number;
  url?: string;
  show?: boolean;
  id: string;
  _loaded_?: boolean;
  hasChild?: boolean;
  children?: Menu[] | null;
}

export interface Api {
  id?: string;
  path: string;
  method: string;
}

export interface MenuApi {
  id?: string;
  menuId: string;
  path: string;
  method: string;
}

const menuService = {
    getMenusByPage: async (
      {current, pageSize}: {current: number; pageSize: number},
      formData?: any
    ) => {
      return request.get<PageData<Menu>>('/api/menu/page', {
        params: {
          page: current - 1,
          size: pageSize,
          ...formData,
        },
      })
    },
    
    removeMenu: async(value: any) => {
        return request.delete('api/menu', value)
    },
    getChildren: (parentId: string) => {
        return request.get<Menu[]>('/api/menu/children', {params: {parentId}});
      },
}

export default menuService