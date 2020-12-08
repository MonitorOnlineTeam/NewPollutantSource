/*
 * @desc: 历史数据
 * @Author: jab
 * @Date: 2020.07.30
 */
import Model from '@/utils/model';
import { getAllTypeDataList , getpollutantListByDgimn,getAllChatDataLists,querypollutantlist,exportHistoryReport } from './service';
import moment from 'moment';
import {  message,Tooltip } from 'antd';
import { red,yellow,gold  } from '@ant-design/colors';

import { formatPollutantPopover,downloadFile} from '@/utils/utils';
import { onlyOneEnt,uploadHost } from '@/config';

export default Model.extend({
  namespace: 'historyData',
  state: {
    title:"",
    pollutantlist :[],
    tableDatas: [],
    // columns:[],
    summary:[],
    total:"",
    pollLoading:true,
    // dgimn:"aq140421009",
    dgimn:"",
    historyparams: {
      datatype: 'hour',
      DGIMN: "",
      DGIMNs: "",
      pageIndex: null,
      pageSize: null,
      beginTime: '',
      endTime: '',
      pollutantCodes: null,
      pollutantNames: null,
      unit: null,
      isAsc: false,
      Flag:0//1 显示 0 不显示
    },
    chartparams:{
      DGIMN:[""],
      PollutantCode:[],
      BeginTime:"",
      EndTime:"",
      DataType:"",
      PollutantType:""
    },
    timeList:[],
    chartList:[],
    alreadySelect:[],
    pollutantDefault:[],
    pollType:"",
    tableloading:true,
    singFlag:true,
    selectpoll:[],
    columns : [
      {title: '监测时间',
      dataIndex: 'MonitorTime', key: 'MonitorTime',align: 'center', 
      defaultSortOrder: 'descend',
      // sortOrder: 'descend',
      sorter: (a, b) => Number(moment( new Date(a.MonitorTime)).valueOf()) -   Number(moment( new Date(b.MonitorTime)).valueOf()),
      width:120,
      children: [ { title: '标准值',dataIndex: 'MonitorTime',key: 'MonitorTime',width:120,align: 'center'}]}]
  },
  effects: {
     // 获取数据获取率 - 详情污染物列表
        *getPollutantList({callback, payload }, { call, update }) {
          yield update({ pollLoading:true  })
          const result = yield call(querypollutantlist, payload);
          if (result.IsSuccess) {
            yield update({ pollutantlist: result.Datas,selectPoll: result.Datas, pollLoading:false  })
            callback(result.IsSuccess)

          } else {
            message.error(result.Message)
          }
        },



    * getAllTypeDataList( { payload},{  call, update, put, take, select}) { //表格数据
      const body = {
        ...payload
      }
      yield update({tableloading:true}); //更新state的值
      // let csyxl = 0;
      // let gwidth = 300 + 140 + 70;
      // if (!onlyOneEnt) {
      //   gwidth += 300;
      // }
      
      const result = yield call(getAllTypeDataList, { ...body });
      if (result.IsSuccess) {
        const { selectPoll } = yield select(_ => _.historyData); //获取state的值
        const { sortOrder } = yield select(_ => _.historyData); //获取state的值
        // const { columns } = yield select(_ => _.historyData); //获取state的值
         

        let columns = [
          {title: '监测时间',
          dataIndex: 'MonitorTime', key: 'MonitorTime',align: 'center', 
          defaultSortOrder: 'descend',
          // sortOrder: sortOrder,
          sorter: (a, b) => Number(moment( new Date(a.MonitorTime)).valueOf()) -   Number(moment( new Date(b.MonitorTime)).valueOf()),
          width:120,
          children: [ { title: '标准值',dataIndex: 'MonitorTime',key: 'MonitorTime',width:120,align: 'center'}]}]
          selectPoll.length>0 ? selectPoll.map((item,index)=>{
          // result.Datas.length > 0 ? Object.keys(result.Datas[0]).map(items =>{
          //     if(item.PollutantCode == items){
                columns.push({title:` ${item.PollutantName}  ${item.Unit? "("+item.Unit+")": ""} `,  dataIndex: item.PollutantCode, key: item.PollutantCode ,align: 'center',
                children: [
                  {
                    title: item.StandardValue,
                    dataIndex: item.PollutantCode,
                    key: item.PollutantCode,
                    align: 'center',
                    render: (value, row, index) => {
                     // 1§1§0值异常   
                         if(row[`${item.PollutantCode}_params`]){// 数据超标  超标§报警颜色§标准值§超标倍数
                              if(row[`${item.PollutantCode}_params`].split("§")[0]==="0"){
                                return <Tooltip placement="right" title={`数据超标：${row[`${item.PollutantCode}_params`].split("§")[2]}`}>
                                <span style={{color:red.primary,cursor:"pointer"}}>{ value }</span>
                                </Tooltip>
                              }
                            if(row[`${item.PollutantCode}_params`].split("§")[0] === "1"){   // 数据异常 异常§异常类别编号§异常类别名称 
                              return <Tooltip placement="right" title={row[`${item.PollutantCode}_params`].split("§")[2]}>
                                 <span style={{color:gold[5],cursor:"pointer"}}>{ value}</span>
                                 </Tooltip>
                                 }
                

                      } else {
                        return  <span>{value?value:'-'}</span> 

                      }

                    }
                  }],      
                })
            //   }
            // }) : null;
           


             
        }) : columns=[];
        yield update({columns: columns, tableDatas: result.Datas, total: result.Total,tableloading:false}); //更新state的值
      
      }else {
        yield update({tableloading:false,columns:[],tableDatas:[]}); //更新state的值
        message.error(result.Message)
      }
    },
    * getAllChatDataList( {callback, payload},{  call, update, put, take, select}) {
      const body = { ...payload }
      const result = yield call(getAllChatDataLists, { ...body });
      if (result.IsSuccess) {
        yield update({ timeList: result.Datas.timeList, chartList: result.Datas.chartList}); //更新state的值
        callback(result.IsSuccess)
      }
    },


    // 导出报表
        *exportHistoryReports({ payload }, { call, put, update, select }) {
          const result = yield call(exportHistoryReport, payload);
          if (result.IsSuccess) {

            downloadFile(`/upload${result.Datas}`)
            // let link = document.createElement('a');
            // link.href =  `${uploadHost}upload${result.Datas}`;
            // link.style = 'display:none';
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // message.success('导出成功')
          } else {
            message.error(result.Message)
          }
        },
  },
});
