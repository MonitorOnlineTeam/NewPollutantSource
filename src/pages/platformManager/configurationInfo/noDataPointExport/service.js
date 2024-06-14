import { post, get, getNew } from '@/utils/request';
import { API} from '@config/API';


//无数据点位统计 导出
export async function aa(params) {
  const result = await post(API,params, null);
  return result;
}