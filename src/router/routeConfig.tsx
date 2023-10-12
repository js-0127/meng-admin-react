import {DashboardOutlined, TableOutlined} from '@ant-design/icons';
import { lazy } from 'react';
 
export interface MenuItem {
    path: string;
    title?: string;
    icon?: any;
    element?: any;
    children?: MenuItem[];
    layout?: boolean;
    Component?:any,
    handle?:any
}

export const routeConfig: MenuItem[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        icon: <DashboardOutlined />,
        Component: lazy(() => import('~/pages/dashboard')),
        handle: {
          path: '/dashboard'
        }

    },
    {
        path: '/user',
        title: 'User',
        icon: <TableOutlined />,
        Component: lazy(() => import('~/pages/user')),
        handle: {
            path: '/user'
          }
    },
]