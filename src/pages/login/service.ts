import axios from "axios"

export interface LoginDTO {
    accountNumber: string;
    password: string;
    captchaId: string;
    captcha: string;
    publicKey: string;
  }

  export interface TokenDTO {
    expire: number;
    token: string;
    refreshExpire: number;
    refreshToken: string;
  }


export interface captchaDto {
    id: string
    data: string
    time: Date
}

const loginService = {
    //登录
    login: (loginDto:LoginDTO) => {
        return axios.post<TokenDTO>('api/auth/login', loginDto)
    },

    //获取验证码
    getCaptcha: () => {
        return axios.get<captchaDto>('/api/auth/captcha')
    },

    //获取公钥
    getPublicKey: () => {
        return axios.get<string>('/api/auth/publicKey')
    }

}

export default loginService