import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Menu, MenuProps} from 'antd'
import type { ItemType } from "antd/es/menu/hooks/useItems";
import {Link, useMatches, useNavigate} from 'react-router-dom'

import { useGlobalStore } from "~/stores/global";
import { useUserStore } from '~/stores/global/user';
import {antdIcons} from '~/assets/antd-icons'
import {Menu as MenuType} from '~/pages/user/service'


const SLideMenu = () => {
    const matches = useMatches()

    const [openKeys, setOpenKeys] = useState<string[]>([])
    const [selectKeys, setSelectKeys] = useState<string[]>([])

    const {
        collapsed
    } = useGlobalStore()

   const {
    currentUser
   } = useUserStore()

    useEffect(() => {
        if(collapsed) {
            setOpenKeys([])
        } else { 
            const [macth] = matches || [];
            if(macth) {
                 // 获取当前匹配的路由，默认为最后一个
                const route = matches[matches.length - 1]
                  // 从匹配的路由中取出自定义参数
                const handle = route?.handle as any
                // 从自定义参数中取出上级path，让菜单自动展开
                setOpenKeys(handle?.parentPaths || [])
                // 让当前菜单和所有上级菜单高亮显示
                setSelectKeys([...(handle?.parentPaths || []), handle?.path] || [])

            }

        }
    },
    [matches, collapsed]
    )
    const getMenuTitle = (menu: MenuType) => {
        if(menu?.children?.filter(menu => menu.show) ?.length)  {
            return menu.name
        } else {
            return (
                <Link to={menu.route}>{menu.name}</Link>
            )
        }
    }

    const treeMenuData = useCallback((menus: MenuType[]) : ItemType[] => {
      return (menus).map((menu: MenuType) => {
        const children = menu?.children?.filter(menu => menu.show) || []
        
        return {
            key: menu.path,
            label: getMenuTitle(menu),
            icon: menu.icon && antdIcons[menu.icon] && React.createElement(antdIcons[menu.icon]),
            children: children.length ?  treeMenuData(children || []) : null
        }
        
      })  as ItemType[]
    }, []) 

    const menuData = useMemo(() => {
        return treeMenuData((currentUser?.menus as MenuType[]).filter((menu: any) => menu.show) || [])
    }, [currentUser])
     
      const navigate = useNavigate()
      const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
       navigate(key)
       
      }

    return (
        <Menu 
        className="bg-primary color-transition"
        mode="inline"
        selectedKeys={selectKeys}
        style={{height: '100%', borderRight: 0}}
        items={menuData}
        inlineCollapsed={collapsed}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        onClick={handleMenuClick}
        />
    )
}

export default SLideMenu;