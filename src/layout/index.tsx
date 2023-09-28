import { useGlobalStore } from '~/stores/global';
import Content from './content';
import Header from './header';
import './index.css'
import Slide from './slide';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { antdUtils } from '~/utils/antd';
import { App } from 'antd';
const BasicLayout : React.FC = () => {
    const { lang,token } = useGlobalStore();

    const navigate = useNavigate()

    const {message, notification, modal} = App.useApp()
    useEffect(() => {
      antdUtils.setMessageInstance(message)
      antdUtils.setNotificationInstance(notification)
      antdUtils.setModalInstance(modal)
    }, [message, notification, modal])

    useEffect(() => {
      if(!token) {
        navigate('/login')
      }
    }, [navigate, token])

   

    return (
        <div key={lang} className='bg-primary overflow-hidden'>
        <Header />
        <Slide/>
        <Content>
        </Content>
      </div>
       
    )
}

export default BasicLayout