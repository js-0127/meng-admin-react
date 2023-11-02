import { Dropdown, Tabs } from "antd"
import { MenuItemType } from "antd/es/menu/hooks/useItems"
import React, { useCallback, useMemo } from "react"
import { antdIcons } from "~/assets/antd-icons"
import { KeepAliveTab, useTabs } from "~/hooks/use-tabs"
import {router} from "~/router"
import { KeepAliveTabContext } from "../tabs-context"


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
                label: '刷新',
                key: OperationType.REFRESH,
              },
              keepAliveTabs.length <= 1 ? null : {
                label: '关闭',
                key: OperationType.CLOSE,
              },
              keepAliveTabs.length <= 1 ? null : {
                label: '关闭其他',
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
      return (
         keepAliveTabs.map(tab => 
         {
            return {
               key:tab.key,
               label: renderTabTitle(tab),
               children:(
                <div className="px-[16px]" key={tab.key}>
                    {tab.children}
                </div>
               ),
               closable: keepAliveTabs.length > 1
            }
         }
         )
      )

   }, [keepAliveTabs])

   
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
         <Tabs
        hideAdd
        activeKey={activeTabRoutePath}
        type='editable-card'
        items={tabItems}
        onChange={onTabsChange}
        onEdit={onEditTab}
        size="small"
     />
        </KeepAliveTabContext.Provider>
    )
}

export default TabsLayout
