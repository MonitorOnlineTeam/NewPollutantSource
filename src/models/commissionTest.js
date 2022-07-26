//调试检测公共model
import moment from 'moment';
import * as services from '../services/commissionTest';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';

export default Model.extend({
    namespace: 'commissionTest',
    state: {
        manufacturerList: [],
        pollutantTypeList: [],
        systemModelNameList:[],
    },
    effects: {
        *getManufacturerList({ payload, callback }, { call, put, update }) { //获取厂家列表
            const result = yield call(services.GetManufacturerList, payload);
            if (result.IsSuccess) {
                yield update({ manufacturerList: result.Datas ? result.Datas.mlist : [] })
                callback && callback(result.Datas ? result.Datas.mlist : [])
            } else {
                message.error(result.Message)
            }
        },
        *getPollutantById({ payload, callback }, { call, put, update }) { //获取监测类型

            const result = yield call(services.GetPollutantById, payload);
            if (result.IsSuccess) {
                yield update({ pollutantTypeList: result.Datas ? result.Datas : [] })
            } else {
                message.error(result.Message)
            }

        },
        *getSystemModelNameList({ payload, callback }, { call, put, update }) { //获取系统名称列表
            const result = yield call(services.GetSystemModelNameList, payload);
            if (result.IsSuccess) {
                yield update({ systemModelNameList: result.Datas })
            } else {
                message.error(result.Message)
            }
        },
    }

})