
import { async } from 'q';
import { post, get } from '@/utils/request';

// 获取表单类型根据mn号
export async function getrecordtypebymn(params) {
    const result = post('/api/rest/PollutantSourceApi/BaseDataApi/GetFormTypeByMN', params);
    return result === null ? {
        data: null
    } : result;
}


