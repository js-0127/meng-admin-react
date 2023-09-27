import {DashboardOutlined, TableOutlined} from '@ant-design/icons';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';


export interface MenuItem {
    path: string;
    title?: string;
    icon?: any;
    element?: any;
    children?: MenuItem[];
    layout?: boolean;
    Component?:any
}

export const routeConfig: MenuItem[] = [
    {
        path: '/dashboard',
        title: 'Dashboard',
        icon: <DashboardOutlined />,
        Component: lazy(() => import('~/pages/dashboard'))

    },
    {
        path: '/user',
        title: 'User',
        icon: <TableOutlined />,
        Component: lazy(() => import('~/pages/user'))

    },
    {
        path: '/',
        element: <Navigate to='/dashboard' />
    }
]