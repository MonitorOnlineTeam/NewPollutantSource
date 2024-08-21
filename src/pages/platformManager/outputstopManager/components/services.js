/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2024-06-11 15:22:22
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2024-08-19 16:26:02
 * @FilePath: \merged_master\src\pages\platformManager\outputstopManager\components\services.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { post, get } from '@/utils/request';
import { API } from '@config/API'

/** 添加停产 */
export async function addoutputstop(params) {
  const result = post(API.BaseDataApi.AddOutputStop, params.FormData, null);
  return result === null ? {
    data: null,
  } : result;
}
