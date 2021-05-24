/**
 * 功  能：autoFrom - 字段配置
 * 创建人：武慧泽
 * 创建时间：2020.11.11
 */
import Model from '@/utils/model';
import { message } from 'antd';
import { GetCfgFiledsData, SaveFieldsConfig, GetCfgFiledsDataFromDbByTableName, GetEnumDictionary, AddEnum, UpdateEnum, DelEnum, GetAddfieldData, SavefieldData } from '../services/FieldConfigApi';
export default Model.extend({
    namespace: 'fieldConfigModel',
    state: {
        pageSize: 20,
        pageIndex: 1,
        tableDatas: [],
        total: 0,
        foreignTypeData: [],
        tableData: [],
        EnumData: []  //枚举值
    },
    effects: {
        * GetCfgFiledsData({ payload }, { call, update, select, put, take }) {
            let body = {
                dbKey: payload.dbKey,
                configId: payload.id
            };
            console.log(body);
            const result = yield call(GetCfgFiledsData, body);
            if (result.IsSuccess && result.Datas) {
                let data = result.Datas
                data.forEach(item => {
                    if (item.DF_ISPRIMARYKEY == 1) {
                        item.DF_ISPRIMARYKEY = '√'
                    } else {
                        item.DF_ISPRIMARYKEY = ''
                    }

                    if (item.DF_ISNOTNULL == "1") {
                        item.DF_ISNOTNULL = '√'
                    } else {
                        item.DF_ISNOTNULL = ''
                    }

                    if (item.DF_ISADD == "1") {
                        item.DF_ISADD = '√'
                    } else {
                        item.DF_ISADD = ''
                    }

                    if (item.DF_ISEDIT == "1") {
                        item.DF_ISEDIT = '√'
                    } else {
                        item.DF_ISEDIT = ''
                    }

                    if (item.LIST_ISSHOW == "1") {
                        item.LIST_ISSHOW = '√'
                    } else {
                        item.LIST_ISSHOW = ''
                    }

                    if (item.DF_ISFIXED == "1") {
                        item.DF_ISFIXED = '√'
                    } else {
                        item.DF_ISFIXED = ''
                    }

                    if (item.LIST_ISEXPORT == 1) {
                        item.LIST_ISEXPORT = '√'
                    } else {
                        item.LIST_ISEXPORT = ''
                    }

                    if (item.DF_ISQUERY == 0) {
                        item.DF_ISQUERY = '不查询'
                    }
                    if (item.DF_ISQUERY == 1) {
                        item.DF_ISQUERY = '列表头部显示'
                    }
                    if (item.DF_ISQUERY == 2) {
                        item.DF_ISQUERY = '特殊位置显示'
                    }

                    if (item.DF_FOREIGN_TYPE == "0") {
                        item.DF_FOREIGN_TYPE = "无"
                    }
                    if (item.DF_FOREIGN_TYPE == "1") {
                        item.DF_FOREIGN_TYPE = "表链接"
                    }
                    if (item.DF_FOREIGN_TYPE == "2") {
                        item.DF_FOREIGN_TYPE = "枚举"
                    }

                    // if(item.ENUM_NAME!=null&&item.ENUM_NAME!=""&&item.ENUM_NAME.length>0){
                    //     item.ENUM_NAME=item.ENUM_NAME.substring(0,10)+'...';
                    //     if(item.ENUM_NAME=="..."){
                    //         item.ENUM_NAME='';
                    //     }
                    // }
                    // if(item.DF_CONDITION=="$="){
                    //     item.DF_CONDITION='相等'
                    // }
                    // if(item.DF_CONDITION=="$ne"){
                    //     item.DF_CONDITION='不等'
                    // }
                    // if(item.DF_CONDITION=="$like"){
                    //     item.DF_CONDITION='模糊匹配'
                    // }
                    // if(item.DF_CONDITION=="$gte"){
                    //     item.DF_CONDITION='大于等于'
                    // }
                    // if(item.DF_CONDITION=="$gt"){
                    //     item.DF_CONDITION='大于'
                    // }
                    // if(item.DF_CONDITION=="$lte"){
                    //     item.DF_CONDITION='小于等于'
                    // }
                    // if(item.DF_CONDITION=="$lt"){
                    //     item.DF_CONDITION='小于'
                    // }
                    // if(item.DF_CONDITION=="$nin"){
                    //     item.DF_CONDITION='不包含'
                    // }
                    // if(item.DF_CONDITION=="$in"){
                    //     item.DF_CONDITION='包含'
                    // }
                    //校验方式
                    // if(item.DF_VALIDATE=="'number'"){
                    //     item.DF_VALIDATE=item.DF_VALIDATE.replace("'number'","");
                    // }
                });
                yield update({
                    tableDatas: data,
                    total: result.Total,
                    pageIndex: payload.pageIndex || 1,
                });
            } else {
                yield update({
                    tableDatas: [],
                    total: result.Total,
                    pageIndex: payload.pageIndex || 1,
                });
            }
        },
        /**  编辑数据源配置 */
        * SaveFieldsConfig({ payload }, { call, put, update, select }) {
            let body = {
                Fileid: payload.Fileid,
                configId: payload.configId,
                tabAllName: payload.tabAllName
            }
            console.log(body);
            const result = yield call(SaveFieldsConfig, body);
            if (result.IsSuccess) {
                message.success('修改成功！');
            } else {
                message.error('修改失败！')
            }
            payload.callback();

        },
        /**  获取字段配置信息从数据库的表结构，依据表名查询 */
        * GetCfgFiledsDataFromDbByTableName({ payload }, { call, put, update, select }) {
            // const {dbTreeArray} = yield select(state => state.dbTree);
            // console.log(dbTreeArray)
            let body = {
                configId: payload.configId,
            }
            console.log(body);
            const result = yield call(GetCfgFiledsDataFromDbByTableName, body);
            console.log(result);
            if (result.IsSuccess && result.Datas) {
                yield update({
                    foreignTypeData: result.Datas,
                });
                payload.callBack(result.Datas)

            } else {
                yield update({
                    foreignTypeData: [],
                });
                payload.callBack([])
            }
        },
        //获取添加字段数据信息
        * GetAddfieldData({ payload }, { call, put, update, select }) {
            let body = {
                id: payload.id,
                dbKey: payload.dbKey,
                tableName: payload.tableName
            }
            const result = yield call(GetAddfieldData, body);
            if (result.IsSuccess && result.Datas) {
                yield update({
                    tableData: result.Datas,
                });
            } else {
                yield update({
                    tableData: [],
                });
            }
        },
        //获取保存字段数据信息
        * SavefieldData({ payload }, { call, put, update, select }) {
            let body = {
                id: payload.id,
                //dbKey: payload.dbKey,
                tableName: payload.tableName,
                Cfg_Field: payload.Cfg_Field
            }
            const result = yield call(SavefieldData, body);
            //console.log(result)
            if (result.IsSuccess) {
                message.success('添加成功！');
            } else {
                message.error('修改失败！')
            }
        },
        /**  获取枚举值 */
        * GetEnumDictionary({ payload }, { call, put, update, select }) {
            // const {dbTreeArray} = yield select(state => state.dbTree);
            // console.log(dbTreeArray)
            let body = {}
            console.log(body);
            const result = yield call(GetEnumDictionary, body);
            console.log(result);
            if (result.IsSuccess && result.Datas) {
                yield update({
                    EnumData: result.Datas,
                });
            } else {
                yield update({
                    EnumData: [],
                });
            }
        },
        /**  添加枚举值 */
        * AddEnum({ payload }, { call, put, update, select }) {
            let body = {
                key: payload.key,
                value: payload.value
            }
            console.log(body);
            const result = yield call(AddEnum, body);
            if (result.IsSuccess) {
                message.success('添加成功！');
            } else {
                message.error('添加失败！')
            }
            payload.callback();

        },
        /**  修改枚举值 */
        * UpdateEnum({ payload }, { call, put, update, select }) {
            let body = {
                key: payload.key,
                value: payload.value
            }
            console.log(body);
            const result = yield call(UpdateEnum, body);
            if (result.IsSuccess) {
                message.success('修改成功！');
            } else {
                message.error('修改失败！')
            }
            payload.callback();

        },
        /**  删除枚举值 */
        * DelEnum({ payload }, { call, put, update, select }) {
            let body = {
                key: payload.key,
            }
            console.log(body);
            const result = yield call(DelEnum, body);
            if (result.IsSuccess) {
                message.success('删除成功！');
            } else {
                message.error('删除失败！')
            }
            payload.callback();
        }
    }
});