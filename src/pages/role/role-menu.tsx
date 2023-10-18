import React, {useState, useEffect} from "react";
import { Modal, Spin, Tree, Radio } from 'antd';
import { antdUtils } from '~/utils/antd';
import roleService from './service';
import { DataNode } from "antd/es/tree";
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
    const [selectType, setSelectType] = useState('allChildren');
    const save = async() => {
           
        if(onSave) {
            onSave(checkedKeys)
            return;
        }

        if(!roleId) return;


    }

    return (
        <Modal
           title='分配菜单'
           open={visible}
           onCancel={() => {
            onCancel()
           }} 
           width={640}
           onOk={}
           confirmLoading={}
           bodyStyle={{height: 400, overflowY: 'auto', padding:'20px 0'}}
        >
       

        </Modal>
    )
}

export default RoleMenu