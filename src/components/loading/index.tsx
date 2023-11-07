import {useEffect} from 'react'
import {Spin} from 'antd';
import NProgress from 'nprogress'


export const Loading = () => {
    useEffect(() => {
       NProgress.start();
       
       return () => {
        NProgress.done()
       }
    }, [])

    return (
        <div className='flex justify-center'>
            <Spin/>
        </div>
    )
}
