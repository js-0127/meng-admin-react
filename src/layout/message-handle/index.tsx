import { useEffect } from "react";
import { toLoginPage } from "~/router";
import loginService from "~/pages/login/service";
import { useGlobalStore } from "~/stores/global";
import { useMessageStore } from "~/stores/global/message";
import { SocketMessageType } from "~/socket/message";
import { antdUtils } from "~/utils/antd";


const MessageHandle = () => {
    const {latestMessage} = useMessageStore()
    const {refreshToken, setToken} = useGlobalStore()
    
    const messageHandleMap = {
        [SocketMessageType.PermissionChange]: () => {
            antdUtils.modal?.warning({
                title: '权限变更',
                content: '由于你的权限发生更改,需要重新刷新页面',
                onOk: () => {
                    window.location.reload()
                }
            })
        },
        [SocketMessageType.PasswordChange] : () => {
            const hiddenModal = antdUtils.modal?.warning({
                title: '密码重置',
                content: '密码已经重置,需要重新登录',
                onOk: () => {
                    toLoginPage();
                    if(hiddenModal){
                        hiddenModal.destroy()
                    }
                }

            })
        },
        [SocketMessageType.TokenExpire]: async() => {
             const [error, data] = await loginService.rerefshToken(refreshToken)
             if(!error) {
                setToken(data.token)
             } else {
                toLoginPage()
             }
        }
    }

    useEffect(() => {
        if(latestMessage && messageHandleMap[latestMessage?.type]) {
            messageHandleMap[latestMessage?.type]()
        }
    }, [latestMessage])

    return null
}

export default MessageHandle