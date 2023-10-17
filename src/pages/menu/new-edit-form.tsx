import React, {useState, useEffect} from 'react'
import { Form, Input, InputNumber, Modal, Radio, Select, Switch } from 'antd';
import menuService, { Menu } from './service';
import { antdUtils } from '~/utils/antd';
import { MenuType } from './interface';
import { antdIcons } from '~/assets/antd-icons';
import { componentPaths } from '~/config/routes';



interface CreateMemuProps {
    visible: boolean;
    onCancel: (flag?: boolean) => void;
    parentId?: number;
    onSave: () => void;
    editData?: Menu | null;
}


const NewAndEditForm : React.FC<CreateMemuProps> = (props) => {
    
    const {visible, onCancel, parentId, onSave, editData} = props

    const [saveLoding, setSaveLoding] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        if(visible) {
            if(editData){
                form.setFieldsValue(editData)
            }
        } else {
            form.resetFields()
        }
    }, [visible])

      
    const save = async (values:any) => {
        setSaveLoding(true)
        values.parentId = parentId || null
        values.show = values.type === MenuType.DIRECTORY ? true : values.show


        if(editData) {
            values.parentId = editData.parentId
            const [error] = await menuService.updateMenu({...editData, ...values})
            if(!error) {
                antdUtils?.message?.success('更新成功')
                onSave()
            }
        } else {
            const [error] = await menuService.addMenu(values)
            if(!error) {
                antdUtils.message?.success('新增成功')
                onSave()
            }
        }
        setSaveLoding(false)
    }
         

    const onChangeShow = (checkd:boolean) => {
             form.setFieldValue("show", checkd.toString())
    }

    return (
        <Modal
          open={visible}
          title='新建'
          onOk={() => {
            form.submit()
          }}
          confirmLoading={saveLoding}
          width={640}
          onCancel={() => {
            form.resetFields()
            onCancel()
          }}
          destroyOnClose

        >
        <Form
           form={form}
           
           onFinish={save}
           labelCol={{flex: '0 0 100px'}}
           wrapperCol={{span: 16}}
           initialValues={{
            type: MenuType.DIRECTORY
           }}
        >
          <Form.Item label="类型" name="type">
               <Radio.Group 
               optionType='button'
               buttonStyle='solid'
               >
               <Radio value={MenuType.DIRECTORY}>目录</Radio>
               <Radio value={MenuType.MENU}>菜单</Radio>
               </Radio.Group>
            </Form.Item>  

             <Form.Item label="名称" name="name">
                    <Input />
             </Form.Item>

             <Form.Item label="图标" name="icon">
                 <Select>
                    {Object.keys(antdIcons).map((key: React.Key) => (
                        <Select.Option key={key}>{React.createElement(antdIcons[key])}</Select.Option>
                    ))}
                 </Select>
             </Form.Item>

             <Form.Item  
                tooltip="以/开头, 不用手动拼接上级路由。参数格式:/id"
                label="路由"
                name="route"
                rules={[{
                    pattern: /^\//,
                    message: '必须以/开头'
                }]}
             >
                   <Input />
             </Form.Item>
               

             <Form.Item noStyle shouldUpdate>
                   {() => (
                    form.getFieldValue("type") === 2 && (
                        <Form.Item
                           label="文件地址"
                           name="filePath"
                        >
                            <Select
                               options={componentPaths.map(path => ({
                                label: path,
                                value: path
                               }))}
                            ></Select>
                        </Form.Item>
                    )
                   )}
             </Form.Item>
             
                 <Form.Item noStyle shouldUpdate>
                     {() => (
                        form.getFieldValue('type') === 2 && (
                            <Form.Item
                               valuePropName='checkd'
                               label="是否显示"
                               name="show"
                            >
                                <Switch defaultChecked onChange={onChangeShow}  />
                            </Form.Item>
                        )
                     )}
                 </Form.Item>

                 <Form.Item label="排序号" name="orderNumber">
                    <InputNumber />
                 </Form.Item>

            </Form>       
        </Modal>
    )
}

export default NewAndEditForm

