/**
 * 功  能：菜单管理
 * 创建人：张哲
 * 创建时间：2019.09.19
 */
import { Icon, Popover, Badge, message } from 'antd';
import { GetMenuInfos, AddMenuManagement, UpdateMenuManagement, DelectMenuManagement } from '../services/MenuManagementPageApi';
import { generateLists } from '@/utils/getTreeKeys';
import Model from '@/utils/model';

export default Model.extend({
    namespace: 'menumanagementpage',
    state: {
        TableData: [],
        treeList: []
    },
    effects: {
        //获取
        * GetMenuInfos({ payload }, { call, update, select, put, take }) {
            const { TableData } = yield select(state => state.menumanagementpage);
            let body = {
            }
            const result = yield call(GetMenuInfos, body);
            if (result.IsSuccess && result.Datas) {
                let treeList = yield call(generateLists, result.Datas, []);
                yield update({
                    TableData: result.Datas,
                    treeList: treeList
                });
            } else {
                yield update({
                    TableData: [],
                    treeList: []
                });
            }
        },
        //添加
        * AddMenuManagement({ payload }, { call, update, select, put, take }) {
            let body = {
                ParentId: payload.ParentId,
                Menu_Name: payload.Menu_Name,
                Menu_Title: payload.Menu_Title,
                Menu_Img: payload.Menu_Img,
                NavigateUrl: payload.NavigateUrl,
                Target: payload.Target,
                SortCode: payload.SortCode,
                DeleteMark: payload.DeleteMark === true ? '1' : '2',
                AllowEdit: payload.AllowEdit === true ? '1' : '0',//是否首页
            }
            const result = yield call(AddMenuManagement, body);
            if (result.IsSuccess) {
                localStorage.setItem('_MenuDataIsChange', '1')
                localStorage.removeItem('_IsRequest_MenuData')
                message.success(result.Message)
            } else {
                message.error(result.Message)
            }
        },
        //修改
        * UpdateMenuManagement({ payload }, { call, update, select, put, take }) {
            let body = {
                Menu_Id: payload.Menu_Id,
                Menu_Name: payload.Menu_Name,
                Menu_Title: payload.Menu_Title,
                Target: payload.Target,
                Menu_Img: payload.Menu_Img,
                NavigateUrl: payload.NavigateUrl,
                SortCode: payload.SortCode,
                DeleteMark: payload.DeleteMark === true ? '1' : '2',
                TopMenu: payload.TopMenu,
                ParentId: payload.ParentId,
                AllowEdit: payload.AllowEdit === true ? '1' : '0',//是否首页
            }
            const result = yield call(UpdateMenuManagement, body);
            if (result.IsSuccess) {
                localStorage.setItem('_MenuDataIsChange', '1')
                localStorage.removeItem('_IsRequest_MenuData')
                message.success(result.Message)
            } else {
                message.error(result.Message)
            }
        },
        //删除
        * DelectMenuManagement({ payload }, { call, update, select, put, take }) {
            let body = {
                Menu_Id: payload.Menu_Id
            }
            const result = yield call(DelectMenuManagement, body);
            if (result.IsSuccess) {
                localStorage.setItem('_MenuDataIsChange', '1')
                localStorage.removeItem('_IsRequest_MenuData')
                message.success(result.Message)
            } else {
                message.error(result.Message)
            }
        },
    }

});
