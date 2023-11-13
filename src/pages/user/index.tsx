import {  useRef, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { useAntdTable } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import { 
  Space,
  Table,
  Form,
  Row,
  Col,
  Input,
  Button,
  Popconfirm,
  App,
  Modal,
  FormInstance,
  Avatar,
} from 'antd'
import { IconBuguang } from '~/assets/icons/buguang';
import { t } from '~/utils/i18n';
import {useRequest} from '~/hooks/use-request'
import userService, { User } from './service';

import NewAndEditForm from './newAndEdit';
import { WithAuth } from '~/components/with-auth';
import { useUserStore } from '~/stores/global/user';

const UserPage = () => {
    const [form] = Form.useForm()
    const {message} = App.useApp()
    const {tableProps, search: {submit, reset}} = useAntdTable(userService.getUserListByPage, {defaultPageSize: 10,form})
    const {runAsync: deleteUser} = useRequest(userService.deleteUser, {manual: true})
    const [editData, setEditData] = useState<User | null>(null)
    
    const [saveLoding, setSaveLoding] = useState(false)
    const CreateButton = WithAuth('user:create')(Button)
    const SearchButton = WithAuth('user:search')(Button)

    const {currentUser} = useUserStore()
    const formRef = useRef<FormInstance>(null)
 
    const columns: ColumnsType<any> = [
        {
            title: t('QbaYSPlL'),
            dataIndex: 'avatar',
            render: (value: string) => (
              
              <div className='flex justify-center'>
                {value ? (
                  <img src={value} className='w-[40px] h-[40px] flex items-center rounded-[50%]' />
                ) : (
                  <Avatar className='bg-[gold] align-middle flex items-center justify-center w-[40px] h-[40px]' icon={<IconBuguang />} />
                )}
              </div>
            ),
            align: 'center',
            width: 100,
          },
        {
            title: t('qYznwlfj'), /*用户名*/
            dataIndex: 'userName'
        },
        {
            title: t('gohANZwy'), /*昵称*/
            dataIndex: 'nickName'
        },
        {
            title: t("yBxFprdB" /* 手机号 */),
            dataIndex: 'phoneNumber',
        },
        {
            title: t("XWVvMWig" /* 邮箱 */),
            dataIndex: 'email',
          },
          {
            title: t("ykrQSYRh" /* 性别 */),
            dataIndex: 'sex',
            render: (value: number) => value === 1 ? t("AkkyZTUy" /* 男 */) : t("yduIcxbx" /* 女 */),
          },
          {
            title: t("TMuQjpWo" /* 创建时间 */),
            dataIndex: 'createdAt',
            render: (value: number) => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            title: t("QkOmYwne" /* 操作 */),
            key: 'action',
            render: (_,record) => (
                <Space size="middle">
                    <a onClick={() => {
                        setEditData(record)
                        setFormOpen(true)
                    }}>
                        {t("qEIlwmxC"  /*编辑 */)}
                    </a>
                     {currentUser?.userName !== record.userName && (
                       <Popconfirm
                       title={t("JjwFfqHG" /* 警告*/ )}
                       cancelText={t('QapYSPaT')}
                       okText={t('QbaYSPaU')}
                       description={t("nlZBTfzL" /* 确认删除这条数据？ */)}
                       onConfirm={async () => {
                          const [error] =  await deleteUser(record.id);
                          if(!error){
                           message.success(t("bvwOSeoJ" /* 删除成功！ */))
                           submit();
                          }
                       }}
                       >
                          <a>{t("HJYhipnp" /* 删除 */)}</a> 
                       </Popconfirm>
                     )}
                    
                </Space>
            )
          }
      
    ]

    const [formOpen, setFormOpen] = useState(false)

    const openForm = () => {
        setFormOpen(true)
    }

    const closeForm = () => {
        setFormOpen(false);
        setEditData(null);
    }

    const saveHandle = () => {
       submit()
       setFormOpen(false)
       setEditData(null)
    }

    return (
        <div>
            <Form onFinish={submit} form={form} size="large" className='dark:bg-[rgb(33,41,70)] bg-white p-[24px] rounded-lg'>
                <Row gutter={24}>
                    <Col lg={16} xl={8}>
                       <Form.Item name='nickName' label={t("rnyigssw" /* 昵称 */)}>
                         <Input onPressEnter={submit} />
                       </Form.Item>
                    </Col>
                    <Col lg={16} xl={8}>
                       <Form.Item name="phoneNumber" label={t("SPsRnpyN" /* 手机号 */)}>
                         <Input onPressEnter={submit} />
                       </Form.Item>
                    </Col>
                    <Col lg={24} xl={8}>
                       <Space>
                         <SearchButton onClick={submit} type='primary'>{t("YHapJMTT" /* 搜索 */)}</SearchButton>
                         <Button onClick={reset}>{t("uCkoPyVp" /* 清除 */)}</Button>
                       </Space>
                    </Col>
                </Row>
            </Form>
        
            <div className='mt-[16px] dark:bg-[rgb(33,41,70)] bg-white rounded-lg px-[12px]'>
                <div className='py-[16px]'>
                    <CreateButton onClick={openForm} type='primary' size='large' icon={<PlusOutlined/> }>{t("morEPEyc" /* 新增 */)}</CreateButton>

                </div>
                <Table
                rowKey="id"
                scroll={{x: true}}
                columns={columns}
                className='bg-transparent'
                {...tableProps}
                />
            </div>
            <Modal
               title={editData ? t("wXpnewYo" /* 编辑 */) : t("VjwnJLPY" /* 新建 */)}
               open={formOpen}
               onOk={() => {
                formRef.current?.submit()
               }}
               cancelText='取消'
               okText="确认"
               destroyOnClose
               width={640}
               zIndex={999}
               onCancel={closeForm}
               confirmLoading={saveLoding}
            >
            <NewAndEditForm
               ref={formRef}
               editData={editData}
               onSave={saveHandle}
               open={formOpen}
               setSaveLoading={setSaveLoding}
            />
            </Modal>

            
        </div>
    )

}
export default UserPage