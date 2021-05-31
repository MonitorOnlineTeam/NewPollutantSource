/**
 * 功  能：autoFrom - 树形导航
 * 创建人：白金索
 * 创建时间：2020.11.11
 */
import { message } from 'antd';
import { GetDBSourceTree, DeleteTreeConfig } from '../services/AutoFormDataSourceApi';
import Model from '@/utils/model';

//重组树
const regroupTree = (result, newTreeArray) => {
    if (result != null) {
        result.map((item) => {
            newTreeArray.push({ key: item.key, title: item.title, dbkey: item.dbkey, id: item.id, tablename: item.tablename });
            if (item.children && item.children.length > 0) {
                return regroupTree(item.children, newTreeArray);
            }
        })
    }
    return newTreeArray;
}

export default Model.extend({
    namespace: 'dbTree',
    state: {
        dbTreeArray: [],//树数据源
        selectedKeys: [],//树选中节点key
        expandedKeys: [],//树展开key
        treeList: [],//重组树
        searchValue: '',//搜索值
        autoExpandParent: true,
    },
    effects: {

        /** 获取数据源导航树 */
        * GetDBSourceTree({ payload }, { call, put, update, select }) {
            let body = {
                Id: payload.Id
            }
            const result = yield call(GetDBSourceTree, body);
            if (result.IsSuccess && result.Datas) {
                let defaultKeyArray = [result.Datas[0].key]
                let data = regroupTree(result.Datas, []);
                yield update({
                    dbTreeArray: result.Datas,
                    treeList: data,
                    selectedKeys: defaultKeyArray,
                    expandedKeys: defaultKeyArray
                });
            } else {
                yield update({
                    dbTreeArray: [],
                    selectedKeys: [],
                    expandedKeys: [],
                    treeList: []
                });
            }

            payload.callback(result.data);
        },

        /** 删除数据源导航树节点 */
        * DeleteTreeConfig({ payload }, { call, put, update, select }) {
            const { selectedKeys } = yield select(state => state.dbTree);

            if (selectedKeys && selectedKeys.length > 0 && !selectedKeys[0].startsWith('parent_')) {
                let body = {
                    Id: selectedKeys[0]
                }
                const result = yield call(DeleteTreeConfig, body);
                payload.callback(result.requstresult);
            } else {
                message.info("请先选择树节点")
            }
        },


    },
});