/**
 * 功  能：AutoForm数据库链接配置
 * 创建人：李静
 * 创建时间：2020.11.12
 */
import { message } from 'antd';
// import moment from 'moment';
import { GetDatabaseData, AddingdatabaseConnection, DeleteDatabase } from '../services/DatabaseApi';
import Model from '@/utils/model';


export default Model.extend({
    namespace: 'databasedata',
    state: {
        total: 0,
        pageSize: 30,
        pageIndex: 1,
        tableDatas: [],
        DB_KEY: '',  // 数据库code
        DB_NAME: '',  // 数据库名
        DB_VERSION: '',// 数据库版本
        DB_IP: '',// 连接地址
        DB_USERNAME: '',// 登录名
        DB_PWD: '',// 密码
        DB_MARK: ''// 中文描述
    },

    effects: {
        //获取数据库链接配置信息
        * GetDatabaseData({ payload }, { call, update, select, put, take }) {
            const result = yield call(GetDatabaseData, payload);
            if (result.IsSuccess) {
                yield update({
                    tableDatas: result.Datas,
                    total: result.Total,
                    pageIndex: payload.pageIndex || 1,
                });
            } else {
                yield update({
                    tableDatas: [],
                    total: result.Total,
                    pageIndex: payload.pageIndex || 1
                });
            }
        },

        //添加或编辑数据库连接
        *   AddingdatabaseConnection({ payload }, { call, update, select, put, take }) {
            //console.log(payload.parameter);
            const result = yield call(AddingdatabaseConnection, payload.parameter);
            payload.callback(result);
            // if(payload.type===0){
            //     let body = {
            //         DB_KEY: payload.DB_KEY,
            //         DB_NAME: payload.DB_NAME,
            //         DB_USERNAME: payload.DB_USERNAME,
            //         DB_VERSION: payload.DB_VERSION,
            //         DB_MARK: payload.DB_MARK,
            //         DB_IP: payload.DB_IP,
            //         DB_PWD: payload.DB_PWD,
            //         Type: payload.type,
            //     }
            //     const result = yield call(AddingdatabaseConnection, body);
            //     if (result.requstresult === '1') {
            //         yield update({
            //             requstresult:result.requstresult,
            //         });
            //         message.success(result.reason)
            //     }else{
            //         yield update({
            //             requstresult:result.requstresult,
            //         });
            //         message.error(result.reason)
            //     }
            // }else if(payload.type===1){
            //     let body = {
            //         DB_KEY: payload.DB_KEY,
            //         DB_NAME: payload.DB_NAME,
            //         DB_USERNAME: payload.DB_USERNAME,
            //         DB_VERSION: payload.DB_VERSION,
            //         DB_MARK: payload.DB_MARK,
            //         DB_IP: payload.DB_IP,
            //         DB_PWD: payload.DB_PWD,
            //         Type: payload.type,
            //     }
            //     const result = yield call(AddingdatabaseConnection, body);
            //     if (result.requstresult === '1') {
            //         message.success(result.reason)
            //     }else{
            //         message.error(result.reason)
            //     }
            // }else{
            //     let body = {
            //         //type: payload.type,
            //     }
            //     const result = yield call(AddingdatabaseConnection, body);
            //     if (result.requstresult === '1') {
            //         message.success(result.reason)
            //     }else{
            //         message.error(result.reason)
            //     }
            // }

        },

        // 删除
        * DeleteDatabase({ payload }, { call }) {
            let body = {
                dbkey: payload.dbkey
            }
            const result = yield call(DeleteDatabase, body);
            if (result.IsSuccess) {
                message.success(result.Message);
            } else {
                message.error(result.Message)
            }
        },
    }
});
