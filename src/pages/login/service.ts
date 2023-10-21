import request from "~/request";

export interface LoginDTO {
    accountNumber: string;
    password: string;
    captcha: string;
    publicKey: string;
  }

  export interface TokenDTO {
    expire: number;
    token: string;
    refreshExpire: number;
    refreshToken: string;
  }

  export interface ResetPasswordDTO {
    password: string;
    email: string;
    emailCaptcha: string;
    publicKey: string;
    comfirmPassword?: string;
  }

export interface captchaDto {
    id: string
    data: string
    time: Date
}

const loginService = {
    //登录
    login: (loginDto:LoginDTO) => {
        return request.post<TokenDTO>('/api/auth/login', loginDto)
    },

    //获取验证码
    getCaptcha: () => {
        return request.get<captchaDto>('/api/auth/captcha')
    },

    //获取公钥
    getPublicKey: () => {
        return request.get<string>('/api/auth/publicKey')
    },

    //刷新token
    rerefshToken(refreshToken: string) {
        return request.post<TokenDTO>('/api/auth/refresh/token', {refreshToken});
      },
    
    //退出登录
    logout() {
        return request.post<TokenDTO>('/api/auth/logout')
    },

    //发送邮箱验证码
    sendCheckEmail(email:string) {
        return request.post('/api/auth/send/reset/password/email', {email})
    },
     //重置密码
    resetPassaword(resetPasswordDTO: ResetPasswordDTO) {
        return request.post('/api/auth/reset/password', resetPasswordDTO);
      },

}

export default loginService