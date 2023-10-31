import { useUserStore } from "~/stores/global/user"
/**
 * 判断是否有权限
 * @param authCode 权限代码
 * @returns
 */
export const isAuth = (authCode:string) => {
    if (!authCode) return false;
    const {currentUser} = useUserStore.getState() 
    const {authList = []} = currentUser || {}

    return authList.includes(authCode)
}