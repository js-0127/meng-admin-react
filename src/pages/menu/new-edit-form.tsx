import React, {useState, useEffect} from 'react'
import { Form, Input, InputNumber, Modal, Radio, Select, Switch } from 'antd';
import { antdIcons } from '~/assets/antd-icons';
import { componentPaths } from '~/config/routes';
import { antdUtils } from '~/utils/antd';
import { MenuType } from './interface';
import menuService, { Menu } from './service';
import { t } from '~/utils/i18n';

interface CreateMemuProps {
    visible: boolean;
    onCancel: (flag?: boolean) => void;
    parentId?: string;
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
        values.show = values.type === MenuType.DIRECTORY ? true :values.show === 'true' ? true : false


        if(editData) {
            values.parentId = editData.parentId
            const [error] = await menuService.updateMenu({...editData, ...values})
            if(!error) {
                antdUtils?.message?.success(t('NfOSPWDa'))
                onSave()
            }
        } else {
            console.log(values);
            const [error] = await menuService.addMenu(values)
           
            if(!error) {
                antdUtils.message?.success(t('QgaYSPaj'))
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
          title={editData ? t('qEIlwmxC') : t('morEPEyc')}
          cancelText={t('QapYSPaT')}
          okText={t('QbaYSPaU')}
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
            type: MenuType.DIRECTORY,
            show: 'true'
           }}
        >
          <Form.Item label={t('QkaYSPaL')} name="type">
               <Radio.Group 
               optionType='button'
               buttonStyle='solid'
               >
               <Radio value={MenuType.DIRECTORY}>{t('QcaYSPaV')}</Radio>
               <Radio value={MenuType.MENU}>{t('QdaYSPaW')}</Radio>
               </Radio.Group>
            </Form.Item>  

             <Form.Item 
                label={t('LhjNVSoc')}
                name="name"
                required
                >
                    <Input />
             </Form.Item>

             <Form.Item label={t('QlaYSPaM')} name="icon" required>
                 <Select>
                    {Object.keys(antdIcons).map((key: React.Key) => (
                        <Select.Option key={key}>{React.createElement(antdIcons[key])}</Select.Option>
                    ))}
                 </Select>
             </Form.Item>

             <Form.Item  
                tooltip="以/开头, 不用手动拼接上级路由。参数格式:/id"
                label={t('QmaYSPaN')}
                name="route"
                required
                rules={[{
                    pattern: /^\//,
                    message: '必须以/开头'
                }]}
             >
                   <Input />
             </Form.Item>
               

             <Form.Item noStyle shouldUpdate required>
                   {() => (
                    form.getFieldValue("type") === 2 && (
                        <Form.Item
                           label={t('QnaYSPaO')}
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
             
                 <Form.Item noStyle shouldUpdate >
                     {() => (
                        form.getFieldValue('type') === 2 && (
                            <Form.Item
                               valuePropName='checkd'
                               label={t('QdaYSPaX')}
                               name="show"
                            >
                                <Switch defaultChecked onChange={onChangeShow}  />
                            </Form.Item>
                        )
                     )}
                 </Form.Item>

                 <Form.Item label={t('QoaYSPaP')} name="orderNumber" required>
                    <InputNumber />
                 </Form.Item>

            </Form>       
        </Modal>
    )
}

export default NewAndEditForm

