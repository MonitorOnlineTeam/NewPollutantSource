import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message } from 'antd';
import { router } from 'umi';
import config from '@/config';
import { downloadFile, requestPost } from '@/utils/utils';
import { API } from '@config/API';
export default Model.extend({
  namespace: 'operaPlan',
  state: {
    tableDatas: [1],
    tableTotal: 0,
    queryPar: {},
    commonCol:(type)=>[{
        title: '序号',
        ellipsis: true,
        render: (text, record, index) => {
            return index + 1;
        }
     },
    {
        title: '计划编号',
        dataIndex: 'projectCode',
        key: 'projectCode',
        ellipsis: true,
    },
    {
        title: type==1? '项目编号' : '合同编号',
        dataIndex: 'projectCode',
        key: 'projectCode',
        ellipsis: true,
    },
    {
        title: '合同名称',
        dataIndex: 'projectName',
        key: 'projectName',
        ellipsis: true,
    },
    {
        title: '污染源企业',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
        ellipsis: true,
    },
    {
        title: '运维单位',
        dataIndex: 'dd',
        key: 'dd',
        width: 90,
        ellipsis: true,
    },
    {
        title: '点位类别',
        dataIndex: 'problemStatusName',
        key: 'problemStatusName',
        ellipsis: true,
    },
    {
        title: '计划起始日期',
        dataIndex: 'solveUserName',
        key: 'solveUserName',
        ellipsis: true,
    },
    {
        title: '计划结束日期',
        dataIndex: 'problemTime',
        key: 'problemTime',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'dd',
        key: 'dd',
        ellipsis: true,
    },
    {
        title: '备注',
        dataIndex: 'problemTime',
        key: 'problemTime',
        ellipsis: true,
    },
    {
        title: '创建人',
        dataIndex: 'createUserName',
        key: 'createUserName',
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
    },]
    
  },
  effects: {
    // 左侧数据
    *GetResourceOverviewLeft({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ResourceOverviewApi.GetResourceOverviewLeft, payload);
      if (result.IsSuccess) {
        yield update({
          tableDatas: result.Datas,
          tableTotal: result.Total,
          queryPar: payload,
        });
      }
    },
  
    // 基础数据 - 导出
    *ExportDisposableServiceInfo({ payload, callback }, { call, put, update }) {
      const result = yield call(requestPost, API.ReportsViewsApi.ExportDisposableServiceInfo, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      }
    },
  },
});
