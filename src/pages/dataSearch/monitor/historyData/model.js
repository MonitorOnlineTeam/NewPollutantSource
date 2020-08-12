/*
 * @desc: 历史数据
 * @Author: jab
 * @Date: 2020.07.30
 */
import Model from '@/utils/model';
import { getAllTypeDataList , getpollutantListByDgimn,getAllChatDataLists,querypollutantlist } from './service';
import { formatPollutantPopover } from '@/utils/utils';
import moment from 'moment';

export default Model.extend({
  namespace: 'historyData',
  state: {
    pollutantlist :[],
    tableDatas: [],
    columns:[],
    summary:[],
    total:"",
    loading:true,
    dgimn:"140100000224001",
    historyparams: {
      datatype: 'hour',
      DGIMN: "51052216080301",
      DGIMNs: "51052216080301",
      pageIndex: null,
      pageSize: null,
      beginTime: moment().startOf('day').format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment().format("YYYY-MM-DD HH:mm:ss"),
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
    pollType:""
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
      const result = yield call(getAllTypeDataList, { ...body });

      
      if (result.IsSuccess) {
        const { pollutantlist } = yield select(_ => _.historyData); //获取state的值
        let columns = [{title: '时间', dataIndex: 'MonitorTime', key: 'MonitorTime',align: 'center'}]
        // if (pollutantlist.length > 6) {
        //   width = (window.screen.availWidth - 200 - 120) / pollutantlist.length;
        //   if (width < 200) {
        //     width = 200;
        //   }
        //   tablewidth = width * pollutantlist.length + 200;
        pollutantlist.map((item,index)=>{
            Object.keys(result.Datas[1]).map(items =>{
              if(item.PollutantCode == items){
                columns.push({title:` ${item.PollutantName}  ${item.Unit? "("+item.Unit+")": ""} `, dataIndex: item.PollutantCode, key: item.PollutantCode ,align: 'center', 
                        render: (value, record, index) => {
                              if(value && value[`${item.PollutantCode}_over`]){
                                return <span style={{color:"red"}}>{value}</span>
                              }else if(value && value[`${item.PollutantCode}_warning`]){
                                return <span style={{color:"yellow"}}>{value}</span>
                              } else{
                                return <span>{value} </span> 
                              }
  
               }})
              }
            })
           


             
        });
        yield update({columns: columns, tableDatas: result.Datas, total: result.Total}); //更新state的值
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
        *exportHistoryReport({ payload }, { call, put, update, select }) {
          const { historyparams } = yield select(state => state.historyData);
          const postData = {  ...historyparams,DGIMNs: historyparams.DGIMN,...payload,
          }
          const result = yield call(services.exportHistoryReport, postData);
          if (result.IsSuccess) {
            window.open(result.Datas)
            message.success('导出成功')
          } else {
            message.error(result.Message)
          }
        },
  },
});
