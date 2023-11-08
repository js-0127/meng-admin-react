import React, {useState, useEffect} from "react";
import { Modal, Spin, Tree, Radio } from 'antd';
import { DataNode, TreeProps } from "antd/es/tree";
import { antdUtils } from '~/utils/antd';
import { useRequest } from "~/hooks/use-request";
import roleService from './service';
import { Menu } from "../menu/service";
import { t } from "i18next";

interface RoleMenuProps {
    visible: boolean;
    onCancel: () => void;
    roleId?: string | null;
    onSave?: (checkedKeys: string[]) => void;
  }

const RoleMenu: React.FC<RoleMenuProps> = ({
    visible,
    onCancel,
    roleId,
    onSave
}) => {

    const [saveLoading, setSaveLoading] = useState<boolean>(false)
    const [treeData, setTreeData] = useState<DataNode[]>([])
    const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
    const [checkedKeys, setCheckedKeys] = useState<string[]>([])
    const [selectType, setSelectType] = useState('allChildren')
    const {runAsync: getRoleMenus} = useRequest(roleService.getRoleMenus, {manual: true})

    const getAllChildrenKeys = (children: any[], keys: string[]): void => {
        (children || []).forEach((node) => {
            keys.push(node.key)
            getAllChildrenKeys(node.children, keys)
        })
    }


    const getFirstChildrenKeys = (children: any[], keys: any[]):void => {
        (children || []).forEach((node) => {
            keys.push(node.key)
        })
    }

    const onCheck:TreeProps['onCheck'] = (_:any,{ checked, node }: any) => {
        const keys =  [node.key]     
        if(selectType === 'allChildren'){
            getAllChildrenKeys(node.children, keys)
        } else if(selectType === 'firstChildren') {
            getFirstChildrenKeys(node.children, keys)
        }

        if(checked) {
               setCheckedKeys((pre) => [...pre, ...keys])
               
        } else {
            setCheckedKeys((pre) => pre.filter(o => !keys.includes(o)))
        }
    }

    const formatTree = (roots: Menu[] = [], group: Record<string, Menu[]>): DataNode[] => {
        return roots.map((node) => {
            return {
                key: node.id,
                title: node.name,
                children: formatTree(group[node.id] || [], group)
            } as DataNode
        })
    }

     const getData = async() => {
         setGetDataLoading(true)  
         const [error, data] = await roleService.getAllMenus()
         
         if(!error) {
            const group = data.reduce<Record<string, Menu[]>>((pre:any, cur:any) => {
                if(!cur.parentId) {
                    return pre
                }
                if(pre[cur.parentId]){ 
                    pre[cur.parentId].push(cur)
                } else {
                    pre[cur.parentId] = [cur]
                }
                return pre
            }, {})
             
            
            const roots = data.filter((o: any) => !o.parentId)

            const newTreeData = formatTree(roots, group)

             setTreeData(newTreeData)             
            
         }
         setGetDataLoading(false)
     }
   
     const getCheckedKeys = async () =>{
            if(!roleId) return; 
            
            const [error, data] = await getRoleMenus(roleId)     
              if(!error) {
                setCheckedKeys(data)
              }
     }

    const save = async() => {
        if(onSave) {
            onSave(checkedKeys)
            return;
        }
        if(!roleId) return;

        setSaveLoading(true)
        
        const [error] = await roleService.setRoleMenus(checkedKeys, roleId)
        setSaveLoading(false)

        if(!error){
            antdUtils.message?.success(t('QgaYSPah'))
            onCancel()
        }
    }

    useEffect(() => {
        if(visible) {
           getData()
           getCheckedKeys()
                     
        } else {
            setCheckedKeys([])
        }
         
    }, [visible])
    return (
        <Modal
           title={t('QpaYSPaR')}
           open={visible}
           cancelText={t('QapYSPaT')}
           okText={t('QbaYSPaU')}
           onCancel={() => {
            onCancel()
           }} 
           width={640}
           onOk={save}
           confirmLoading={saveLoading}
           bodyStyle={{height: 400, overflowY: 'auto', padding:'20px 0'}}
        >
          {
          getDataLoading ? 
          <Spin/> 
          :  (
            <div>
                <label>{t('QgaYSPad')}</label>
                <Radio.Group
                   onChange={(e) => setSelectType(e.target.value)}
                   defaultValue="allChildren"
                   optionType="button"
                   buttonStyle="solid"
                   className="ml-[10px]"
                >
                    <Radio value="allChildren">{t('QgaYSPae')}</Radio>
                    <Radio value="current">{t('QgaYSPaf')}</Radio>
                    <Radio value="firstChildren">{t('QgaYSPag')}</Radio>
                </Radio.Group>

                <div className="mt-[16px]">

                    <Tree
                       checkable
                       onCheck={onCheck}
                       checkStrictly
                       treeData={treeData}
                       checkedKeys={checkedKeys}
                       className="py-[10px]"
                       />
                </div>
            </div>
          ) 
          } 
        </Modal>
    )
}

export default RoleMenu