/**
 * 功  能：远程督查 详情
 * 创建人：jab
 * 创建时间：2022.3.16
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Checkbox, Upload, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';


import { RollbackOutlined } from '@ant-design/icons';

import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from "../style.less"
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import AttachmentView from '../components/AttachmentView'

const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'remoteSupervision'




const dvaPropsData =  ({ loading,remoteSupervision,global }) => ({
  tableLoading: loading.effects[`${namespace}/getConsistencyCheckInfo`],
  clientHeight: global.clientHeight,
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getConsistencyCheckInfo:(payload,callback)=>{ 
      dispatch({
        type: `${namespace}/getConsistencyCheckInfo`,
        payload:payload,
        callback:callback,
      })
    },
  }
}
const Index = (props) => {
    const {match: { params : {id:id} },tableLoading,type,clientHeight }= props;
   
    const [rangeUpload,setRangeUpload] = useState()
    const [couUpload,setCouUpload] = useState()
    const [consistencyCheckDetail,setConsistencyCheckDetail] = useState({})
    const [tableData1,setTableData1] = useState([])  
    const [tableData2,setTableData2] = useState([])  
   
    const [dasRangStatus,setDasRangStatus] = useState(false)
    const [dataRangStatus,setDataRangStatus] = useState(false)
    const [dataRealTimeRangStatus,setDataRealTimeRangStatus] = useState(false) //数采仪实时数据
    const isMobile = props.match.path &&props.match.path == '/appoperation/appRemoteSupervisionDetail/:id' ? true : false;
  useEffect(() => {
    props.getConsistencyCheckInfo({ID:id},(data)=>{ //DAS量程
      setRangeUpload(data.rangeUpload)
      setCouUpload(data.couUpload)
      setConsistencyCheckDetail(data)
      
      if(data.consistencyCheckList&&data.consistencyCheckList[0]){//获取das量程和数采仪量程是否被选中
        setDasRangStatus(data.consistencyCheckList[0].DataList.DASStatus==1? true :  false)
        setDataRangStatus(data.consistencyCheckList[0].DataList.DataRangeStatus==1? true :  false)
        setDataRealTimeRangStatus(data.consistencyCheckList[0].DataList.DataStatus==1? true :  false)
      }


     // 量程一致性核查表 数据
     let data1 = data.consistencyCheckList&&data.consistencyCheckList.filter(item=> !(item.DataList.CouType&&item.PollutantName==='颗粒物' || !item.DataList.CouType&&!item.DataList.Special&&item.PollutantName==='流速'))
      let flag1 = true,flag2=true;
      for(let i=0;i<data1.length;i++){
         if(data1[i].PollutantName === '颗粒物'){
            data1.splice(i+1,0,{PollutantName:'颗粒物',DataList:{ flag:data1[i].DataList.Special==1? 1 :2  }})
            flag1 = false;
            break;
         }
      }
      for(let j=0;j<data1.length;j++){
        if(data1[j].PollutantName === '流速'){  
          data1.splice(j+1,0,{PollutantName:'流速',DataList:{ flag:data1[j].DataList.Special==1? 1 :2}})
          flag2 = false;
          break;
       }

     }


      //颗粒物或流速都未选择的状态
      for(let k=0;k< data.consistencyCheckList.length;k++){
        if(flag1&&data.consistencyCheckList[k].PollutantName==='颗粒物'){
          data1.splice(k,0,{PollutantName:'颗粒物',DataList:{ flag:3 }},{PollutantName:'颗粒物',DataList:{ flag:4 }})
          break;
        }
      }
      for(let l=0;l< data.consistencyCheckList.length;l++){
      if(flag2&&data.consistencyCheckList[l].PollutantName==='流速'){
        data1.splice(l,0,{PollutantName:'流速',DataList:{ flag:3 }},{PollutantName:'流速',DataList:{ flag:4 }})
        break;
      }
      }
    //  setTimeout(()=>{
      setTableData1(data1)

     // 实时数据一致性核查表 数据
     let data2 = data.consistencyCheckList&&data.consistencyCheckList.filter(item=> !(item.DataList.Special&&item.PollutantName==='颗粒物'))
     
     setTableData2(data2)


      })    
    //  })


  
  },[]);
  
  const getAttachmentDataSource = (fileInfo)=> {
    const  fileList =[];
      if(fileInfo&&fileInfo[0]){
      fileInfo.map(item => {
        if(!item.IsDelete){
            fileList.push({ name: item.FileName,   attach: item.FileName })
       }
    })
  }
   return fileList;
  }


  const columns1= [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
       
        if (text == '颗粒物' && record.DataList.Special || text == '流速' && record.DataList.Special)  {
          obj.props.rowSpan = 2;
        }
        if(text == '颗粒物' && record.DataList.flag==3 || text == '流速' && record.DataList.flag==3){
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && !record.DataList.Special && record.DataList.flag!=3 && record.DataList.flag!=4   || text == '流速' && !record.DataList.Special && record.DataList.flag!=3 && record.DataList.flag!=4 ) {
          obj.props.rowSpan = 0;
        }
        if ( text == '颗粒物' && record.DataList.flag==4 ||  text == '流速' && record.DataList.flag==4 ) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '量程一致性核查表',
      children: [
        {
          title: '有无显示屏',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:200,
          render: (text, record) => {
            if(text=='颗粒物'){
              if(record.DataList.Special&&record.DataList.Special==1 || record.DataList.flag==3){
                return   <Checkbox checked={ record.DataList.flag? false: true} >有显示屏</Checkbox> 
            }else if(record.DataList.Special&&record.DataList.Special==2 || record.DataList.flag==4){
              return <Checkbox checked={ record.DataList.flag? false: true} >无显示屏</Checkbox>
             }else if(record.DataList.flag==2){
              return  <Checkbox checked={false} >有显示屏</Checkbox>
             }else{
              return  <Checkbox checked={false} >无显示屏</Checkbox>
             }
          
          }else if(text=='流速'){
              if(record.DataList.Special&&record.DataList.Special==1 || record.DataList.flag==3){
                return   <div  style={{marginLeft:-12}}><Checkbox checked={ record.DataList.flag? false: true} >差压法</Checkbox></div>
            }else if(record.DataList.Special&&record.DataList.Special==2 || record.DataList.flag==4){
              return <Checkbox style={{marginLeft:15}} checked={ record.DataList.flag? false: true} >直测流速法</Checkbox>
             }else if(record.DataList.flag==2){
              return   <div  style={{marginLeft:-12}}><Checkbox checked={false} >差压法</Checkbox></div>
             }else{
              return  <Checkbox  style={{marginLeft:15}}   checked={false} >直测流速法</Checkbox>
             }
            
          }else {
              return '—'
            }

          }
        },
        {
          title: '分析仪量程',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:120,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            } else {
              return record.DataList.AnalyzerMin||record.DataList.AnalyzerMin==0 || record.DataList.AnalyzerMax||record.DataList.AnalyzerMax==0? `${record.DataList.AnalyzerMin}-${record.DataList.AnalyzerMax}${record.DataList.AnalyzerUnit ? `（${record.DataList.AnalyzerUnit}）` :''}` : null;
            }
          }
        },

        {
          title: '分析仪量程照片',
          align: 'center',
          dataIndex: 'AnalyzerFileList',
          key: 'AnalyzerFileList',
          width: 120,
          render: (text, record, index) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }
            const attachmentDataSource = getAttachmentDataSource(text);
            return <div>
             {text&&text[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />} 
            </div>;
          }
        },
        {
          // title: <Row align='middle' justify='center'> <Checkbox checked={dasRangStatus}></Checkbox><span style={{paddingLeft:5}}>DAS量程</span></Row>,
          title: 'DAS量程',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width:120,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            } else {
               return record.DataList.DASMin||record.DataList.DASMin==0 || record.DataList.DASMax||record.DataList.DASMax==0? `${record.DataList.DASMin}-${record.DataList.DASMax}${record.DataList.DASUnit ? `（${record.DataList.DASUnit}）` :''}` : null;
            }
          }
        },
        {
          title: 'DAS量程照片',
          align: 'center',
          dataIndex: 'DASFileList',
          key: 'DASFileList',
          width: 120,
          render: (text, record, index) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }
            const attachmentDataSource = getAttachmentDataSource(text);
            return <div>
             {text&&text[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />} 
            </div>;
          }
        },
        {
          // title: <Row align='middle' justify='center'><Checkbox checked={dataRangStatus}  ></Checkbox><span style={{paddingLeft:5}}>数采仪量程</span></Row>,
          title: '数采仪量程',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:150,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            } else {
              return record.DataList.DataMin||record.DataList.DataMin==0? `${record.DataList.DataMin}-${record.DataList.DataMax}${record.DataList.DataUnit ? `（${record.DataList.DataUnit}）` :''}` : null;

            }
          }
        },
        {
          title: '数采仪量程照片',
          align: 'center',
          dataIndex: 'RangeFileList',
          key: 'RangeFileList',
          width: 120,
          render: (text, record, index) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }
            const attachmentDataSource = getAttachmentDataSource(text);
            return <div>
             {text&&text[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />} 
            </div>;
          }
        },
        {
          title: '量程一致性(自动判断)',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:180,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }else{
              return record.DataList.RangeAutoStatus==1? '是' : record.DataList.RangeAutoStatus==2 ? '否' : null
            }
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:150,
          render: (text, record, index) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }else{  
              let  rangeStatus = record.DataList.RangeStatus;
              return rangeStatus==1? '是' : rangeStatus ==2 ? '否' : rangeStatus ==3 ?  '不适用':  rangeStatus ==4 ? '不规范' : null
            }
          }
        },
        {
          title: '运维人员量程备注',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 150,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }else{
              return record.DataList.OperationRangeRemark
            }
            
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 150,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }else{
              return record.DataList.RangeRemark
            }
            
          }
        },
        // {
        //   title: '附件',
        //   align: 'center',
        //   dataIndex: 'PollutantName',
        //   key: 'PollutantName',
        //   width: 150,
        //   render: (text, record, index) => {
        //     const attachmentDataSource = getAttachmentDataSource(rangeUpload);
        //     const obj = {
        //       children: <div>
        //         {rangeUpload&&rangeUpload[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
        //       </div>,
        //       props: {},
        //     };
        //     if (index === 0) {
        //       obj.props.rowSpan = tableData1.length;
        //     } else {
        //       obj.props.rowSpan = 0;
        //     }

        //     return obj;

        //   }
        // },
      ]
    },
  ]
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
       
        if (text == '颗粒物' && record.DataList.CouType == 1) {
          obj.props.rowSpan = 2;
        }
       if (text == '颗粒物' && record.DataList.CouType == 2) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '实时数据一致性核查表',
      children: [
        {
          title: '浓度类型',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 200,
          render: (text, record) => {
            return record.DataList.CouType == 1 ? '原始浓度' :  record.DataList.CouType == 2 ? '标杆浓度'  : '—'

          }
        },
        {
          title: '分析仪示值',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:120,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量' || record.PollutantName === '流速' || record.PollutantName === '颗粒物' && record.DataList.CouType  === 2) {
              return '—'
            }
            return record.DataList.AnalyzerCou || record.DataList.AnalyzerCou == 0 ? `${record.DataList.AnalyzerCou}${record.DataList.AnalyzerCouUnit ? `（${record.DataList.AnalyzerCouUnit}）` : ''}` : null;
          }
        },
        {
          title: 'DAS示值',
          // title: <Row align='middle' justify='center'><Checkbox checked={dasRangStatus} ></Checkbox> <span style={{paddingLeft:5}}>DAS示值</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:120,
          render: (text, record) => {
            return record.DataList.DASCou || record.DataList.DASCou == 0 ? `${record.DataList.DASCou}${record.DataList.DASCouUnit ? `（${record.DataList.DASCouUnit}）` : ''}` : null;
          }
        },
        {
          // title: <Row align='middle' justify='center'><Checkbox checked={dataRealTimeRangStatus} ></Checkbox><span style={{paddingLeft:5}}>数采仪实时数据</span></Row>,
          title: '数采仪实时数据',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:150,
          render: (text, record) => {
            if (record.PollutantName === 'NO' || record.PollutantName === 'NO2') {
              return '—'
            }else{
              return record.DataList.DataCou || record.DataList.DataCou == 0 ? `${record.DataList.DataCou}${record.DataList.DataCouUnit ? `（${record.DataList.DataCouUnit}）` : ''}` : null;
            }
          }
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 150,
          render: (text, record, index) => {
            const attachmentDataSource = getAttachmentDataSource(couUpload);
            const obj = {
              children: <div>
                   {couUpload&&couUpload[0]&&<AttachmentView style={{ marginTop: 10 }}  dataSource={attachmentDataSource} />}
              </div>,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = tableData2.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;

          }
        },
        {
          title: '数据一致性(自动判断)',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:150,
          render: (text, record) => {
              return record.DataList.CouAutoStatus==1? '是' : record.DataList.CouAutoStatus==2 ? '否' : null
          }

        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:150,
          render: (text, record) => {
            let  couStatus = record.DataList.CouStatus;
            return couStatus==1? '是' : couStatus ==2 ? '否' : couStatus ==3 ?  '不适用':  couStatus ==4 ? '不规范' : null
        }

        },
        {
          title: '运维人员核查备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 180,
          render: (text, record) => {
              return record.DataList.OperationDataRemark
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width:150,
          render: (text, record) => {
              return record.DataList.CouRemrak
          }
        },
      ]
    },
  ]
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '检查项目',
      dataIndex: 'ItemName',
      key: 'ItemName',
      align: 'center',
      width: 195,
      render: (text, record, index) => {
        return  <div style={{ textAlign: 'left' }}>{text}</div>
      }
    },
    // {
    //   title: '是否启用',
    //   align: 'center',
    //   dataIndex: 'Status',
    //   key: 'Status',
    //   width: 70,
    //   render: (text, record) => {
    //     return   <Checkbox checked={text==1?true:false} ></Checkbox>

    //   }
    // },
    {
      title: '仪表设定值',
      align: 'center',
      dataIndex: 'SetValue',
      key: 'SetValue',
      width: 100,
      render: (text, record, index) => {
      return record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'? '—' : <Row justify='center' align='middle'> {(record.SetStatus==1 || text )&&<Checkbox checked={record.SetStatus == 1 ? true : false} style={{paddingRight:4}}></Checkbox>}{text}</Row>;       
      }
    },
    {
      title: '仪表设定值照片',
      align: 'center',
      dataIndex: 'SetFileList',
      key: 'SetFileList',
      width: 120,
      render: (text, record, index) => {
        // if(record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'){
        //   return '—' 
        // }
        const attachmentDataSource = getAttachmentDataSource(text);
        return <div>
         {text&&text[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />} 
        </div>;
      }
    },
    {
      title: 'DAS设定值',
      align: 'center',
      dataIndex: 'InstrumentSetValue',
      key: 'InstrumentSetValue',
      render: (text, record, index) => {
      return record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'? '—' : <Row justify='center' align='middle'> {(record.InstrumentStatus==1 || text )&&<Checkbox checked={record.InstrumentStatus == 1 ? true : false} style={{paddingRight:4}}></Checkbox>}{text}</Row>;       
     }
    },
    {
      title: 'DAS设定值照片',
      align: 'center',
      dataIndex: 'InstrumentFileList',
      key: 'InstrumentFileList',
      width: 125,
      render: (text, record, index) => {
        // if(record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'){
        //   return '—' 
        // }
        const attachmentDataSource = getAttachmentDataSource(text);
        return <div>
         {text&&text[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />} 
        </div>;
      }
    },
    {
      title: '数采仪设定值',
      align: 'center',
      dataIndex: 'DataValue',
      key: 'DataValue',
      width: 100,
      render: (text, record, index) => {
      return record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'? '—'  :  <Row justify='center' align='middle'> {(record.DataStatus==1 || text )&&<Checkbox checked={record.DataStatus == 1 ? true : false} style={{paddingRight:4}}></Checkbox>}{text}</Row>; 
     }
    },
    {
      title: '数采仪设定值照片',
      align: 'center',
      dataIndex: 'DataFileList',
      key: 'DataFileList',
      width: 140,
      render: (text, record, index) => {
        // if(record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'){
        //   return '—' 
        // }
        const attachmentDataSource = getAttachmentDataSource(text);
        return <div>
         {text&&text[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />} 
        </div>;
      }
    },
    {
      title: '溯源值',
      align: 'center',
      dataIndex: 'TraceabilityValue',
      key: 'TraceabilityValue',
      width: 70,
      render: (text, record, index) => {
        return record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'? '—' : text;       
     }
    },
    {
      title: '溯源值照片',
      align: 'center',
      dataIndex: 'TraceabilityFileList',
      key: 'TraceabilityFileList',
      width: 120,
      render: (text, record, index) => {
        // if(record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'){
        //   return '—' 
        // }
        const attachmentDataSource = getAttachmentDataSource(text);
        return <div>
         {text&&text[0]&&<AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />} 
        </div>;
      }
    },
    {
      title: '一致性(自动判断)',
      align: 'center',
      dataIndex: 'AutoUniformity',
      key: 'AutoUniformity',
      width: 120,
      render: (text, record) => {
        if(record.ItemName==='停炉信号接入有备案材料' ||  record.ItemName==='停炉信号激活时工况真实性'){
           return '—'
        }else{
          return text==1? '是' : text==2 ? '否' : null
        }
    }
    },
    {
      title: '手工修正结果',
      align: 'center',
      dataIndex: 'Uniformity',
      key: 'Uniformity', 
      width: 100,
      render: (text, record) => {
         return text==1? '是' : text ==2 ? '否' : text ==3 ?  '不适用':  text ==4 ? '不规范' : null

      }
    },
    {
      title: '运维人员核查备注',
      align: 'center',
      dataIndex: 'OperationReramk',
      key: 'OperationReramk',
      width: 180,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'Remark',
      key: 'Remark',
      width: 150,
    },
    {
      title: '判断依据',
      align: 'center',
      dataIndex: 'Content',
      key: 'Content',
      width: 100,
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    }
  ]





  return (
    <div className={styles.remoteSupervisionDetailSty} >
    <BreadcrumbWrapper hideBreadcrumb={true}>
    <Card  style={{paddingBottom:10}}
    //  title={
    //    type!='mobile'&&<Row justify='space-between'>
    //     <span>详情</span>
    //     <Button onClick={() => {props.history.go(-1);   }} ><RollbackOutlined />返回</Button>
    //  </Row>
    // }
    >
  <Spin spinning={tableLoading}>
    <Form
      name="detail"
    >
      <Row style={{paddingTop: isMobile? 16 : 12}}>
      <Col span={8} style={{paddingRight:5}}>
        <Form.Item label="企业名称">
        {consistencyCheckDetail.entName }
      </Form.Item>
      </Col>
        <Col span={8} style={{paddingRight:5}}>
        <Form.Item label="监测点名称" >
        {consistencyCheckDetail.pointName }
      </Form.Item>
      </Col>
      <Col span={8} style={{paddingRight:5}}>
        <Form.Item label="核查结果" >
        {consistencyCheckDetail.resultCheck === '不合格' ? <span style={{ color: '#f5222d' }}>{consistencyCheckDetail.resultCheck}</span> : <span>{consistencyCheckDetail.resultCheck}</span>}
      </Form.Item>
      </Col>
        <Col span={8} style={{paddingRight:5}}>
        <Form.Item label="核查人">
        {consistencyCheckDetail.checkUserName }
      </Form.Item>
      </Col>
      <Col span={8} style={{paddingRight:5}}>
        <Form.Item label="核查日期" >
        {consistencyCheckDetail.dateTime&&moment(consistencyCheckDetail.dateTime).format("YYYY-MM-DD")}
      </Form.Item>
      </Col>
      <Col span={8} style={{paddingRight:5}}>
      <Form.Item label="任务执行人"  >
        {consistencyCheckDetail.operationUserName  }
      </Form.Item>
      </Col> 
      </Row>
    </Form>
    <Tabs>
    <TabPane tab="数据一致性核查表" key="1" >
              <SdlTable
                columns={columns1}
                dataSource={tableData1}
                pagination={false}
                scroll={{ y: 'auto'}}
                size='small'
              />
               <SdlTable
                columns={columns2}
                dataSource={tableData2}
                pagination={false}
                scroll={{ y: '100vh' }}
                size='small'
              />
            </TabPane>
            <TabPane tab="参数一致性核查表" key="2">
              <SdlTable
                columns={columns3}
                dataSource={consistencyCheckDetail.consistentParametersCheckList}
                pagination={false}
                scroll={{ y: clientHeight - 380}}
              />
            </TabPane>
          </Tabs>
        </Spin>
   </Card>
   </BreadcrumbWrapper>
        </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);