import { post, get, getNew } from '@/utils/request';

//设备信息 列表
export async function GetEquipmentInfoList(params) {
  const result = await post('/api/rest/PollutantSourceApi/BaseDataApi/GetEquipmentInfoList',params, null);
  return result;
}
