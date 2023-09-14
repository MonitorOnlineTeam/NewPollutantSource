import * as services from './services';
import Model from '@/utils/model';
import { message } from 'antd';
import moment from 'moment';
import { downloadFile } from '@/utils/utils';
import { ModelNumberIdsDatas } from './CONST';

function initWarningForm() {
  let warningForm = {};
  for (const key in ModelNumberIdsDatas) {
    warningForm[key] = {
      date: [
        moment()
          .subtract(1, 'month')
          .startOf('day'),
        moment().endOf('day'),
      ],
      warningTypeCode: [],
      pageSize: 20,
      pageIndex: 1,
    };
  }
  return warningForm;
}

export default Model.extend({
  namespace: 'dataModel',
  state: {
    warningForm: initWarningForm(),
    modelList: [],
    relationDGIMN: [],
    ModelInfoAndParams: {
      modelInfo: {},
      dataAttribute: {},
    },
    allTypeDataList: [],
  },
  effects: {
    // 获取报警记录
    *GetWarningList({ payload, callback }, { call, select, update }) {
      const state = yield select(state => state.dataModel);

      // ...values,
      // Dgimn: values.DGIMN,
      // warningTypeCode: warningTypeCode,
      // date: undefined,
      // beginTime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
      // endTime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
      // modelNumber: modelNumber,

      let currentForm = state.warningForm[payload.modelNumber];
      const result = yield call(services.GetWarningList, {
        ...payload,
        pageSize: currentForm.pageSize,
        pageIndex: currentForm.pageIndex,
      });
      if (result.IsSuccess) {
        callback && callback(result);
        // callback({
        //   IsSuccess: true,
        //   Message: '操作成功！',
        //   Datas: [
        //     {
        //       EntCode: '000ff3e0-d620-403d-8389-e12ce731bfc0',
        //       EntNmae: '新疆金正建投工程集团有限公司',
        //       PointName: '废水排放口',
        //       Dgimn: '399435tmskwsc2',
        //       ModelWarningGuid: '26c4214e-3a64-47e0-bc76-8191bf753ebd',
        //       WarningTime: '2023-06-02 14:42:12',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '有报警了',
        //       CheckedResultCode: '1',
        //       CheckedResult: '不实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '00285113-f53b-4cdf-902a-7e749437588e',
        //       EntNmae: '图木舒克创能热力有限责任公司（四十五团供热锅炉）',
        //       PointName: '1#锅炉',
        //       Dgimn: '020003xdcbd11c',
        //       ModelWarningGuid: '63b6962c-b921-4989-a109-4cc553b9fa7c',
        //       WarningTime: '2023-06-02 14:44:43',
        //       WarningTypeCode: '9104ab9f-d3f3-4bd9-a0d9-898d87def4dd',
        //       WarningTypeName: '监测样品为空气（拔管）',
        //       WarningContent: '模型2有报警',
        //       CheckedResultCode: '2',
        //       CheckedResult: '属实',
        //       RegionCode: '660300000',
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司1',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD1',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司2',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD2',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司3',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD3',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司4',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD4',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司5',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD5',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司6',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD6',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司7',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD7',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司8',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD8',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司9',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD9',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //     {
        //       EntCode: '04ca273e-7264-4e42-97ec-b55d1ac329eb',
        //       EntNmae: '嘉峪关思安节能有限公司10',
        //       PointName: '废气排口',
        //       Dgimn: '62020131jsap01',
        //       ModelWarningGuid: 'B48F5BE1-D6D2-49E2-8112-F02E2E0C77CD91',
        //       WarningTime: '2023-06-06 09:20:20',
        //       WarningTypeCode: '928ec327-d30d-4803-ae83-eab3a93538c1',
        //       WarningTypeName: '机组停运',
        //       WarningContent: '测试机组停运cg造的数据',
        //       CheckedResultCode: '3',
        //       CheckedResult: '未核实',
        //       RegionCode: null,
        //     },
        //   ],
        //   Total: 22,
        //   StatusCode: 200,
        // });
      } else {
        message.error(result.Message);
      }
    },
    // 重置报警记录form
    *onReset({ payload, callback }, { call, select, update }) {
      let state = yield select(state => state.dataModel);
      let current = state.warningForm[payload.modelNumber];
      yield update({
        warningForm: {
          ...state.warningForm,
          [payload.modelNumber]: {
            date: [
              moment()
                .subtract(1, 'month')
                .startOf('day'),
              moment().endOf('day'),
            ],
            warningTypeCode: [],
          },
        },
      });
    },
    // 获取模型列表
    *GetModelList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetModelList, payload);
      if (result.IsSuccess) {
        let unfoldModelList = [];
        result.Datas.map(item => {
          unfoldModelList = unfoldModelList.concat(item.ModelList);
        });
        console.log('unfoldModelList', unfoldModelList);
        let modelList = result.Datas.sort((a, b) => a.ModelTypeCode - b.ModelTypeCode);
        callback && callback(modelList, unfoldModelList);
        yield update({
          modelList: modelList,
        });
      } else {
        message.error(result.Message);
      }
    },
    // 模型状态开启关闭
    *SetMoldStatus({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SetMoldStatus, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取报警及核实信息（上、下部分）
    *GetSingleWarning({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetSingleWarning, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取模型快照数据
    *GetSnapshotData({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetSnapshotData, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        // message.error(result.Message);
      }
    },
    // 获取点位参数配置
    *GetPointParamsRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetPointParamsRange, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        // message.error(result.Message);
      }
    },
    // 保存点位参数配置
    *SavePointParamsRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SavePointParamsRange, payload);
      if (result.IsSuccess) {
        message.success('操作成功！');
        callback && callback();
      } else {
        // message.error(result.Message);
      }
    },
    // 获取模型基础信息和参数配置
    *GetModelInfoAndParams({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetModelInfoAndParams, payload);
      if (result.IsSuccess) {
        yield update({
          ModelInfoAndParams: {
            modelInfo: result.Datas.modelInfo || {},
            dataAttribute: result.Datas.dataAttribute || {},
          },
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 保存模型基础信息和参数配置
    *SaveModelInfoAndParams({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SaveModelInfoAndParams, payload);
      if (result.IsSuccess) {
        callback && callback();
        message.success('保存成功！');
      } else {
        message.error(result.Message);
      }
    },
    // 保存已关联排口
    *SaveModelRelationDGIMN({ payload, callback }, { call, select, update }) {
      const result = yield call(services.SaveModelRelationDGIMN, payload);
      if (result.IsSuccess) {
        message.success('保存成功！');
        callback && callback();
      } else {
        message.error(result.Message);
      }
    },
    // 获取已关联排口
    *GetModelRelationDGIMN({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetModelRelationDGIMN, payload);
      if (result.IsSuccess) {
        yield update({
          relationDGIMN: result.Datas.relationDGIMN,
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取报警数据
    *GetAllTypeDataListForModel({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetAllTypeDataListForModel, payload);
      if (result.IsSuccess) {
        yield update({
          allTypeDataList: result.Datas,
        });
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取报警数据
    *GetAllTypeDataListForModel2({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetAllTypeDataListForModel, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 导出报警关联数据
    *ExportHourDataForModel({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportHourDataForModel, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取直方图数据
    *StatisPolValueNumsByDGIMN({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisPolValueNumsByDGIMN, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取相关系数图数据
    *StatisLinearCoefficient({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisLinearCoefficient, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 根据企业获取排口
    *getPointByEntCode({ payload, callback }, { call, select, update }) {
      const result = yield call(services.getPointByEntCode, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取模型精度版本列表
    *GetEvaluationVersionList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetEvaluationVersionList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取模型精度数据
    *GetEvaluationList({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetEvaluationList, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 报警统计 - 线索信息统计
    *StatisAlarmInfo({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfo, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 报警统计 - 统计核实、异常原因
    *StatisAlarmInfoCheck({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoCheck, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 报警统计 - 核实次数及企业及模型执行率
    *StatisAlarmInfoRate({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoRate, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 报警统计 - 已选择行统计
    *StatisAlarmInfoSum({ payload, callback, errorCallback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoSum, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        errorCallback && errorCallback();
        message.error(result.Message);
      }
    },
    // 线索信息统计
    *StatisAlarmInfoIndiz({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisAlarmInfoIndiz, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 获取全企业波动范围
    *StatisNormalRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisNormalRange, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 全企业波动范围 - 导出
    *ExportStatisNormalRange({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisNormalRange, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 场景模型分析报告 - 导出
    *ExportStatisAlarmReport({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisAlarmReport, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 场景模型分析报告 - 全模型导出
    *ExportStatisAlarmAllReport({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisAlarmReport, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 场景模型分析 - 导出
    *ExportStatisAlarm({ payload, callback }, { call, select, update }) {
      const result = yield call(services.ExportStatisAlarm, payload);
      if (result.IsSuccess) {
        message.success('导出成功！');
        downloadFile(result.Datas);
        // window.open(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 根据企业获取排口
    *GetNoFilterPointByEntCode({ payload, callback }, { call, select, update }) {
      const result = yield call(services.GetNoFilterPointByEntCode, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 首页 - 数据统计分析
    *StatisForData({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisForData, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 首页 - 线索核实情况和企业排名
    *StatisVeriAndEr({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisVeriAndEr, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
    // 首页 - 线索统计
    *StatisTipMsg({ payload, callback }, { call, select, update }) {
      const result = yield call(services.StatisTipMsg, payload);
      if (result.IsSuccess) {
        callback && callback(result.Datas);
      } else {
        message.error(result.Message);
      }
    },
  },
});
