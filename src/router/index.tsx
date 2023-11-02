import { Navigate, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import BasicLayout from '~/layout';
import Login from '~/pages/login';
import { App } from 'antd';
import { useEffect } from 'react';
import { antdUtils } from '~/utils/antd';
import RouterErrorElement from '~/router-error-element';

export const router = createBrowserRouter(
    [
      {
        path: '/login',
        Component: Login,
      },
      // {
      //   path: '/user/reset-password',
      //   Component: ResetPassword,
      // },
      {
        path: '/',
        element: (
          <Navigate to="/dashboard" />
        ),
      },
      {
        path: '*',
        Component: BasicLayout,
        children: [],
        errorElement: <RouterErrorElement />
      },
    ]
  );
  
  export const toLoginPage = () => {
    router.navigate('/login');
  }
  
  
  function findNodeByPath(routes: RouteObject[], path:string){
    for(let i = 0; i < routes.length; i++){
      const element = routes[i]
      if(element.path === path) return element;

      findNodeByPath(element.children || [], path)
    }
  }

  export const addRoutes = (parentPath: string, routes: RouteObject[]) => {
        if(!parentPath){
          router.routes.push(...routes as any)
          return;
        }
        const curNode = findNodeByPath(router.routes, parentPath)

        if(curNode?.children){
          curNode.children.push(...routes)
        } else if(curNode){
          curNode.children = routes
        }
  }


  export const replaceRoutes = (parentPath: string, routes:RouteObject[]) => {
    if (!parentPath) {
      router.routes.push(...routes as any);
      return;
    }
     const curNode = findNodeByPath(router.routes, parentPath);

    if (curNode) {
    curNode.children = routes;
  }
  }
	
 

  const Router = () => {
    const {notification, message, modal} = App.useApp()

    useEffect(() => {
      antdUtils.setMessageInstance(message);
      antdUtils.setNotificationInstance(notification);
      antdUtils.setModalInstance(modal)
    }, [notification, message, modal])

    return (
	    <RouterProvider router={router} />
	)
  }

export default Router