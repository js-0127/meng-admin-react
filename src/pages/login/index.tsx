import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { JSEncrypt } from "jsencrypt"
import { Button, Carousel, Form, Input, Modal } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { useGlobalStore } from "~/stores/global"
import { IconBuguang } from "~/assets/icons/buguang"
import { IconYanzhengma } from "~/assets/icons/yanzhengma"

import { t } from "~/utils/i18n"
import { antdUtils } from "~/utils/antd"
import { useRequest } from "~/hooks/use-request"
import loginService, { LoginDTO } from "./service"

import './index.css'


const Login = () => {
  
  const navigate = useNavigate()
  const {setToken, setRefreshToken} = useGlobalStore()
  const { data: captcha, refresh: refreshCaptcha } = useRequest(loginService.getCaptcha);
  const {runAsync: login, loading} = useRequest(loginService.login, {manual: true})
  const {runAsync: getPublicKey} = useRequest(loginService.getPublicKey, {manual: true})


  const [emailResetPasswordOpen, setEmailResetPasswordOpen ] = useState<boolean>(false)
  const [emailInputFocus,setEmailInputFocus] = useState<boolean>(false)
  const [checkEmail,setCheckEmail] = useState<string>()

  const {loading: resetPasswordBtnLoading, runAsync:sendResetCheckEmail} = useRequest(loginService.sendCheckEmail, {manual: true})
  
  const onFinish = async(values:LoginDTO) =>{
    if(!captcha?.data){
      return ;
    }
    //获取公钥
   const [error, publicKey] = await getPublicKey()
   if (error) {
    return;
  }
   // 使用公钥对密码加密
   const encrypt = new JSEncrypt()
   encrypt.setPublicKey(publicKey)
   const password = encrypt.encrypt(values.password)
   if(!password) {
    return;
   }
   values.password = password
   values.publicKey = publicKey
      const [loginError, data] = await login(values)
      if(loginError) {
        return
      }
      setToken(data.token)
      setRefreshToken(data.refreshToken)
      navigate('/')
      antdUtils.message?.success(
         t('QgaYSPaq')
      )
    } 

  const sendCheckEmail = async() => {
        if(!checkEmail) {
          antdUtils.message?.error(
           t('QgaYSPar')
          )
          return 
        } 
        const [error] = await sendResetCheckEmail(checkEmail) 

        if(!error){
          antdUtils.message?.success(t('QgaYSPas'));
          setEmailResetPasswordOpen(false);
        }
  }

    return (
      <div className="bg-primary bg-[rgb(238,242,246)]  flex justify-center items-center h-screen">
        <div className='flex-[2.5] flex justify-center'>
          <div className='dark:bg-[rgb(33,41,70)] w-[94%] px-[32px] py-[20px] mx-auto bg-white rounded-lg  lg:mt-[-12%] lg:w-[400px]'>
           <div className="text-center">
                  <div className="flex justify-center gap-2 ">
                          <IconBuguang className="text-[20px] text-blue-500"></IconBuguang>
                          <h1 className="dark:(text-white)" style={{marginBottom: '0.2em'}}>meng-admin</h1>
                  </div>
                  <h3 className="dark:text-white text-[rgba(0,0,0,.45)] mb-[1em] text-[14px] font-normal">
                  {t("wbTMzvDM" /* 一个高颜值后台管理系统 */)}
                  </h3>
           </div>
           <Form 
             name='super-admin'
             className="login-form"
             initialValues={{accountNumber: 'test', password: '123456'}}
             onFinish={onFinish}
             size="large"
           >
           <Form.Item
              name='accountNumber'
              rules={[{required:true, message:t("wVzXBuYs" /* 请输入账号 */)}]}
           >
               <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder={t("RNISycbR" /* 账号 */)}    
                  size="large"         
               >
               </Input>
           </Form.Item>
           <Form.Item
              name="password"
              rules={[{ required: true, message: t("DjMcEMAe" /* 请输入密码 */) }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder={t("HplkKxdY" /* 密码 */)}
              />
            </Form.Item>
            <Form.Item
               name="captcha"
               rules={[{required:true, message:t('QgaYSPaz')}]}            
            >
             <Input
                prefix={<IconYanzhengma className="text-[20px] " />}
                placeholder={t('QgaYSPaA0')}
                suffix={
                ( <div 
                  className="cursor-pointer " 
                  dangerouslySetInnerHTML={{__html: captcha?.data as string}}
                  onClick={refreshCaptcha} 
                />)
                }
             >
             </Input>
            </Form.Item>
            
            <Form.Item noStyle style={{marginBottom: 0}}>
              <div className="text-right mb-[18px]">
                <a onClick={() => {
                  setEmailResetPasswordOpen(true)
                }} className="text-[16px] !text-[rgb(124,77,255)] select-none" type="link" >{t('QgaYSPap')}</a>
              </div>

            </Form.Item>

            <Form.Item style={{ marginBottom: 18 }}>
              <Button
                type="primary"
                loading={loading}
                block
                htmlType='submit'
              >
                {t("dDdqAAve" /* 登录 */)}
              </Button>
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
                    一个高颜值后台管理系统
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
                    一个高颜值后台管理系统
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
                    一个高颜值后台管理系统
                  </div>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>

      <Modal 
         title={t('QgaYSPau')}
         open={emailResetPasswordOpen}
         footer={null}
         width={400}
         cancelText={t('QapYSPaT')}
         okText={t('QbaYSPaU')}
         maskClosable={false}
         bodyStyle={{padding: '20px', position: 'relative'}}
         style={{top: 240}}
         onCancel={() => {
          setEmailResetPasswordOpen(false)
         }}
      >
        {!emailInputFocus && (
          <img className="absolute top-[-139px] left-[calc(50%-67px)]"
          src="https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/ad7fa76844a2df5c03151ead0ce65ea6.svg"
           />
        )}
        {emailInputFocus && (
          <img
          className='absolute top-[-139px] left-[calc(50%-67px)]'
          src='https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/500c1180a96859e5c54a5359f024a397.svg'
        />
        )}
       
       <Input 
         size="large"
         placeholder={t('QgaYSPaA1')}
         onBlur={() => {setEmailInputFocus(false)}}
         onFocus={() => {setEmailInputFocus(true)}}
         onChange={(e) => {
          setCheckEmail(e.target.value)
         }} 
        />
        <Button
          className="mt-[16px]"
          type="primary"
          block
          onClick={sendCheckEmail}
          loading={resetPasswordBtnLoading}
        >
          {t('QgaYSPaA2')}
        </Button>
      </Modal>
        </div>
    )
        }

export default Login