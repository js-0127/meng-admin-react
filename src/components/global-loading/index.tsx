import React from "react";
import './index.css'

const GlobalLoading:React.FC<any> = () => (
    <div className="w-screen h-screen flex justify-center items-center">
        <div className="loading transform translate-y-[-12vh]"></div>
    </div>
)

export default GlobalLoading