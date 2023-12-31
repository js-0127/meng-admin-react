import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Button, Form, Input } from 'antd';
import { useRequest } from "~/hooks/use-request";
import userService from './service';
import { t } from "~/utils/i18n";

interface PropsType {
    value?: string
    onChange?: ChangeEventHandler
    disabled?:boolean
}

const EmailInput: React.FC<PropsType> = ({
    value, 
    onChange,
    disabled
}) => {
    const [timer, setTimer] = useState<number>(0)
    const form = Form.useFormInstance()
    const intervalTimerRef = useRef<number>()


    const {runAsync} = useRequest(userService.sendEmailCaptcha, {manual:true})


    const sendEmailCaptcha = async() => {
        const values = await form.validateFields(['email']);
        setTimer(180)
        await runAsync(values.email);

        intervalTimerRef.current = window.setInterval(() => {
                 setTimer(pre => {
                    if(pre - 1  === 0) {
                        window.clearInterval(intervalTimerRef.current)
                    }
                    return pre - 1
                 })
        }, 1000)
    }


    useEffect(() => {
        return () => {
            if(intervalTimerRef.current){
                window.clearInterval(intervalTimerRef.current)
            }
        }
    }, [])


    return (
        <div className="flex items-center gap-[12px]">
            <Input disabled={disabled} onChange={onChange} value={value} className="flex-1" />
            {!disabled && (
             <Button className="flex-1" disabled={timer < 0} onClick={sendEmailCaptcha}>
                {timer > 0 ? `${t('QeaYSPaZ')}${timer}${t('QgaYSPaa')}` : t('QeaYSPaY')}
             </Button>
            )}
        </div>
    )
}

export default EmailInput

