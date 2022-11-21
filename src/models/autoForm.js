/*
 * @Author: Jiaqi
 * @Date: 2019-05-16 15:13:59
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-21 15:22:46
 */
import { message } from 'antd';
import Model from '@/utils/model';
import config from '@/config';
import moment from 'moment'
import * as services from '@/services/autoformapi';

function formatDateFormat(format) {
  let _format = 'YYYY-MM-DD HH:mm:ss';
  switch (format) {
    case 'YYYY':
      _format = 'YYYY-01-01 00:00:00';
      break;
    case 'YYYY-MM':
      _format = 'YYYY-MM-01 00:00:00';
      break;
    case 'YYYY-MM-DD':
      _format = 'YYYY-MM-DD 00:00:00';
      break;
    case 'YYYY-MM-DD HH':
      _format = 'YYYY-MM-DD HH:00:00';
      break;
    case 'YYYY-MM-DD HH:mm':
      _format = 'YYYY-MM-DD HH:mm:00';
      break;
  }
  return _format;
}

function getQueryParams(state, payload) {
  const group = [];
  const { configId } = payload;
  let searchForm = state.searchForm[configId] ? state.searchForm[configId] : [];
  if (searchForm) {
    for (const key in searchForm) {
      let groupItem = {};
      // if (searchForm[key].value && searchForm[key].value.length || Object.keys(searchForm[key].value).length) {
      if (searchForm[key] && searchForm[key].value && searchForm[key].value.length + '') {
        // 是否是moment对象
        const isMoment = moment.isMoment(searchForm[key].value);
        const isArrMoment = Array.isArray(searchForm[key].value) && moment.isMoment(searchForm[key].value[0]);
        let format = state.dateFormat[configId][key] || 'YYYY-MM-DD HH:mm:ss';
        let _format = formatDateFormat(format);
        if (isArrMoment) {
          console.log("searchForm[key]=", searchForm[key])
          groupItem = [{
            Key: key,
            Value: moment(searchForm[key].value[0]).format(_format),
            Where: '$gte',
          }, {
            Key: key,
            Value: moment(searchForm[key].value[1]).format(_format),
            Where: '$lte',
          }]
          group.push(...groupItem);
        } else {
          groupItem = {
            Key: key,
            Value: isMoment ? moment(searchForm[key].value).format(_format) : searchForm[key].value.toString(),
          };
          for (const whereKey in state.whereList[configId]) {
            if (key === whereKey) {
              groupItem.Where = state.whereList[configId][whereKey];
            }
          }
          console.log('groupItem=', groupItem);
          if (groupItem.Value !== "" && groupItem.Value !== undefined) {
            group.push(groupItem);
          }
        }
      }
      // } else {
      //   group = []
      // }
    }
  }

  const postData = {
    configId,
    pageIndex: searchForm.current || 1,
    pageSize: searchForm.pageSize || 20,
    ...payload.otherParams,
  };
  const searchParams = payload.searchParams || [];
  (group.length || searchParams.length) ? postData.ConditionWhere = JSON.stringify({
    // group.length? postData.ConditionWhere = JSON.stringify({
    rel: '$and',
    group: [{
      rel: '$and',
      group: [
        ...group,
        ...searchParams,
      ],
    }],
  }) : '';

  return postData;
}


export default Model.extend({
  namespace: 'autoForm',
  state: {
    // dataSource: [],
    // columns: [],
    // tableInfo: { // table 信息
    //   dataSource: [],
    //   columns: [],
    // },
    // searchForm: { // 搜索表单
    //   current: 1,
    //   pageSize: 10,
    //   total: 0
    // },
    routerConfig: '',
    tableInfo: {},
    searchForm: {},
    searchConfigItems: { // 搜索条件配置项
      searchConditions: [],
    },
    configIdList: {}, // 获取下拉列表数据
    opreationButtons: [],
    whereList: {},
    keys: [], // 主键
    addFormItems: [],
    editFormData: {}, // 修改数据
    detailData: {}, // 详情页面数据
    detailConfigInfo: {}, // 详情页面配置信息,
    regionList: [], // 联动数据
    fileList: null, // 文件列表
    formLayout: {}, // 添加编辑布局
    dateFormat: {}, // 日期格式化
  },
  effects: {
    // 获取数据
    * getAutoFormData({ payload, callback }, { call, put, update, select }) {
      let state = yield select(state => state.autoForm);
      const { configId } = payload;

      const postData = getQueryParams(state, payload);
      const sysConfig = yield select(state => state.global.configInfo);
      // const result = yield call(services.getListPager, { params: postData, sysConfig });
      const result = yield call(services.getListPager, { ...postData });
      if (result.IsSuccess) {
        state = yield select(state => state.autoForm);
        callback && callback();
        yield update({
          // configIdList: {
          //   [payload.configId]: result.data
          // }
          tableInfo: {
            ...state.tableInfo,
            [configId]: {
              ...state.tableInfo[configId],
              dataSource: result.Datas.DataSource,
            },
          },
          searchForm: {
            ...state.searchForm,
            [configId]: {
              ...state.searchForm[configId],
              total: result.Total,
            },
          },
        });
      }
    },
    // 根据configId 获取数据
    * getConfigIdList({ payload }, { call, update, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      // let postData = {
      //   params: payload,
      //   sysConfig
      // };
      let postData = payload;
      const result = yield call(services.getListPager, postData);
      if (result.IsSuccess) {
        const configIdList = yield select(state => state.autoForm.configIdList);
        yield update({
          configIdList: {
            ...configIdList,
            [payload.configId]: result.Datas.DataSource,
          },
        });
      }
    },
    // FOREIGN_DF_NAME /// FOREIGN_DF_ID
    // 获取页面配置项
    * getPageConfig({ payload }, { call, put, update, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      // let postData = {
      //   params: { ...payload },
      //   sysConfig
      // };
      let postData = payload;
      const result = yield call(services.getPageConfigInfo, postData);
      if (result.IsSuccess) {
        const configId = result.Datas.ConfigId;
        const columns = result.Datas.ColumnFields.filter(itm => itm.FOREIGH_DT_CONFIGID === '' && itm.DF_WIDTH !== '0').map((item, index) => ({
          title: item.DF_NAME_CN,
          dataIndex: item.DF_FOREIGN_TYPE === 2 ? `${item.FullFieldName}_Name` : item.FullFieldName,
          key: item.FullFieldNameVerticalBar,
          align: item.DF_ALIGN,
          width: item.DF_WIDTH ? item.DF_WIDTH * 1 : item.DF_WIDTH,
          sorter: item.DF_ISSORT === 1 ? (a, b) => a[item.FullFieldName] - b[item.FullFieldName] : false,
          fixed: result.Datas.FixedFields.filter(m => m.FullFieldName === item.FullFieldName).length > 0 ? 'left' : '',
          dateFormat: item.DF_DATEFORMAT,
          formatType: item.DF_ISFormat,
          otherConfig: item.DF_OtherOptions,
          type: item.DF_CONTROL_TYPE,
        }),
        );
        const checkboxOrRadio = result.Datas.MulType;

        const whereList = {};
        let dateFormat = {};
        let dateInitialValues = {};
        const searchConditions = result.Datas.ColumnFields.filter(itm => itm.DF_ISQUERY === 1).map((item, index) => {
          index === 0 ? whereList[configId] = {} : '';
          whereList[result.Datas.ConfigId][item.FullFieldNameVerticalBar] = item.DF_CONDITION;
          if (item.DF_QUERY_TIME_TYPE && item.LIST_TIME) {
            dateInitialValues = {
              [item.FullFieldNameVerticalBar]: {
                value: [moment().subtract(item.LIST_TIME, item.DF_QUERY_TIME_TYPE), moment()]
              }
            }
          }
          // 日期格式化
          if (item.DF_DATEFORMAT) {
            dateFormat = {
              [item.FullFieldNameVerticalBar]: item.DF_DATEFORMAT
            }
          }
          return {
            type: item.DF_QUERY_CONTROL_TYPE,
            labelText: item.DF_NAME_CN,
            fieldName: item.FullFieldNameVerticalBar,
            value: item.ENUM_NAME ? JSON.parse(item.ENUM_NAME) : [],
            placeholder: item.DF_TOOLTIP,
            where: item.DF_CONDITION,
            configId: item.FOREIGH_DT_CONFIGID,
            configDataItemName: item.FOREIGN_DF_NAME,
            configDataItemValue: item.FOREIGN_DF_ID,
            dateFormat: item.DF_DATEFORMAT,
            ...item,
          };
        });
        // 添加
        let addCfgField = result.Datas.CfgField.filter(cfg => cfg.DF_ISADD === 1);
        if (payload.isEdit) {
          addCfgField = result.Datas.CfgField.filter(cfg => cfg.DF_ISEDIT === 1);
        }
        // const colSpanLen = ;
        let layout = 12;
        if (addCfgField.filter(item => item.DF_ROWSPAN === null).length == addCfgField.length) {
          // 显示两列
          layout = 12
        } else if (addCfgField.filter(item => item.DF_ROWSPAN === 1 || item.DF_ROWSPAN === 2).length == addCfgField.length) {
          // 显示一列
          layout = 24
        } else {
          layout = false
        }
        const addFormItems = addCfgField.map(item => ({
          type: item.DF_CONTROL_TYPE,
          labelText: item.DF_NAME_CN,
          fieldName: item.DF_NAME,
          dtName: item.DT_NAME,
          fullFieldName: item.FullFieldName,
          value: item.ENUM_NAME ? JSON.parse(item.ENUM_NAME) : [],
          placeholder: item.DF_TOOLTIP,
          // configId: item.DT_CONFIG_ID,
          foreignType: item.DF_FOREIGN_TYPE,
          where: item.DF_CONDITION,
          configId: item.FOREIGH_DT_CONFIGID,
          configDataItemName: item.FOREIGN_DF_NAME,
          configDataItemValue: item.FOREIGN_DF_ID,
          required: item.DF_ISNOTNULL === 1,
          validator: item.DF_ISNOTNULL === 1 && (item.DF_TOOLTIP || ''), // TODO：正则？
          validate: item.DF_VALIDATE ? item.DF_VALIDATE.split(',') : [],
          rowSpan: item.DF_ROWSPAN,
          dateFormat: item.DF_DATEFORMAT,
          isHide: item.DF_HIDDEN,
          defaultValue: item.DF_DEFAULTVALUE,
          // uploadType: item.DF_UpType ? item.DF_UpType.split(',').toString() : '',
          uploadType: item.DF_UpType,
          uploadNumber: item.DF_UpNum,
        }));


        // 主键
        const keys = result.Datas.Keys.map(item => item.FullFieldName)
        // let keys = {
        //   fullFieldName: result.Datas.Keys.map(item => item.FullFieldName),
        //   names: result.Datas.Keys.map(item => item.DF_NAME),
        // }
        // console.log('keys=', keys);
        const state = yield select(state => state.autoForm);
        yield put({
          type: 'saveConfigIdList',
        })
        yield update({
          searchForm: {
            ...state.searchForm,
            [configId]: {
              ...state.searchForm[configId],
              ...dateInitialValues
            },
          },
          searchConfigItems: {
            ...state.searchConfigItems,
            [configId]: searchConditions,
          },
          tableInfo: {
            ...state.tableInfo,
            [configId]: {
              ...state.tableInfo[configId],
              columns,
              checkboxOrRadio,
            },
          },
          opreationButtons: {
            ...state.opreationButtons,
            [configId]: result.Datas.OpreationButtons,
          },
          whereList: {
            ...state.whereList,
            ...whereList
          },
          dateFormat: {
            ...state.dateFormat,
            [configId]: dateFormat,
          },
          keys: {
            ...state.keys,
            [configId]: keys,
          },
          addFormItems: {
            ...state.addFormItems,
            [configId]: addFormItems,
          },
          formLayout: {
            ...state.formLayout,
            [configId]: layout,
          },
        });
      }
    },
    // autoForm列表删除
    * del({ payload, callback }, { call, update, put, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      let postData = payload;
      let configId = payload.configId;
      const result = yield call(services.postAutoFromDataDelete, postData);
      if (result.IsSuccess) {
        message.success('删除成功！');
        // 如果当前页只有一条数据，删除后跳转到第一页
        let state = yield select(state => state.autoForm);
        let searchForm = state.searchForm[configId] ? state.searchForm[configId] : [];
        const { current = 1, pageSize = 20, total } = searchForm;
        if (total % pageSize === 1) {
          yield update({
            searchForm: {
              ...state.searchForm,
              [configId]: {
                ...state.searchForm[configId],
                current: 1
              },
            },
          })
        }
        yield put({
          type: 'getAutoFormData',
          payload: {
            configId: configId,
            searchParams: payload.searchParams,
          },
        });
        callback && callback();
      }
    },

    * add({ payload }, { call, update, put, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      // let postData = {
      //   params: { ...payload, FormData: JSON.stringify(payload.FormData) },
      //   sysConfig
      // };
      let postData = { ...payload, FormData: JSON.stringify(payload.FormData) };
      const result = yield call(services.postAutoFromDataAdd, postData);
      if (result.IsSuccess) {
        message.success('添加成功！');
        yield put({
          type: 'getAutoFormData',
          payload: {
            configId: payload.configId,
            searchParams: payload.searchParams,
          },
        });
        payload.callback && payload.callback(result);
      } else {
        message.error(result.Message);
      }
    },

    * saveEdit({ payload }, { call, update, put, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      // let postData = {
      //   params: { ...payload, FormData: JSON.stringify(payload.FormData) },
      //   sysConfig
      // };
      let postData = { ...payload, FormData: JSON.stringify(payload.FormData) };
      const result = yield call(services.postAutoFromDataUpdate, postData);
      if (result.IsSuccess) {
        message.success('修改成功！');
        if (payload.reload === false) {

        } else {
          yield put({
            type: 'getAutoFormData',
            payload: {
              configId: payload.configId,
              searchParams: payload.searchParams,
            },
          });
        }
        payload.callback && payload.callback(result);
      } else {
        message.error(result.Message);
      }
    },

    * getFormData({ payload, callback }, { call, select, update, put }) {
      const state = yield select(state => state.autoForm);
      const sysConfig = yield select(state => state.global.configInfo);
      // let postData = {
      //   params: { ...payload },
      //   sysConfig
      // };
      let postData = payload;
      const result = yield call(services.getFormData, postData);
      if (result.IsSuccess && result.Datas.length) {
        callback && callback(result.Datas[0])
        yield update({
          editFormData: {
            ...state.editFormData,
            [payload.configId]: result.Datas[0],
          },
        })
      } else {
        message.error(result.Message);
      }
    },

    // 获取详情页面配置
    * getDetailsConfigInfo({ payload }, { call, select, update, put }) {
      const state = yield select(state => state.autoForm);
      const sysConfig = yield select(state => state.global.configInfo);
      // let postData = {
      //   params: { ...payload },
      //   sysConfig
      // };
      let postData = payload;
      const result = yield call(services.getPageConfigInfo, postData);
      if (result.IsSuccess) {
        const detailFormItems = result.Datas.CfgField.filter(cfg => cfg.DF_ISEDIT === 1).map(item => ({
          type: item.DF_CONTROL_TYPE,
          labelText: item.DF_NAME_CN,
          fieldName: item.DF_FOREIGN_TYPE === 2 ? `${item.FullFieldName}_Name` : (item.FOREIGH_DT_CONFIGID ? item.FOREIGN_DF_NAME : item.DF_NAME), // 判断是否是外键或表连接
          // configId: item.DT_CONFIG_ID,
          isHide: item.DF_HIDDEN,
          configId: item.FOREIGH_DT_CONFIGID,
          configDataItemName: item.FOREIGN_DF_NAME,
          configDataItemValue: item.FOREIGN_DF_ID,
          FullFieldName: item.FullFieldName,
        }));
        yield update({
          detailConfigInfo: {
            ...state.detailConfigInfo,
            [payload.configId]: detailFormItems,
          },
        })
      } else {
        message.error(result.Message);
      }
    },

    // 获取联动
    * getRegions({ payload, callback }, { call, update }) {
      const result = yield call(services.getRegions, { ...payload });
      if (result.IsSuccess) {
        yield update({
          regionList: result.Datas,
        })
        callback && callback(result)
      }
    },

    // 获取联动
    * getAttachmentList({ payload, callback }, { call, update }) {
      if (payload.FileUuid && payload.FileUuid !== 'null') {
        const result = yield call(services.getAttachmentList, { ...payload });
        if (result.IsSuccess) {
          let fileList = [];
          fileList = result.Datas.map((item, index) => ({
            uid: item.Guid,
            name: item.FileName,
            status: 'done',
            url: '/' + item.Url,
          }))
          callback && callback(fileList)
          yield update({
            fileList,
          })
        }
      } else {
        callback && callback([])
        yield update({
          fileList: [],
        })
      }
    },

    // 文件上传
    * fileUpload({ payload }, { call, update, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      // let body = {
      //   params: { ...payload },
      //   sysConfig
      // };
      let body = payload;
      const result = yield call(services.exportTemplet, body);
      if (result.IsSuccess) {
        // result.Datas && window.open(result.Datas)
      } else {
        message.error(result.Datas)
      }
    },

    // 导出报表
    * exportDataExcel({ payload }, { call, select, update }) {
      const state = yield select(state => state.autoForm);
      const postData = getQueryParams(state, payload);
      const sysConfig = yield select(state => state.global.configInfo);
      // let body = {
      //   params: { ...postData, ...payload },
      //   sysConfig
      // };
      let body = payload;

      const result = yield call(services.exportDataExcel, body);
      if (result.IsSuccess) {
        console.log('suc=', result)
        result.Datas && window.open(result.Datas)
      } else {
        message.error(result.reason)
      }
    },
    // 下载导入模板
    * exportTemplet({ payload }, { call, update, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      // let body = {
      //   params: payload,
      //   sysConfig
      // };
      let body = payload;
      const result = yield call(services.exportTemplet, body);
      if (result.IsSuccess) {
        result.Datas && window.open(result.Datas)
      } else {
        message.error(result.Datas)
      }
    },

    // 下载导入模板
    * deleteAttach({ payload }, { call, update }) {
      const result = yield call(services.deleteAttach, { ...payload });
      if (result.IsSuccess) {
        message.success("删除成功！")
      } else {
        message.error(result.Datas)
      }
    },
    // 校验重复
    * checkRepeat({ payload, callback }, { call, update, select }) {
      const sysConfig = yield select(state => state.global.configInfo);
      // let body = {
      //   params: payload,
      //   sysConfig
      // };
      let body = payload;
      const result = yield call(services.checkRepeat, body);
      if (result.IsSuccess) {
        callback && callback(result.Datas)
      } else {
      }
    },
  },
  reducers: {
    // 保存搜索框数据
    saveConfigIdList(state, action) {
      return {
        ...state,
        configIdList: {
          ...state.configIdList,
          ...action.payload,
        },
      };
    },
  },
});
