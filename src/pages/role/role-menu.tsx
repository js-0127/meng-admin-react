import React, {useState, useEffect} from "react";
import { Modal, Spin, Tree, Radio } from 'antd';
import { antdUtils } from '~/utils/antd';
import roleService from './service';
import { DataNode } from "antd/es/tree";
import { Menu } from "../menu/service";
import { useRequest } from "~/hooks/use-request";

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
    const [selectedKeys, setSelectedKeys] = useState<any>([])

    const {runAsync: getRoleMenus} = useRequest(roleService.getRoleMenus, {manual: true})


    const getAllChildrenKeys = (children: any[], keys: string[]): void => {
        (children || []).forEach((node) => {
            keys.push(node)
            console.log(keys);
            getAllChildrenKeys(node.children, keys)
        })
    }


    const getFirstChildrenKeys = (children: any[], keys: any[]):void => {
        (children || []).forEach((node) => {
            
            keys.push(node.key)
            console.log(keys);
            
        })
    }

    // const onCheck:TreeProps['onCheck'] = (checkedKeys, info) => {
    //     // const keys =  [node.key]
    //     // if(selectType === 'allChildren'){
    //     //     getAllChildrenKeys(node.children, keys)
    //     // } else if(selectType === 'firstChildren') {
    //     //     getFirstChildrenKeys(node.children, keys)
    //     // }

    //     // if(checkd) {
    //     //        setCheckedKeys((pre) => [...pre, ...keys])
    //     // } else {
    //     //     setCheckedKeys((pre) => pre.filter(o => !keys.includes(o)))
    //     // }
    //     console.log(checkedKeys, info);
    // }
    

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
            console.log(data);
            
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
            antdUtils.message?.success('分配成功')
            onCancel()
        }
    }

    const onCheck = (checkedKeysValue: any, info:any) => {
        console.log('onCheck', checkedKeysValue, info);
        setCheckedKeys(checkedKeysValue);
      };
    
      const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log('onSelect', selectedKeysValue, info);
        setSelectedKeys(selectedKeysValue);
      };


    useEffect(() => {
        if(visible) {
            console.log(111);
           getData()
           getCheckedKeys()
          
                     
        } else {
            setCheckedKeys([])
        }
         
    }, [visible])
    return (
        <Modal
           title='分配菜单'
           open={visible}
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
                <label>选择类型</label>
                <Radio.Group
                   onChange={(e) => setSelectType(e.target.value)}
                   defaultValue="allChildren"
                   optionType="button"
                   buttonStyle="solid"
                   className="ml-[10px]"
                >
                    <Radio value="allChildren">所有子级</Radio>
                    <Radio value="current">当前</Radio>
                    <Radio value="firstChildren">一级子级</Radio>
                </Radio.Group>

                <div className="mt-[16px]">

                    <Tree
                       checkable
                       onCheck={onCheck}
                       treeData={treeData}
                       checkedKeys={checkedKeys}
                    //    checkStrictly
                       onSelect={onSelect}
                       selectedKeys={selectedKeys}
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