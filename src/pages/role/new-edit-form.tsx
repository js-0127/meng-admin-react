import { forwardRef, useImperativeHandle, ForwardRefRenderFunction, useState } from 'react'
import { Form, Input, FormInstance } from 'antd'
import {t} from '~/utils/i18n'
import { antdUtils } from '~/utils/antd';
import { useRequest } from '~/hooks/use-request';
import roleService, { Role } from './service';
import RoleMenu from './role-menu';

interface PropsType {
    open: boolean;
    editData?: Role | null;
    onSave: () => void;
    setSaveLoading: (loading: boolean) => void;
  }
  
const NewAndEditForm: ForwardRefRenderFunction<FormInstance, PropsType> = ({
    editData,
    onSave,
    setSaveLoading
}, ref) => {
     const [form] = Form.useForm()

     const {runAsync:updateRole} = useRequest(roleService.updateRole, {manual: true})
     const {runAsync: addRole} = useRequest(roleService.addRole, {manual: true})
     const [roleMenuVisible, setRoleMenuVisible] = useState<boolean>(false)
     const [menuIds, setMenuIds] = useState<string[]>()
     useImperativeHandle(ref, () => form, [form])

     const finishHandle = async(values: Role) => {
        setSaveLoading(true)

        if(editData) {
            const [error] = await updateRole({...editData, ...values, menuIds})
            if(error){
                return 
            }
            setSaveLoading(false)
            antdUtils.message?.success(t("NfOSPWDa" /* 更新成功！ */))
        } else {
            const [error] = await addRole({...values, menuIds})
            if(error){
                return 
            }
            setSaveLoading(false)
            antdUtils.message?.success(t("JANFdKFM" /* 创建成功！ */));

     }
     onSave();

    }

     return (
        <Form
           form={form}
           labelCol={{sm: {span: 24}, md: {span: 5}}}
           wrapperCol={{sm: {span: 24}, md: {span: 16}}}
           onFinish={finishHandle}
           initialValues={editData || {}}
           name='addAndEdit'
        >
        <Form.Item
           label={t('QjaYSPaK')}
           name="code"
           rules={[{
            required: true,
            message: t("jwGPaPNq" /* 不能为空 */),
           }]}
        >
             <Input disabled={!!editData}/>
        </Form.Item>
        
        <Form.Item
        label={t('LhjNVSoc')}
        name="name"
        rules={[{
          required: true,
          message: t("iricpuxB" /* 不能为空 */),
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
         label={t('QpaYSPaR')}
         name="menus"
      >
        <a onClick={() => {
            setRoleMenuVisible(true)
        }}>{t('QpaYSPaS')}</a>
        
      </Form.Item>
     <RoleMenu
        onSave={(menuIds: string[]) => {
          setMenuIds(menuIds)
          setRoleMenuVisible(false)
        }
      }
      visible={roleMenuVisible}
      onCancel={() => {
        setRoleMenuVisible(false)
      }}
      roleId={editData?.id}
     />
        </Form>
     )
}

export default forwardRef(NewAndEditForm)