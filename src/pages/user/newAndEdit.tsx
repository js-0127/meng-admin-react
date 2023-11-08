import { forwardRef, useImperativeHandle, ForwardRefRenderFunction, useMemo, useEffect, useState } from 'react'
import { Form, Input, Radio, App, FormInstance, Select } from 'antd'
import { t } from '~/utils/i18n';
import { useRequest } from '~/hooks/use-request';
import userService, { User } from './service';
import { Role } from '../role/service';
import Avatar from './avatar';
import EmailInput from './mail';


interface PropsType {
    open: boolean;
    editData?: any;
    onSave: () => void;
    setSaveLoading: (loading: boolean) => void;
  }

const NewAndEditForm:ForwardRefRenderFunction<FormInstance, PropsType> = ({
    editData,
    onSave,
    setSaveLoading,
}, ref) => {
    const [form] = Form.useForm()
    const {message} = App.useApp()
    const {runAsync: updateUser} = useRequest(userService.updateUser, {manual: true})
    const {runAsync: addUser} = useRequest(userService.addUser, {manual: true})
    const {runAsync: getAllRoles}  =  useRequest(userService.getAllRoles, {manual: true})
    const [getRolesLoding, setGetRolesLoding] = useState<boolean>(false)
    const [roles, setRoles] = useState<Role[] | null>([])

    useImperativeHandle(ref, () => form, [form])

    const finishHandle = async(values: User) => {
        try {
            setSaveLoading(true);
            if(values.avatar?.[0]?.response) {  
              if(values.avatar?.[0]?.response?.filePath){
                values.avatar = values.avatar?.[0]?.response.filePath
              } else if(values.avatar?.[0]?.url){
                values.avatar = values.avatar?.[0]?.url
              } 
            } else {
              values.avatar = null
            }
            if(editData) {
              const [error] = await updateUser({...editData, ...values})
              setSaveLoading(false);
              if(error) {
                return 
              }
                message.success(t("NfOSPWDa" /* 更新成功！ */))
            } else {
              const [error] = await addUser(values)
              setSaveLoading(false);
              if(error) {
                return 
              }
                message.success(t("JANFdKFM" /* 创建成功！ */));
            }
            onSave()

        } catch (error:any) {
          message.error(error?.response?.data?.message) 
        }
        setSaveLoading(false)
    }
   
    const getRolesData = async () => {
      setGetRolesLoding(true)
      const [_, data] = await getAllRoles()
     
      setRoles(data)
      setGetRolesLoding(false)
    }

    useEffect(() => {
      getRolesData()
    }, []) 

    const initialValues = useMemo(() => {
       if(editData) {
        return {
          ...editData,
          avatar: editData.avatar ? [{
            uid: '-1',
            name: editData.fileEntity[0].fileName,
            states: 'done',
            url: editData.fileEntity[0].filePath,
            response: {
              id: editData.fileEntity[0].id,
            }, 
          }] : [],
          roleIds: (editData.user_Role || []).map((roleId:string) => roleId)
        }
       }
    }, [editData])

    return (
        <Form 
          labelCol={{sm:{span: 24}, md: {span: 5}}}
          wrapperCol={{sm: {span: 24}, md: {span: 16}}}
          form={form}
          onFinish={finishHandle}
          initialValues={initialValues || {sex: 1}}
        >
         
          <Form.Item label={t('QbaYSPlL')} name="avatar">
            <Avatar />
          </Form.Item>

           <Form.Item 
            label={t("qYznwlfj" /* 用户名 */)}
            name='userName'
            rules={[{
                required: true,
                message: t("iricpuxB" /* 不能为空 */),
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item 
            label={t("rnyigssw" /* 昵称 */)}
            name='nickName'
            rules={[{
                required: true,
                message: t("iricpuxB" /* 不能为空 */),
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
        label={t("SPsRnpyN" /* 手机号 */)}
        name="phoneNumber"
        rules={[{
          required: true,
          message: t("UdKeETRS" /* 不能为空 */),
        }, {
          pattern: /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[89])\d{8}$/,
          message: t("AnDwfuuT" /* 手机号格式不正确 */),
        }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("XWVvMWig" /* 邮箱 */)}
        name="email"
        rules={[{
          required: true,
          message: t("QFkffbad" /* 不能为空 */),
        }, {
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: t("EfwYKLsR" /* 邮箱格式不正确 */),
        }]}
      >
       <EmailInput disabled={!!editData} />
      </Form.Item>

      <Form.Item 
         name="emailCaptcha" label={t('QgaYSPab')} rules={[{required: true,}]}
      >
        <Input  />
      </Form.Item>
      <Form.Item
        label={t("ykrQSYRh" /* 性别 */)}
        name="sex"
      
      >
        <Radio.Group>
          <Radio value={1}>{t("AkkyZTUy" /* 男 */)}</Radio>
          <Radio value={0}>{t("yduIcxbx" /* 女 */)}</Radio>
        </Radio.Group>
      </Form.Item>
        
         <Form.Item 
           label={t('QgaYSPac')}
           name="user_Role"
         >
          <Select 
             options= {(roles || []).map(role => ({
              label: role.name,
              value: role.id
             }))}

             mode='multiple'
             loading={getRolesLoding}
          >
          </Select>
         </Form.Item>

        </Form>
    )
}

export default forwardRef(NewAndEditForm)
  
