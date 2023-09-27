import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import BasicLayout from '~/layout';
import Result404 from '~/pages/404';
import Login from '~/pages/login';
import { routeConfig } from './routeConfig';

const  Router = () => {
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
	return (
	    <RouterProvider router={router} />
	)
}

export default Router