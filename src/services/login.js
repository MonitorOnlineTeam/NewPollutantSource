/* eslint-disable import/prefer-default-export */
/**
 * 功  能：系统登录
 * 创建人：吴建伟
 * 创建时间：2019.07.12
 */

import Cookie from 'js-cookie';
import { post, get } from '@/utils/request';
import { async } from 'q';



/**
 * 获取登录配置信息
 * @params {}
 */
export async function getSystemLoginConfigInfo() {
 
    const result = await get('/api/rest/PollutantSourceApi/SystemSettingApi/GetSystemLoginConfigInfo');
   
    return result;
  }

  /**
 * 手机端下载特殊情况
 * @params {}
 */
export async function IfSpecial() {
  const result = await get('/api/rest/PollutantSourceApi/SystemSettingApi/IfSpecial');
  return result;
}
