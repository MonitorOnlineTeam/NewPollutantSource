/**
 * 功  能：设备异常率
 * 创建人：jab
 * 创建时间：2021.2.24
 */
import moment from 'moment';
import * as services from '../services/equipmentAbnormalRate';
import Cookie from 'js-cookie';
import Model from '@/utils/model';
import { message,Progress } from 'antd';
import { router } from 'umi';
import config from '@/config'
import { downloadFile } from '@/utils/utils';


export default Model.extend({
  namespace: 'equipmentAbnormalRate',
  state: {
    regTableDatas:[],
    regDetailTableDatas:[],
    pointTableDatas:[],
    queryPar:{},
    coommonCol : [
        {
          title: <span>异常类别（率）</span>,
          align:'center',
          children: [
            {
              title: '数据缺失',
              dataIndex: 'missingDataRate',
              key: 'missingDataRate',
              width: 150,
              align:'center',
              sorter: (a, b) => a.missingDataRate - b.missingDataRate,
              render: (text, record) => {
                return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
              }
            },
            {
              title: '在线监测系统停运',
              dataIndex: 'onLineShutdownRate',
              key: 'onLineShutdownRate',
              width: 200,
              align:'center',
              sorter: (a, b) => a.onLineShutdownRate - b.onLineShutdownRate,
              render: (text, record) => {
                return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
              }
            },
            {
              title: '数据恒定值',
              dataIndex: 'dataConstantRate',
              key: 'dataConstantRate',
              width: 150,
              align:'center',
              sorter: (a, b) => a.dataConstantRate - b.dataConstantRate,
              render: (text, record) => {
                return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
              }
            },
            {
              title: '数据零值',
              dataIndex: 'dataZeroRate',
              key: 'dataZeroRate',
              width: 150,
              align:'center',
              sorter: (a, b) => a.dataZeroRate - b.dataZeroRate,
              render: (text, record) => {
                return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
              }
            },
            {
              title: '故障数据',
              dataIndex: 'faultDataRate',
              key: 'faultDataRate',
              width: 150,
              align:'center',
              sorter: (a, b) => a.faultDataRate - b.faultDataRate,
              render: (text, record) => {
                return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
              }
            },
            {
              title: '系统维护数据',
              dataIndex: 'systemMaintenanceRate',
              key: 'systemMaintenanceRate',
              width: 150,
              align:'center',
              sorter: (a, b) => a.systemMaintenanceRate - b.systemMaintenanceRate,
              render: (text, record) => {
                return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
              }
            },
           ]
          },
          {
            title: '异常率',
            dataIndex: 'exceptionRate',
            key: 'exceptionRate',
            width: 150,
            align:'center',
            sorter: (a, b) => a.exceptionRate - b.exceptionRate,
            render: (text, record) => {
              return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
            }
          },
          {
            title: '完好率',
            dataIndex: 'intactRate',
            key: 'intactRate',
            width: 150,
            align:'center',
            sorter: (a, b) => a.intactRate - b.intactRate,
            render: (text, record) => {
              return<Progress percent={text&&text}  size="small" style={{width:'85%'}} status='normal'  format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text + '%'}</span>}  />
            }
          }
        
       ],
       exportRegLoading:false,
       exportRegDetailLoading: false,
       exportPointLoading: false,
  },
  effects: {
    *regGetExecptionRateList({ payload,callback }, { call, put, update }) { //行政区
      const result = yield call(services.regGetExecptionRateList, payload);
      if (result.IsSuccess) {
        yield update({
          regTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    },
    *regDetailGetExecptionRateList({ payload,callback }, { call, put, update }) { // 行政区详情
      const result = yield call(services.regDetailGetExecptionRateList, payload);
      if (result.IsSuccess) {
        yield update({
          regDetailTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    },
    *pointGetExecptionRateList({ payload,callback }, { call, put, update }) { // 监测点
      const result = yield call(services.pointGetExecptionRateList, payload);
      if (result.IsSuccess) {
        yield update({
          pointTableDatas:result.Datas,
        })
      }else{
        message.error(result.Message)
      }
    }, 
    *exportExecptionRateList({ payload,callback }, { call, put, update }) { //导出
      const exportStatus = (flag) =>{
        return payload.pointType==1? {exportRegLoading: flag}:
               payload.pointType==2 ? {exportRegDetailLoading: flag}:{exportPointLoading: flag}
        }
        yield update(exportStatus(true))
        const result = yield call(services.exportExecptionRateList, payload);
         if (result.IsSuccess) {
            message.success('下载成功');
           downloadFile(`/upload${result.Datas}`);
           yield update(exportStatus(false))
          } else {
         message.warning(result.Message);
         yield update(exportStatus(false))
       }
    },
  },
})