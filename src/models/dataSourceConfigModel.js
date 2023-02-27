/**
 * 功  能：数据源基础信息
 * 创建人：胡孟弟
 * 创建时间：2020.11.11
 */
import { message } from 'antd';
import { TableConfigAdd, TableConfigUpdate, GetPkByTableName, GetTables, TableConfig, ConfigIDisExisti, ExportConsoleConfig } from '@/services/dataSourceConfigApi';
import Model from '@/utils/model';
import { downloadFile } from '@/utils/utils';

export default Model.extend({
    namespace: 'dataSourceConfigModel',
    state: {
        PkByTable: [],
        tableList: [],
        tableConfigList: [],
        dbKey: '',
        GUID: '',
        messageStatus: '',
        dataCodeExists: ''
    },

    effects: {

        //数据源基础信息添加
        * TableConfigAdd({ payload }, { call, update, select, put, take }) {

            const body = {
                DT_NAME: payload.DT_NAME,
                DT_CONFIG_ID: payload.DT_CONFIG_ID,
                DT_NAME_CN: payload.DT_NAME_CN,
                DT_ORDER: payload.DT_ORDER,
                DT_CONN: payload.DT_CONN,
                DT_PRIMARYKEY: payload.DT_PRIMARYKEY,
                Tree_ParentCode: payload.Tree_ParentCode,
                StaticQuery: payload.StaticQuery,
                DT_REMARK: payload.DT_REMARK,
                EnableDataPermission: payload.EnableDataPermission,
                MulType: payload.MulType
            }
            const result = yield call(TableConfigAdd, body);

            if (result.IsSuccess && result.Datas) {
                yield update({
                    messageStatus: result.Datas
                })
            } else {
                message.error(result.Message)
            }
        },
        //数据源基础信息修改
        * TableConfigUpdate({ payload }, { call, update, select, put, take }) {

            const body = {
                GUID: payload.GUID,
                DT_NAME: payload.DT_NAME,
                DT_CONFIG_ID: payload.DT_CONFIG_ID,
                DT_NAME_CN: payload.DT_NAME_CN,
                DT_ORDER: payload.DT_ORDER,
                DT_CONN: payload.DT_CONN,
                DT_PRIMARYKEY: payload.DT_PRIMARYKEY,
                Tree_ParentCode: payload.Tree_ParentCode,
                StaticQuery: payload.StaticQuery,
                DT_REMARK: payload.DT_REMARK,
                EnableDataPermission: payload.EnableDataPermission,
                MulType: payload.MulType
            }
            const result = yield call(TableConfigUpdate, body);

            if (result.IsSuccess && result.Datas) {
                yield update({
                    messageStatus: result.Datas
                })
            }
            else {
                message.error(result.Messsage)
            }
        },
        //根据表名返回该表的主键
        * GetPkByTableName({ payload }, { call, update, select, put, take }) {

            const body = {
                dbkey: payload.dbkey,
                tableName: payload.tableName,
            }
            const result = yield call(GetPkByTableName, body);

            if (result.IsSuccess && result.Datas.length > 0) {
                yield update({
                    PkByTable: JSON.parse(result.Datas)
                })
            }
        },
        //获取数据源树
        * GetTables({ payload }, { call, update, select, put, take }) {

            if (payload.id == '') {
                yield update({
                    tableList: [],
                    dbKey: '',
                    tableConfigList: [],
                    GUID: ''
                })
            }
            else {
                const result = yield call(GetTables, payload);
                if (result != null && result.IsSuccess && result.Datas.length > 0) {
                    yield update({
                        tableList: result.Datas,
                        dbKey: payload.id,
                        tableConfigList: [],
                        GUID: ''
                    })
                }
            }



        },
        //根据表Id获取数据源基础信息
        * TableConfig({ payload }, { call, update, select, put, take }) {

            if (payload.id == '') {
                yield update({
                    tableConfigList: [],
                    tableList: [],
                    dbKey: '',
                    GUID: ''
                })
            }
            else {
                const result = yield call(TableConfig, payload);
                if (result.IsSuccess && result.Datas.length > 0) {
                    yield update({
                        tableConfigList: result.Datas,
                        tableList: [],
                        dbKey: '',
                        GUID: result.Datas[0].GUID
                    })
                }
            }
        },
        //验证数据源ID是否存在
        * ConfigIDisExisti({ payload }, { call, update, select, put, take }) {

            let body = ''
            if (payload.Operation == 'add') {
                body = {
                    configId: payload.configId,
                    Operation: payload.Operation,
                }
            }
            else {
                body = {
                    configId: payload.configId,
                    Operation: payload.Operation,
                    id: payload.id,
                }
            }

            const result = yield call(ConfigIDisExisti, body);
            if (result.IsSuccess) {
                yield update({
                    dataCodeExists: result.Datas,
                })
            }
        },
        //导出数据源配置
        * ExportConsoleConfig({ payload }, { call, update, select, put, take }) {
            const result = yield call(ExportConsoleConfig, payload);
            downloadFile(result);
        },
        //导入数据源配置
        * ImportConsoleConfig({ payload }, { call, update, select, put, take }) {
            const result = yield call(ImportConsoleConfig, payload);
            downloadFile(result);
        },

    }
});
