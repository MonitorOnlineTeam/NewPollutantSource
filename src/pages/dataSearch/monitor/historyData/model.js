/*
 * @desc: 历史数据
 * @Author: jab
 * @Date: 2020.07.30
 */
import Model from '@/utils/model';
import { getAllTypeDataList , getpollutantListByDgimn,getAllChatDataLists,querypollutantlist,exportHistoryReport } from './service';
import { formatPollutantPopover } from '@/utils/utils';
import moment from 'moment';
import {  message,Tooltip } from 'antd';
import { red,yellow } from '@ant-design/colors';
export default Model.extend({
  namespace: 'historyData',
  state: {
    pollutantlist :[],
    tableDatas: [],
    columns:[],
    summary:[],
    total:"",
    loading:true,
    dgimn:"yastqsn0000002",
    historyparams: {
      datatype: 'hour',
      DGIMN: "yastqsn0000002",
      DGIMNs: "yastqsn0000002",
      pageIndex: null,
      pageSize: null,
      beginTime:  moment(moment(new Date()).format('YYYY-MM-DD 00:00:00')),
      endTime: moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')),
      pollutantCodes: null,
      pollutantNames: null,
      unit: null,
      isAsc: true,
    },
    chartparams:{
      DGIMN:["aq140421008"],
      PollutantCode:["08","07","01","02","03","05"],
      BeginTime:"2020-05-01 00:00:00",
      EndTime:"2020-08-31 23:00:00",
      DataType:"hour",
      PollutantType:"5"
    },
    timeList:[],
    chartList:[],
    alreadySelect:[],
    pollutantDefault:[],
    pollType:"5",
    tableloading:true
  },
  effects: {
     // 获取数据获取率 - 详情污染物列表
        *getPollutantList({callback, payload }, { call, update }) {
          const result = yield call(querypollutantlist, payload);
          if (result.IsSuccess) {
            yield update({ pollutantlist: result.Datas  })
            callback(result.IsSuccess)

          } else {
            // message.error(result.Message)
          }
        },



    * getAllTypeDataList( { payload},{  call, update, put, take, select}) { //表格数据
      // console.log("dgimn=", dgimn);
      const body = {
        ...payload
      }
      yield update({tableloading:true}); //更新state的值

      const result = yield call(getAllTypeDataList, { ...body });

      if (result.IsSuccess) {
        const { pollutantlist } = yield select(_ => _.historyData); //获取state的值
        let columns = [{title: '监测时间', dataIndex: 'MonitorTime', key: 'MonitorTime',align: 'center', children: [
                         { title: '标准值', dataIndex: 'MonitorTime',key: 'MonitorTime',align: 'center'}]}]
        // if (pollutantlist.length > 6) {
        //   width = (window.screen.availWidth - 200 - 120) / pollutantlist.length;
        //   if (width < 200) {
        //     width = 200;
        //   }
        //   tablewidth = width * pollutantlist.length + 200;
        pollutantlist.length>0? pollutantlist.map((item,index)=>{
          result.Datas.length > 0 ? Object.keys(result.Datas[1]).map(items =>{
              if(item.PollutantCode == items){
                columns.push({title:` ${item.PollutantName}  ${item.Unit? "("+item.Unit+")": ""} `, dataIndex: item.PollutantCode, key: item.PollutantCode ,align: 'center',
                children: [
                  {
                    title: item.StandardValue,
                    dataIndex: item.PollutantCode,
                    key: item.PollutantCode,
                    align: 'center',
                    render: (value, row, index) => {
                   // 1§1§0值异常   
                         if(row[`${item.PollutantCode}_params`]){ // 数据异常 异常§异常类别编号§异常类别名称
                          return <Tooltip placement="right" title={row[`${item.PollutantCode}_params`].split["§"][2]}>
                                <span style={{color:red.primary}}>{ `1§${item.IsException}§${item.ExceptionType}`}</span>
                               </Tooltip>
                         }
                        if(row[`${item.PollutantCode}_params`]){ // 数据超标  超标§报警颜色§标准值§超标倍数
                          return <Tooltip placement="right" title={row[`${item.PollutantCode}_params`].split["§"][3]}>
                                 <span style={{color:yellow.primary}}>{ `0§null§${item.StandardValue}§${item.OverStandValue}`}</span>
                                 </Tooltip>

                      } else {
                        return  <span>{value}</span>

                      }

                    }
                  }],      
                })
              }
            }) : null;
           


             
        }) : null;
        yield update({columns: columns, tableDatas: result.Datas, total: result.Total,tableloading:false}); //更新state的值
      }
    },
    * getAllChatDataList( { payload},{  call, update, put, take, select}) {
      const body = { ...payload }
      const result = yield call(getAllChatDataLists, { ...body });
      if (result.IsSuccess) {
        yield update({ timeList: result.Datas.timeList, chartList: result.Datas.chartList}); //更新state的值
      }
    },

    // * getPollutantlist( { payload},{   call, update,select}){
    //   // const body = {  ...payload }
    //   // const result = yield call(getAllTypeDataList, { ...body });
    //   const { pollutantlist } = yield select(_ => _.historyData); //获取state的值


    // },
    // 导出报表
        *exportHistoryReports({ payload }, { call, put, update, select }) {
          const { historyparams } = yield select(state => state.historyData);
          const postData = {  ...historyparams,DGIMNs: historyparams.DGIMN,...payload,
          }
          const result = yield call(exportHistoryReport, postData);
          if (result.IsSuccess) {
            window.open(result.Datas)
            message.success('导出成功')
          } else {
            message.error(result.Message)
          }
        },
  },
});
