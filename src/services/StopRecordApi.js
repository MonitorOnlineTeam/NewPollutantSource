/**
 * 功  能：停运记录
 * 创建人：胡孟弟
 * 创建时间：2020.10.22
 */
import { post } from '@/utils/request';
import { async } from 'q';
//获取流量数据
export async function GetPointByEntCode(params){
    const result = post(`/api/rest/PollutantSourceApi/TransmissionEfficiencyApi/GetPointByEntCode?EntCode=${params.EntCode}`,{})
    return result 
}

//获取流量数据
export async function GetStopList(params){
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetStopList',params,null)
    return result 
}



