import { useGlobalStore } from '~/stores/global';
import Content from './content';
import Header from './header';
import './index.css'
import Slide from './slide';
import { Navigate, useNavigate } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import { antdUtils } from '~/utils/antd';
import { App } from 'antd';
import { useRequest } from '~/hooks/use-request';
import userService, { Menu } from '~/pages/user/service';
import { useUserStore } from '~/stores/global/user';
import GlobalLoading from '~/components/global-loading';
import Result404 from '~/pages/404';
import { components } from '~/config/routes';
import  { replaceRoutes, router } from '~/router';
const BasicLayout : React.FC = () => {
    const { lang,token, refreshToken } = useGlobalStore();
    const {currentUser , setCurrentUser} = useUserStore()
    const navigate = useNavigate()

    const {loading, data: currentUserDetail, run: getUserInfo} = useRequest(userService.getUserInfo, {manual: true})
     
    useEffect(() => {
      if (!refreshToken) {
        navigate('/login');
        return;
      }
      getUserInfo()

    }, [refreshToken, getUserInfo, navigate])

    useEffect(() => {
      setCurrentUser(currentUserDetail || null)
      
    }, [currentUserDetail, setCurrentUser])

     
    const {message, notification, modal} = App.useApp()
    useEffect(() => {
      antdUtils.setMessageInstance(message)
      antdUtils.setNotificationInstance(notification)
      antdUtils.setModalInstance(modal)
    }, [message, notification, modal])

    useEffect(() => {
      if(!token) {
        navigate('/login')
      }
    }, [navigate, token])


    const format = (
      menus: Menu[],
      menuGroup: Record<string, Menu[]>,
      routes: Menu[],
      parentMenu?: Menu
    ): Menu[] => {
      return menus.map((menu) => {
        const children = menuGroup[menu.id]

        const parentPaths = parentMenu?.parentPaths || [];
        const path = (parentMenu ? `${parentPaths[parentPaths.length - 1]}${menu.route}` : menu.route) || ''
        routes.push({...menu, path, parentPaths})

        return {
          ...menu,
          path,
          parentPaths,
          children: children?.length ? format(children, menuGroup, routes, {
            ...menu,
            parentPaths: [...parentPaths, path || ''].filter(item => item),
          }) : undefined
        }
      })
    }

      useEffect(() => {
        if(!currentUserDetail) return
        const {menus = []} = currentUserDetail

       const menuGroup = menus.reduce((pre: any, menu: any) => {
             if(!menu.parentId) {
              return pre
             }

             if(!pre[menu.parentId]){
              pre[menu.parentId] = []
             }

             pre[menu.parentId].push(menu)
             return pre
       }, {})
            
       const routes: Menu[] = []
       
       currentUserDetail.menus = format(menus.filter((item:any) =>!item.parentId), menuGroup, routes);
       
       replaceRoutes('*', [...routes.map(menu => ({
        path:`/*${menu.path}`,
        Component: menu.filePath ? lazy(components[menu.filePath]) : null,
        id: `/*${menu.path}`,
        handle: {
          parentPaths: menu.parentPaths,
          path:menu.path,
          name: menu.name,
          icon: menu.icon,
        }
       })),
       {
        path: '*',
        Component: Result404
       },
       {
        path: '/*/',
        element: (
          <Navigate to="/dashboard"/>
        )
       }
      ])

      console.log(router.routes);
      

      setCurrentUser(currentUserDetail)
    
      router.navigate(`${location.pathname}${location.search}`, {replace: true})
      
       
    }, [currentUserDetail, setCurrentUser])
  

    useEffect(() => {
      function storageChange(e: StorageEvent) {
            if(e.key === useGlobalStore.persist.getOptions().name) {
              useGlobalStore.persist.rehydrate()
            }
      } 
      window.addEventListener<'storage'>('storage',storageChange )

      return () => {window.removeEventListener('storage', storageChange)}
    }, [])

    if(loading || !currentUser) {
      return (
        <GlobalLoading />
      )
    }
    return (
        <div key={lang} className='bg-primary overflow-hidden'>
        <Header />
        <Slide/>
        <Content>
        </Content>
      </div>
       
    )
}

export default BasicLayout