import { useAntdTable } from "ahooks"
import { Form, Row, Col, Input, Space, Button, Table, Badge } from "antd"
import dayjs from "dayjs"
import type { ColumnsType } from "antd/es/table"
import { t } from "~/utils/i18n"
import { LoginLogService } from "./service"

export const LoginLog = () => {
    const [form] = Form.useForm()
    const {tableProps, search: {submit, reset}} = useAntdTable(LoginLogService.getUserListByPage, {form}) 
    const columns: ColumnsType<any> = [
        {
            title: t('qYznwlfj'), /*用户名*/
            dataIndex: 'userName'
        },
        {
            title: '登录ip',
            dataIndex: 'ip'
        },
        {
            title: '登录地址',
            dataIndex: 'address',
        },
        {
            title: '浏览器',
            dataIndex: 'browser',
          },
          {
            title: '操作系统',
            dataIndex: 'os',
          },
          {
            title: '登陆状态',
            dataIndex: 'status',
            render: (value: boolean) => 
              value ? (
                <Badge status="success" text="成功">
                </Badge>
              ) : (
                <Badge status="error" text="失败"></Badge>
              )

          },
          {
            title: '登录信息',
            dataIndex: 'message',  
          },

          {
            title: '登陆时间',
            dataIndex: 'createAt',
            render: (value: number) => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          },
    ]

     return  (
        <div>
        <Form 
           form={form} 
           onFinish={submit}
           size="large" className='dark:bg-[rgb(33,41,70)] bg-white p-[24px] rounded-md'>
          <Row gutter={24}>
            <Col className='w-full' lg={24} xl={8} >
              <Form.Item name="userName" label={t("qYznwlfj" /* 用户名 */)}>
                <Input />
              </Form.Item>
            </Col>
            <Col className='w-full text-right' lg={24} xl={8}>
              <Space>
               <Button onClick={submit} type='primary'>{t("YHapJMTT" /* 搜索 */)}</Button>
                <Button onClick={reset}>{t("uCkoPyVp" /* 清除 */)}</Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <div className="mt-[16px] dark:bg-[rgb(33,41,70)] rounded-md">
          <Table 
             scroll={{ x: true }} 
             columns={columns} 
             {...tableProps} 
             rowKey="id"
             className='bg-transparent' />
        </div>
      </div>
     )
}

export default LoginLog