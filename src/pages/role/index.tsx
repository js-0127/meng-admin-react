import { useEffect, useRef, useState } from 'react';
import { useAntdTable } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { t } from '~/utils/i18n';
import {
  Space,
  Table,
  Form,
  Row,
  Col,
  Input,
  Button,
  Modal,
  FormInstance,
  Divider,
  Popconfirm,
} from 'antd';
import { antdUtils } from '~/utils/antd';
import roleService, { Role } from './service';
import NewAndEditForm from './new-edit-form';
import RoleMenu from './role-menu';
import { WithAuth } from '~/components/with-auth';

const rolePage = () => {
    const [form] = Form.useForm();
    const {tableProps, search: {submit, reset}} = useAntdTable(roleService.getRoleListByPage, {form})
    const [editData, setEditData] = useState<Role | null>(null)
    const [saveLoading, setSaveLoading] = useState<boolean>(false)
    const [roleMenuVisible, setRoleMenuVisible] = useState<boolean>(false)
    const [curRoleId, setCurRoleId] = useState<string | null>()
    const [formOpen, setFormOpen] = useState<boolean>(false)
    const formRef = useRef<FormInstance>(null)
    
    const CreateButton = WithAuth('role:create')(Button)
    const SerchButton = WithAuth('role:search')(Button)
    useEffect(() => {
      if(tableProps.dataSource){
        
      }
    })
    const columns: any[] = [
        {
            title: t('LhjNVSoc'),
            dataIndex: 'name'
        },
        {
            title: t('QjaYSPaK'),
            dataIndex: 'code',
            valueType: 'text',
        },
        {
            title: t('TMuQjpWo'),
            dataIndex: 'createdAt',
            hideInForm: true,
            search: false,
            valueType: 'dateTime',
            width: 190,
            render: (value: Date) => {
                return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
            } 
        },
        {
            title: t('QkOmYwne'),
            dataIndex: 'id',
            hideInForm: true,
            width: 240,
            align: 'center',
            search: false,
            render: (id: string, record: Role) => (
              
              <Space
                split={(
                  <Divider type='vertical' />
                )}
              >
                <a
                  onClick={() => {      
                    setCurRoleId(id);
                    setRoleMenuVisible(true);
                    
                  }}
                >
                  {t('QpaYSPaR')}
                </a>
                <a
                  onClick={async() => {
                    setEditData(record);
                    openForm()
                     await roleService.getRoleMenus(id)
                    
                  }}
                >
                 {t('qEIlwmxC')}
                </a>
                <Popconfirm
                   cancelText={t('QapYSPaT')}
                   okText={t('QbaYSPaU')}
                   title={t('nlZBTfzL')}
                   onConfirm={async () => {
                    const [error] = await roleService.removeRole(id);
                    if (!error) {
                      antdUtils.message?.success(t('bvwOSeoJ'));
                      submit();
                    }
                  }}
                  placement="topRight"
                >
                  <a className="select-none">
                   {t('HJYhipnp')}
                  </a>
                </Popconfirm>
              </Space>
            ),
          },
    ]
    
    const openForm = () => {
        setFormOpen(true)
    }
   
    const closeForm = () => {
        setFormOpen(false);
        setEditData(null);
      };
    
      const saveHandle = () => {
        submit();
        setFormOpen(false);
        setEditData(null);
      };
      return (
        <div>
            <Form
               onFinish={submit}
               form={form}
               size='large'
               className='dark:bg-[rgb(33,41,70)] bg-white p-[24px] rounded-lg'
            >
                <Row
                   gutter={24}
                >
                       <Col className='w-full' lg={24} xl={8}>
                        <Form.Item name="code" label={t('QjaYSPaK')}>
                              <Input onPressEnter={submit} />
                        </Form.Item>
                       </Col>
                       <Col className='w-full' lg={24} xl={8}>
                        <Form.Item name="name" label={t('LhjNVSoc')}>
                              <Input onPressEnter={submit} />
                        </Form.Item>
                       </Col>

                       <Col className='w-full' lg={24} xl={8}>
                         <Space>
                            <SerchButton onClick={submit} type="primary">
                            {t('YHapJMTT' /* 搜索 */)}
                            </SerchButton>
                            <Button onClick={reset} type="primary">
                            {t('uCkoPyVp' /* 清除 */)}
                            </Button>
                         </Space>
                       </Col>
                </Row>
            </Form>

            <div className='mt-[16px] dark:bg-[rgb(33,41,70)] bg-white rounded-lg px-[12px]'>
                <div className='py-[16px]'>
                    <CreateButton 
                       onClick={openForm}
                       type='primary'
                       size='large'
                       icon={<PlusOutlined />}
                       >
                           {t('morEPEyc' /* 新增 */)}
                       </CreateButton>
                </div>

                <Table
                   rowKey="id"
                   scroll={{x: true}}
                   columns={columns}
                   className='bg-transparent'
                   {...tableProps}
                >

                </Table>
            </div>

            <Modal
               title={editData ? t('wXpnewYo' /* 编辑 */) : t('VjwnJLPY' /* 新建 */)}
               open={formOpen}
               onOk={() => {
                formRef.current?.submit()
               }}
               cancelText={t('QapYSPaT')}
               okText={t('QbaYSPaU')}
               destroyOnClose
               onCancel={closeForm}
               confirmLoading={saveLoading}
            >
             <NewAndEditForm
              ref={formRef}
              editData={editData}
              onSave={saveHandle}
              open={formOpen}
              setSaveLoading={setSaveLoading}
           />
     
        </Modal>

        <RoleMenu
        onCancel={() => {
          setCurRoleId(null); 
          setRoleMenuVisible(false);
        }}
        roleId={curRoleId}
        visible={roleMenuVisible}
      />
        </div>
      )

}

export default rolePage