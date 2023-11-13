import { useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import JSEncrypt from "jsencrypt"
import { LockOutlined } from "@ant-design/icons"
import { Form, Input, Button, Carousel } from "antd"
import { t } from "~/utils/i18n"
import { antdUtils } from "~/utils/antd"
import { getParamsBySearchParams } from "~/utils/util"
import { useRequest } from "~/hooks/use-request"
import loginService, { ResetPasswordDTO } from "./service"

const ResetPassword = () => {

    const navigate = useNavigate()
    const {runAsync: getPublicKey} = useRequest(loginService.getPublicKey, {manual:true})
    const { runAsync: resetPassaword, loading } = useRequest(loginService.resetPassaword, { manual: true });
    const [query] = useSearchParams()

    useEffect(() => {
        const params = getParamsBySearchParams(query);
        if(!params.email || !params.emailCaptcha) {
            antdUtils.message?.error(t('QgaYSPax'))
        }
    }, [query])

    const onFinish = async (values: ResetPasswordDTO) => {
        if (values.comfirmPassword !== values.password) {
          antdUtils.message?.error(t('QgaYSPay'));
          return;
        }
        // 获取公钥
        const [error, publicKey] = await getPublicKey();
        if (error) {
          return;
        }
        // 使用公钥对密码加密
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        const password = encrypt.encrypt(values.password);
        if (!password) {
          return;
        }

        const params = getParamsBySearchParams(query);
        values.password = password;
        values.publicKey = publicKey;
        values.email = params.email;
        values.emailCaptcha = params.emailCaptcha;
        const [resetPassawordError] = await resetPassaword(values);
        if (resetPassawordError) {
          return;
        }
        antdUtils.message?.success(t('QgaYSPaw'));
        navigate('/login');
      };
    
      
return (
    <div className="bg-primary  bg-[rgb(238,242,246)] flex justify-center items-center h-screen">
    <div className='flex-[2.5] flex justify-center'>
      <div className='dark:bg-[rgb(33,41,70)] w-[94%] px-[32px] py-[20px] mx-auto bg-white rounded-lg lg:mt-[-12%] lg:w-[400px]'>
        <div className='mb-[32px]'>
          <div className='flex gap-2'>
            <h2 className='text-[rgb(124,77,255)]' style={{ marginBottom: '0.6em' }}>{t('QgaYSPau')}</h2>
          </div>
          <div className='text-[16px]' >{t('QgaYSPav')}</div>
        </div>
        <Form
          name="super-admin"
          className="login-form"
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="password"
            rules={[{ required: true, message: t("DjMcEMAe" /* 请输入密码 */) }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder={t("HplkKxdY" /* 密码 */)}
              size="large"
              type="password"
            />
          </Form.Item>
          <Form.Item
            name="comfirmPassword"
            rules={[{ required: true, message: t("DjMcEMAe" /* 请输入密码 */) }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={t('QgaYSPat')}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 18 }}>
            <Button
              type="primary"
              loading={loading}
              block
              htmlType='submit'
            >
              {t('QbaYSPaU')}
            </Button>
          </Form.Item>
          <Form.Item noStyle style={{ marginBottom: 0 }} >
            <div
              className='text-right mb-[18px]'
            >
              <Link to="/login" className='text-[16px] !text-[rgb(124,77,255)] select-none' type='link'>返回登录</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
    <div
      className='flex-[1.7] dark:bg-[rgb(33,41,70)] bg-white h-[100vh] relative hidden lg:block'
      style={{
        backgroundImage: 'url(/images/login-right-bg.svg)'
      }}
    >
      <div
        className='img1 w-[243px] h-[210px] bg-center absolute top-[23%] left-[37%]'
        style={{
          backgroundSize: 380,
          backgroundImage: 'url(/images/login-right-before.svg)'
        }}
      />
      <div
        className='img2 w-[313px] h-[280px] bg-center absolute top-[32%] left-[40%]'
        style={{
          backgroundSize: 380,
          backgroundImage: 'url(/images/login-right-after.svg)'
        }}
      />
      <div className='absolute left-[100px] right-[100px] bottom-[50px] h-[200px]'>
        <Carousel autoplay dots={{ className: 'custom' }}>
          <div>
            <div className='h-[160px] bg-transparent flex items-center justify-center'>
              <div>
                <h3 className='dark:text-[rgb(215,220,236)] text-[rgb(18,25,38)] text-[34px]'>
                meng-admin
                </h3>
                <div className='dark:text-[rgb(132,146,196)] text-[rgb(105,117,134)] text-[12px] my-[20px] '>
                {t('wbTMzvDM')}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='h-[160px] bg-transparent flex items-center justify-center'>
              <div>
                <h3 className='dark:text-[rgb(215,220,236)] text-[rgb(18,25,38)] text-[34px]'>
                  meng-admin
                </h3>
                <div className='dark:text-[rgb(132,146,196)] text-[rgb(105,117,134)] text-[12px] my-[20px]'>
                {t('wbTMzvDM')}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='h-[160px] bg-transparent flex items-center justify-center'>
              <div>
                <h3 className='dark:text-[rgb(215,220,236)] text-[rgb(18,25,38)] text-[34px]'>
                meng-admin
                </h3>
                <div className='dark:text-[rgb(132,146,196)] text-[rgb(105,117,134)] text-[12px] my-[20px] '>
                  {t('wbTMzvDM')}
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  </div>
)
}

export default ResetPassword