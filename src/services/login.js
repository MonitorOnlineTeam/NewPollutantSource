/* eslint-disable import/prefer-default-export */
/**
 * 功  能：系统登录
 * 创建人：吴建伟
 * 创建时间：2019.07.12
 */

import Cookie from 'js-cookie';
import { postNew, getNew } from '../dvapack/request';
import { async } from 'q';

/**
 * 【AutoForm】系统登录
 * @params {"UserAccount": "system","UserPwd": "system","RememberMe": true}
 */
export async function systemLogin(params) {
    const defaults = {
        RememberMe: true,
        UserAccount: params.userName,
        UserPwd: params.password,
    };
    const body = Object.assign(defaults);
    const result = await postNew('/api/rest/PollutantSourceApi/LoginApi/Login', body);
    if (result.IsSuccess && result.Datas) {
        Cookie.set('ssoToken', result.Datas.Ticket);
    } else {
        Cookie.set('ssoToken', "");
    }
    return result;
}
