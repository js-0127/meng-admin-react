import React, { useCallback,  useMemo,  } from "react"
import { Dropdown } from "antd"
import { MenuItemType } from "antd/es/menu/hooks/useItems"

import {router} from "~/router"
import { antdIcons } from "~/assets/antd-icons"
import { KeepAliveTab, useTabs } from "~/hooks/use-tabs"
import { KeepAliveTabContext } from "../tabs-context"
import DraggableTab from "~/components/draggable-Tab"
import { t } from "~/utils/i18n"


enum OperationType {
   REFRESH = 'refresh',
   CLOSE = 'close',
   CLOSEOTHER = 'close-other',
 }

 const TabsLayout:React.FC = () => {
   
   const {activeTabRoutePath, keepAliveTabs, closeTab, refreshTab, closeOtherTab} = useTabs()


   const getIcon = (icon?: string):React.ReactElement | undefined => {
          return icon && antdIcons[icon] && React.createElement(antdIcons[icon])
         }
   
   const menuItems: MenuItemType[] = useMemo(
            () => [
              {
                label: t('QgaYSPal'),
                key: OperationType.REFRESH,
              },
              keepAliveTabs.length <= 1 ? null : {
                label: t('QgaYSPak'),
                key: OperationType.CLOSE,
              },
              keepAliveTabs.length <= 1 ? null : {
                label: t('QgaYSPam'),
                key: OperationType.CLOSEOTHER,
              },
            ].filter(o => o !== null) as MenuItemType[],
            [keepAliveTabs]
          );
      
        const domEventMap = {
           [OperationType.REFRESH]: (routePath:string) => {refreshTab(routePath)},
           [OperationType.CLOSE]: (routePath:string) => {closeTab(routePath)},
           [OperationType.CLOSEOTHER]: (routePath:string) => {closeOtherTab(routePath)},
        }
      
         const menuClick = useCallback(({key ,domEvent}:any , tab:KeepAliveTab) => {
            
                 domEvent.stopPropagation();
                   //@ts-ignore
                 domEventMap[key] && domEventMap[key](tab.routePath)
      
         }, [closeOtherTab, closeTab, refreshTab])
      
         const renderTabTitle = useCallback((tab: KeepAliveTab) => {
                   return (
                     <Dropdown
                        menu={{
                           items:menuItems,
                           onClick:(e) => {
                              menuClick(e, tab)
                           },
                        }}
                        trigger={['contextMenu']}
                     >
                    <div style={{margin: '-12px 0', padding: '12px 0'}}>
                          {getIcon(tab.icon)}
                          {tab.title}
                    </div>
                     </Dropdown>
                   )
         }, [menuItems])
               

      const tabItems = useMemo(() => {
            return keepAliveTabs.map(tab => {
               return {
                 key: tab.routePath,
                 label: renderTabTitle(tab),
                 children: (
                   <div
                     key={tab.key}
                     className='px-[16px]'
                   >
                     {tab.children}
                   </div>
                 ),
                 closable: keepAliveTabs.length > 1, // 剩最后一个就不能删除了
               }
             })
          }, [keepAliveTabs]);
   

   const onTabsChange = useCallback((tabRoutePath:string) => {
      router.navigate(tabRoutePath)
   }, [])

   const onEditTab = (
      targetKey: React.MouseEvent | React.KeyboardEvent | string, 
      action: 'add' | 'remove') => {
      if(action === 'remove'){
         closeTab(targetKey as string)
      }
    };

    const keepAliveTabsValue = useMemo(() => {
        return {
           refreshTab,
           closeOtherTab,
           closeTab
        }
    }, [closeOtherTab, closeTab, refreshTab])

    return (
   <KeepAliveTabContext.Provider value={keepAliveTabsValue}>
     <DraggableTab
        hideAdd
        activeKey={activeTabRoutePath}
        type='editable-card'
        items={tabItems}
        onChange={onTabsChange}
        onEdit={onEditTab}
        size="small"
        tabBarGutter={2}
     />
        </KeepAliveTabContext.Provider>
    )
}

export default TabsLayout
