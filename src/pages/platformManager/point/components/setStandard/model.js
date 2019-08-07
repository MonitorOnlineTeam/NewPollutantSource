import Model from '@/utils/model';
import {
  getlist,
  enableordisable,
  deletestandardlibrarybyid,
  addstandardlibrary,
  addstandardlibrarypollutant,
  uploadfiles,
  getStandardlibrarybyid,
  deletefiles,
  editstandardlibrary,
  getpollutantlist,
  getstandardlibrarypollutantlist,
  deletestandardlibrarypollutantbyid,
  editstandardlibrarypollutant,
  getStandardlibrarypollutantbyid,
  getstandardlibraryfiles,
  getuselist,
  getpollutantbydgimn,
  useStandard,
  isusepollutant,
  getMonitorPointPollutantDetails,
  editmonitorpointPollutant,
  useallDGIMNbyid,
} from './service';
/*
标准库相关接口
add by xpy
modify by
*/
export default Model.extend({
  namespace: 'standardlibrary',
  state: {
    requstresult: null,
    list: [],
    pollutantList: [],
    total: 0,
    loading: false,
    pageSize: 10,
    pageIndex: 1,
    reason: null,
    editstandardlibrary: null,
    StandardLibraryID: null,
    PollutantList: [],
    editstandardlibrarypollutant: null,
    standardlibrarypollutant: [],
    fileslist: [],
    uselist: [],
    PollutantListByDGIMN: [],
    editpollutant: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => { });
    },
  },
  effects: {
    /**获取标准库列表 */
    // *getlist({ payload }, { call, update }) {
    //   const result = yield call(getlist, {
    //     ...payload,
    //   });

    //   if (result.requstresult === '1') {
    //     yield update({
    //       requstresult: result.requstresult,
    //       list: result.data,
    //       total: result.total,
    //       pageIndex: payload.pageIndex,
    //       pageSize: payload.pageSize,
    //     });
    //   } else {
    //     yield update({
    //       requstresult: result.requstresult,
    //       list: [],
    //       total: 0,
    //       pageIndex: null,
    //       pageSize: null,
    //     });
    //   }
    // },
    /**查询单个监测点下污染物列表 */
    *getpollutantbydgimn({ payload }, { call, update }) {
      const result = yield call(getpollutantbydgimn, {
        ...payload,
      });
      // debugger
      if (result.IsSuccess) {
        yield update({
          requstresult: result.requstresult,
          PollutantListByDGIMN: result.Datas,
        });
      } else {
        yield update({
          requstresult: result.requstresult,
          PollutantListByDGIMN: [],
        });
      }
    },
    /**获取监测点种中监测标准的标准库列表 */
    *getuselist({ payload }, { call, update }) {
      const result = yield call(getuselist, {
        ...payload,
      });
      if (result.requstresult === '1') {
        yield update({
          requstresult: result.requstresult,
          uselist: result.data,
          total: result.total,
          pageIndex: payload.pageIndex,
          pageSize: payload.pageSize,
        });
      } else {
        yield update({
          requstresult: result.requstresult,
          uselist: [],
          total: 0,
          pageIndex: null,
          pageSize: null,
        });
      }
    },
    /**标准库污染物列表 */
    *getstandardlibrarypollutantlist({ payload }, { call, update }) {
      const result = yield call(getstandardlibrarypollutantlist, {
        ...payload,
      });

      if (result.requstresult === '1') {
        yield update({
          requstresult: result.requstresult,
          standardlibrarypollutant: result.data,
        });
      } else {
        yield update({
          requstresult: result.requstresult,
          standardlibrarypollutant: [],
        });
      }
    },
    /**启用禁用标准 */
    *enableordisable({ payload }, { call, put, update }) {
      const result = yield call(enableordisable, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      yield put({
        type: 'getlist',
        payload: {
          ...payload,
        },
      });
    },
    /**应用到单个监测点 */
    *useStandard({ payload }, { call, put, update }) {
      const result = yield call(useStandard, {
        ...payload,
      });
     
      yield put({
        type: 'getpollutantbydgimn',
        payload: {
          ...payload,
        },
      });
      payload.callback(result);
    },
    /**删除标准库主表 */
    *deletestandardlibrarybyid({ payload }, { call, put, update }) {
      const result = yield call(deletestandardlibrarybyid, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      yield put({
        type: 'getlist',
        payload: {
          ...payload,
        },
      });
      payload.callback();
    },
    /**应用到所有监测点 */
    *useallDGIMNbyid({ payload }, { call, update }) {
      const result = yield call(useallDGIMNbyid, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
      });
      payload.callback();
    },
    /** 删除标准库子表*/
    *deletestandardlibrarypollutantbyid({ payload }, { call, put, update }) {
      const result = yield call(deletestandardlibrarypollutantbyid, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      yield put({
        type: 'getstandardlibrarypollutantlist',
        payload: {
          ...payload,
        },
      });
      payload.callback();
    },
    /**添加标准库主表 */
    *addstandardlibrary({ payload }, { call, update }) {
      const result = yield call(addstandardlibrary, {
        ...payload,
      });
      yield update({
        StandardLibraryID: result.data,
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**添加标准库子表 */
    *addstandardlibrarypollutant({ payload }, { call, update }) {
      const result = yield call(addstandardlibrarypollutant, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**编辑标准库主表 */
    *editstandardlibrary({ payload }, { call, update }) {
      const result = yield call(editstandardlibrary, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**编辑标准库子表 */
    *editstandardlibrarypollutant({ payload }, { call, update }) {
      const result = yield call(editstandardlibrarypollutant, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**上传附件 */
    *uploadfiles({ payload }, { call, update }) {
      const result = yield call(uploadfiles, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**删除附件 */
    *deletefiles({ payload }, { call, update }) {
      const result = yield call(deletefiles, {
        ...payload,
      });
      yield update({
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**获取标准库主表实体 */
    *getStandardlibrarybyid({ payload }, { call, update }) {
      const result = yield call(getStandardlibrarybyid, {
        ...payload,
      });
      yield update({
        editstandardlibrary: result.data[0],
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**获取标准库子表实体 */
    *getStandardlibrarypollutantbyid({ payload }, { call, update }) {
      const result = yield call(getStandardlibrarypollutantbyid, {
        ...payload,
      });
      yield update({
        editstandardlibrarypollutant: result.data[0],
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**获取所有污染物 */
    *getpollutantlist({ payload }, { call, update }) {
      const result = yield call(getpollutantlist, {
        ...payload,
      });
      yield update({
        PollutantList: result.data,
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**获取所有附件 */
    *getstandardlibraryfiles({ payload }, { call, update }) {
      const result = yield call(getstandardlibraryfiles, {
        ...payload,
      });
      yield update({
        fileslist: result.data,
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback();
    },
    /**是否把当前污染物设置未检测中或取消监测中 */
    *isusepollutant({ payload }, { call, put, update }) {
      const result = yield call(isusepollutant, {
        ...payload,
      });
      if (result.IsSuccess) {
        yield put({
          type: 'getpollutantbydgimn',
          payload: {
            ...payload,
          },
        });
      }else
      {

      }
      // yield update({
      //   requstresult: result.requstresult,
      //   reason: result.reason,
      // });

    },
    /**根据监测点和污染物编号查询实体 */
    *getMonitorPointPollutantDetails({ payload }, { call, update }) {
      const result = yield call(getMonitorPointPollutantDetails, {
        ...payload,
      });
      yield update({
        editpollutant: result.Datas[0],
        requstresult: result.requstresult,
        reason: result.reason,
      });
      payload.callback(result);
    },
    /**监测点-设置监测标准-编辑污染物 */
    *editmonitorpointPollutant({ payload }, { call, put, update }) {
      const result = yield call(editmonitorpointPollutant, {
        ...payload,
      });
      if(result.IsSuccess)
      {
        yield put({
          type: 'getpollutantbydgimn',
          payload: {
            ...payload,
          },
        });
      }
      // yield update({
      //   requstresult: result.requstresult,
      //   reason: result.reason,
      // });
      // yield put({
      //   type: 'getpollutantbydgimn',
      //   payload: {
      //     ...payload,
      //   },
      // });
      payload.callback(result);
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        ...action.payload,
        // currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveChangePwdRes(state, action) {
      return {
        ...state,
        changepwdRes: action.payload,
      };
    },
    setCurrentMenu(state, action) {
      // ;
      return {
        ...state,
        currentMenu: action.payload,
      };
    },
  },
});
