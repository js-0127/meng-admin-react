import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import BasicLayout from '~/layout';
import Result404 from '~/pages/404';
import Login from '~/pages/login';
import { routeConfig } from './routeConfig';



  const router = createBrowserRouter(
    [
      {
        path: '/login',
        Component: Login,
      }, {
        path: '/',
        Component: BasicLayout,
        children: routeConfig,
      }, {
        path: '*',
        Component: Result404,
      }
    ]
  );
  
  export const toLoginPage = () => {
    router.navigate('/login');
  }
  

	
  const  Router = () => {
    return (
	    <RouterProvider router={router} />
	)
  }

export default Router