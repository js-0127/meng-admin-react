import { t } from '~/utils/i18n';
import { Form, Input, Radio, App, FormInstance } from 'antd'
import { forwardRef, useImperativeHandle, ForwardRefRenderFunction, useMemo, useEffect } from 'react'
import userService, { User } from './service';
import { useRequest } from 'ahooks';
import Avatar from './avatar';


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

    useImperativeHandle(ref, () => form, [form])

    const finishHandle = async(values: User) => {
        try {
            setSaveLoading(true);
            console.log(values.avatar?.[0]?.response);
            if(values.avatar?.[0]?.response?.pkValue) {
              values.avatar = values.avatar?.[0]?.response
            } else {
              values.avatar = null
            }
            
            if(editData) {
                await updateUser({...editData, ...values})
                message.success(t("NfOSPWDa" /* 更新成功！ */))
            } else {
                await addUser(values)
                message.success(t("JANFdKFM" /* 创建成功！ */));
            }
            onSave()

        } catch (error:any) {
          message.error(error?.response?.data?.message) 
        }
        setSaveLoading(false)
    }

    useEffect(() => {
      console.log(editData);
      
    }, []) 

    const initialValues = useMemo(() => {
       if(editData) {
        return {
          ...editData,
          avatar: editData.avatarEntity ? [{
            uid: '-1',
            name: editData.avatarEntity.fileName,
            states: 'done',
            url: editData.avatarEntity.filePath,
            response: {
              id: editData.avatarEntity.pkValue,
            }
          }] : []
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
         
          <Form.Item label="头像" name="avatar">
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
        <Input />
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
        </Form>
    )
}

export default forwardRef(NewAndEditForm)
  
