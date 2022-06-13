/**
 * 功  能：远程督查
 * 创建人：贾安波
 * 创建时间：2021.3.16
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Checkbox, Upload, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, UploadOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined, IssuesCloseOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import styles from "./style.less"
import Cookie from 'js-cookie';
import AttachmentView from '@/components/AttachmentView'
import { getAttachmentDataSource } from '@/pages/AutoFormManager/utils'
import NumTips from '@/components/NumTips'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import cuid from 'cuid';
import { IfSpecial } from '@/services/login';

const namespace = 'remoteSupervision'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


const dvaPropsData = ({ loading, remoteSupervision, global, common,autoForm }) => ({
  tableDatas: remoteSupervision.tableData,
  tableLoading: loading.effects[`${namespace}/getRemoteInspectorList`],
  tableTotal: remoteSupervision.tableTotal,
  parLoading: loading.effects[`${namespace}/getPointConsistencyParam`],
  editLoading: loading.effects[`${namespace}/getConsistencyCheckInfo`],
  pointListByEntCode: common.pointListByEntCode,
  clientHeight: global.clientHeight,
  entList: remoteSupervision.entList,
  addDataConsistencyData: remoteSupervision.addDataConsistencyData,
  addRealTimeData: remoteSupervision.addRealTimeData,
  addParconsistencyData: remoteSupervision.addParconsistencyData,
  consistencyCheckDetail: remoteSupervision.consistencyCheckDetail,
  tableInfo:autoForm.tableInfo,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },

    getPointByEntCode: (payload, callback) => { // 根据企业获取监测点
      dispatch({
        type: `${namespace}/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },
    deleteAttach: (file) => { //删除照片
      dispatch({
        type: "autoForm/deleteAttach",
        payload: {
          FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
          Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
        }
      })
    },
    getRemoteInspectorList: (payload) => { // 列表
      dispatch({
        type: `${namespace}/getRemoteInspectorList`,
        payload: payload,
      })
    },
    getPointConsistencyParam: (payload, callback) => {  //获取数据一致性核查列表 添加参数列表
      dispatch({
        type: `${namespace}/getPointConsistencyParam`,
        payload: payload,
        callback: callback
      })
    },
    getNoxValue: (payload, callback) => { // 获取NOx数采仪实时数据
      dispatch({
        type: `${namespace}/getNoxValue`,
        payload: payload,
        callback: callback
      })
    },
    judgeConsistencyRangeCheck: (payload, callback) => { //量程一致性检查 自动判断
      dispatch({
        type: `${namespace}/judgeConsistencyRangeCheck`,
        payload: payload,
        callback: callback,
      })
    },
    judgeConsistencyCouCheck: (payload, callback) => { //数据一致性检查 自动判断
      dispatch({
        type: `${namespace}/judgeConsistencyCouCheck`,
        payload: payload,
        callback: callback,
      })
    },
    judgeParamCheck: (payload, callback) => { //参数一致性检查 自动判断
      dispatch({
        type: `${namespace}/judgeParamCheck`,
        payload: payload,
        callback: callback,
      })
    },
    addOrUpdConsistencyCheck: (payload, callback) => {  //添加或修改数据一致性核查
      dispatch({
        type: `${namespace}/addOrUpdConsistencyCheck`,
        payload: payload,
        callback: callback,
      })
    },
    addOrUpdParamCheck: (payload, callback) => {  //添加或修改参数一致性核查表
      dispatch({
        type: `${namespace}/addOrUpdParamCheck`,
        payload: payload,
        callback: callback,
      })
    },
    deleteRemoteInspector: (payload, callback) => {  //删除
      dispatch({
        type: `${namespace}/deleteRemoteInspector`,
        payload: payload,
        callback: callback,
      })
    },
    getConsistencyCheckInfo:(payload,callback)=>{  //编辑获取详情
      dispatch({
        type: `${namespace}/getConsistencyCheckInfo`,
        payload:payload,
        callback:callback,
      })
    },
    issueRemoteInspector:(payload,callback)=>{  //下发 
      dispatch({
        type: `${namespace}/issueRemoteInspector`,
        payload:payload,
        callback:callback,
      })
    }, 
    getUserList:(payload,callback)=>{  //运维人员 列表
      dispatch({
        type: `autoForm/getAutoFormData`,
        payload:{
           configId:'View_UserOperation',
           otherParams: {
            pageIndex: 1,
            pageSize: 9999999
           }
          },
      })
    }, 
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [form2] = Form.useForm(); //添加编辑表单  数据一致性核查表
  const [form3] = Form.useForm(); //添加编辑表单   参数一致性核查表
  const [commonForm] = Form.useForm();

  const [showType, setShowType] = useState('1')
  const [dates, setDates] = useState([]);
  const { tableDatas, tableLoading, clientHeight, tableTotal, addDataConsistencyData, addRealTimeData, consistencyCheckDetail, parLoading,editLoading,tableInfo } = props;

 

  


  const isRecord =  props.match.path ==='/operations/remoteSupervisionRecord'? true : false;
  
  const [filePar, setFilePar] = useState() //参数一致性核查表 上传附件 点击字段
  const [filesCuidList, setFilesCuidList] = useState({}) //参数一致性核查表 上传附件
  const [filesList3, setFilesList3] = useState({}) //参数一致性核查表 参数附件列表

  useEffect(() => {

    onFinish(pageIndex, pageSize)
    props.getUserList()


  }, []);



  const [rangReq, setRangReq] = useState({})
  const [remark, setRemark] = useState({})
  const [indicaValReq, setIndicaValReq] = useState({}) //示值
  const [remark2, setRemark2] = useState({})

  const [traceValReq, setTraceValReq] = useState({})
  const [remark3, setRemark3] = useState({})


 
  // useEffect(()=>{
  //   reqinit()
  // },[addDataConsistencyData,addParconsistencyData])

 const reqinit = () =>{ //初始化是否校验
  if (addDataConsistencyData && addDataConsistencyData[0]) { //动态生成判断量程 是否 是否必填的
    let analysisParRangObj = {}, parRemarkObj = {};
    let indicaValReqObj = {}, parRemark2Obj = {};

    addDataConsistencyData.map((item, index) => {
      analysisParRangObj[`${item.par}RangFlag`] = true; //量程 量程一致性
      parRemarkObj[`${item.par}RemarkFlag`] = false;

    })
    setRangReq(analysisParRangObj)
    // setRemark(parRemarkObj)

    addRealTimeData.map((item, index) => {
      indicaValReqObj[`${item.par}IndicaValFlag`] = true;//示值 实时数据一致性
      parRemark2Obj[`${item.par}Remark2Flag`] = false;
    })
    setIndicaValReq(indicaValReqObj)
    // setRemark2(parRemark2Obj)
  }



  if (addParconsistencyData && addParconsistencyData[0]) { //动态生成判断设定值 溯源值是否必填的 参数一致性核查表参数一致性核查表
    let setValObj = {}, traceValObj = {}, parRemark3Obj = {};

    addParconsistencyData.map((item, index) => {
      traceValObj[`${item.par}TraceValFlag`] = false;
      parRemark3Obj[`${item.par}Remark3Flag`] = false;
    })
    setTraceValReq(traceValObj)
    // setRemark3(parRemark3Obj)
  }
 }


  const exports = async () => {
    const values = await form.validateFields();
    props.exportTaskWorkOrderList({
      ...queryPar,
      pageIndex: undefined,
      pageSize: undefined,
    })

  };
  const [ID, setID] = useState()


  const issueTipContent = <div>
    <p style={{ marginBottom: 5 }}>1、待下发：督查结果未发送通知给点运维负责人。</p>
    <p style={{ marginBottom: 0 }}>2、已下发：督查结果已下发通知给点运维负责人。</p>
  </div>

  const columns = [
    {
      title: '省/市',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
    },
    {
      title: '核查结果',
      dataIndex: 'resultCheck',
      key: 'resultCheck',
      align: 'center',
      render: (text, record) => {
        return text === '不合格' ? <span style={{ color: '#f5222d' }}>{text}</span> : <span>{text}</span>
      }
    },
    {
      title: '量程是否一致',
      dataIndex: 'rangeStatus',
      key: 'rangeStatus',
      align: 'center',
    },
    {
      title: '数据是否一致',
      dataIndex: 'couStatus',
      key: 'couStatus',
      align: 'center',
    },
    {
      title: '参数是否一致',
      dataIndex: 'paramStatus',
      key: 'paramStatus',
      align: 'center',
    },
    {
      title: '量程一致性问题数量',
      dataIndex: 'rangeErrCount',
      key: 'rangeErrCount',
      align: 'center',
      width:180,
    },
    {
      title: '数据一致性问题数量',
      dataIndex: 'couErrCount',
      key: 'couErrCount',
      align: 'center',
      width:180,
    },
    {
      title: '参数一致性问题数量',
      dataIndex: 'paramErrCount',
      key: 'paramErrCount',
      align: 'center',
      width:180,
    },
    {
      title: '核查人',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '核查日期',
      dataIndex: 'dateTime',
      key: 'dateTime',
      align: 'center',
    },
    {
      title: '点位运维负责人',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
    },
    {
      title: <span style={{ position: 'relative' }}>下发状态 <NumTips content={issueTipContent} style={{ top: 2, }} /></span>,
      dataIndex: 'issue',
      key: 'issue',
      align: 'center',
      render: (text, record) => {
        return text === '待下发' ? <span style={{ color: '#f5222d' }}>{text}</span> : <span>{text}</span>
      }
    },
    {
      title: '下发时间',
      dataIndex: 'issueTime',
      key: 'issueTime',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      width:150,
      render: (text, record) => {
         const updateflag = record.updateflag;
         const flag = record.flag;
         const issue = record.issue;
         
      let detail =  <Tooltip title="详情">
      <a onClick={() => {
        router.push({ pathname: `/operations/remoteSupervision/detail/${record.id}` })
      }}>
        <ProfileOutlined style={{ fontSize: 16 }} />
      </a>
    </Tooltip>
       if(isRecord){ //远程督查记录页面
        return detail 
       }
        return (
          <>
            <Tooltip  title={updateflag && flag? "编辑" : null  }>
              <a onClick={() => {
               if(updateflag && flag){
                edit(record)
               } 
               return;
              }}  >
                <EditOutlined  style={{cursor: updateflag && flag? 'pointer':'not-allowed', color:updateflag && flag?  '#1890ff' : '#00000040',  fontSize: 16 }} />
              </a>
            </Tooltip>
              <Divider type="vertical" />
            {detail}
             <Divider type="vertical" />
              <Tooltip title={ updateflag && flag? "删除": null  } >
                <Popconfirm   disabled={!(updateflag && flag)} title="确定要删除此条信息吗？" placement="left" onConfirm={() => del(record)} okText="是" cancelText="否">
                  <a href="#"  style={{cursor: updateflag && flag? 'pointer':'not-allowed', color:updateflag && flag ? '#1890ff' : '#00000040', }}><DelIcon style={{ fontSize: 16 }}/></a>
                </Popconfirm>
              </Tooltip>
            <Divider type="vertical" />
            <Tooltip   title={!issue||issue==='已下发'?  null : "下发"} >
              <Popconfirm disabled={!issue||issue==='已下发'? true : false} title="确定要下发督查结果给点位的运维负责人吗？" placement="left" onConfirm={() => issues(record)} okText="是" cancelText="否">
                <a href="#" style={{cursor:!issue||issue==='已下发'? 'not-allowed' : 'pointer', color:!issue||issue==='已下发'?'#00000040' : '#1890ff', }}><IssuesCloseOutlined  style={{ fontSize: 16 }} /></a>
              </Popconfirm>
            </Tooltip>
          </>
        )
      }

    }
  ]
  const [title,setTitle] = useState('添加')
  const [editId,setEditId] = useState()
  

 
 
  const echoForamt = (code,val) =>{ //格式化 编辑回显
    form2.setFieldsValue({
      [`${code}AnalyzerRang1`]:val.AnalyzerMin,
      [`${code}AnalyzerRang2`]:val.AnalyzerMax,
      [`${code}AnalyzerUnit`]:val.AnalyzerUnit,
      [`${code}DsRang1`]:val.DASMin,
      [`${code}DsRang2`]:val.DASMax,
      [`${code}DsUnit`]:val.DASUnit,
      [`${code}ScyRang1`]:val.DataMin,
      [`${code}ScyRang2`]:val.DataMax,
      [`${code}ScyUnit`]:val.DataUnit,
      [`${code}RangUniformity`]:val.RangeAutoStatus,
      [`${code}RangCheck`]:val.RangeStatus ? [val.RangeStatus] : [],
      [`${code}Remark`]:val.RangeRemark,
      [`${code}IndicaVal`]:val.AnalyzerCou,//实时数据一致性核查表
      [`${code}IndicaUnit`]:val.AnalyzerCouUnit,
      [`${code}DsData`]:val.DASCou,
      [`${code}DsDataUnit`]:val.DASCouUnit,
      [`${code}ScyData`]:val.DataCou,
      [`${code}ScyDataUnit`]:val.DataCouUnit,
      [`${code}DataUniformity`]:val.CouAutoStatus,
      [`${code}RangCheck2`]:val.CouStatus ? [val.CouStatus] : [],
      [`${code}Remark2`]:val.CouRemrak,

    })
  }

  const [echoLoading, setEchoLoading ] = useState(false)
  const edit = (record) => { //编辑
    setTitle('编辑')
    setVisible(true)
    setEditId(record.id)
    setEchoLoading(true)
    resetData();
    props.getConsistencyCheckInfo({ ID: record.id }, (data) => {
      console.log(data.dateTime)
      //共同的字段
     commonForm.setFieldsValue({
       OperationUserID:data.operationUserID,
       EntCode: data.entCode,
       month:  moment(moment(data.dateTime).format("YYYY-MM-DD")) 
     })
     setPointLoading2(true)
     props.getPointByEntCode({ EntCode:  data.entCode }, (res) => {
       setPointList2(res)
       setPointLoading2(false)
       commonForm.setFieldsValue({
        DGIMN: data.DGIMN,   
      })
      
      getPointConsistencyParam(data.DGIMN,()=>{
        let echoData = []
        data.consistencyCheckList.map(item=>{ //数据一致性核查表
         let val = item.DataList;
         let code = item.DataList.PollutantCode

         if(item.PollutantName=='颗粒物'){
           if(val.Special){ 
             if(val.Special==1){ //有显示屏
               echoForamt(code,val)
               setIsDisPlayCheck1(true)
               isDisplayChange({target:{checked:true}},'isDisplay1')
               onManualChange(val.RangeStatus&&[val.RangeStatus], item, `${code}`, 1)
             }
             if(val.Special==2){ //无显示屏
              echoForamt(`${code}a`,val)
              isDisplayChange({target:{checked:true}},'isDisplay2')
              onManualChange(val.RangeStatus&&[val.RangeStatus], {...val, par:`${code}a`}, `${code}RangCheck`, 1)

             }
           }
            if(val.CouType){ 
            
               if(val.CouType==1){ //原始浓度
                echoForamt(`${code}c`,val)
                onManualChange(val.CouStatus&&[val.CouStatus], {...val, par:`${code}c`}, `${code}RangCheck2`, 2)
               }
               if(val.CouType==2){ //标杆浓度
                echoForamt(`${code}d`,val)
                onManualChange(val.CouStatus&&[val.CouStatus], {...val, par:`${code}d`}, `${code}RangCheck2`, 2)
               }

            }
         }else if(item.PollutantName==='流速'){
          form2.setFieldsValue({  //实时数据
            [`${code}DsData`]:val.DASCou,
            [`${code}DsDataUnit`]:val.DASCouUnit,
            [`${code}ScyData`]:val.DataCou,
            [`${code}ScyDataUnit`]:val.DataCouUnit,
            [`${code}DataUniformity`]:val.CouAutoStatus,
            [`${code}RangCheck2`]:val.CouStatus ? [val.CouStatus] : [],
            [`${code}Remark2`]:val.CouRemrak,
      
          })
             onManualChange(val.RangeStatus&&[val.RangeStatus], {...val, par:`${code}`}, `${code}RangCheck2`, 2)

            if(val.Special==1){ //差压法
              echoForamt(code,val)
              isDisplayChange2({target:{checked:true}},'isDisplay3')
              onManualChange(val.RangeStatus&&[val.RangeStatus], {...val, par:`${code}`}, `${code}RangCheck`, 1)
            }else if(val.Special==2){ //直测流速法
              echoForamt(`${code}b`,val)
              isDisplayChange2({target:{checked:true}},'isDisplay4')
              onManualChange(val.RangeStatus&&[val.RangeStatus], {...val, par:`${code}b`}, `${code}RangCheck`, 1)

            }

         }else{
           echoForamt(code,val)
           onManualChange(val.RangeStatus&&[val.RangeStatus], {...val, par:`${code}`}, `${code}RangCheck`, 1) //编辑 手工修正结果 量程一致性
           onManualChange(val.CouStatus&&[val.CouStatus], {...val, par:`${code}`}, `${code}RangCheck2`, 2)//编辑 手工修正结果 实时数据
         }
        setNumChecked(val.DataStatus==1?true : false )
        setDasChecked(val.DASStatus==1?true : false)
     

        })

        if(data.rangeUpload&&data.rangeUpload[0]){  //量程一致性核查表 附件
          form2.setFieldsValue({files1:data.rangeUpload[0].FileUuid})
          setFilesCuid1(data.rangeUpload[0].FileUuid)
           const fileList = data.rangeUpload.map(item=>{
            if(!item.IsDelete){
              return  {
                uid: item.GUID,
                name: item.FileName,
                status: 'done',
                url: `\\upload\\${item.FileName}`,
              }
              
            }
          })
          setFileList1(fileList)
        }
    
        if(data.couUpload&&data.couUpload[0]){ //实时数据一致性核查表 附件
          form2.setFieldsValue({files2:data.couUpload[0].FileUuid})
          setFilesCuid2(data.couUpload[0].FileUuid)
          let fileList = data.couUpload.map(item=>{
            if(!item.IsDelete){
              return  {
                uid: item.GUID,
                name: item.FileName,
                status: 'done',
                url: `\\upload\\${item.FileName}`,
              }
              
            }
          })
          fileList = fileList.filter(item=>item!=undefined)
          setFileList2(fileList)
        }
      
        setEchoLoading(false)

        // let uploadList = {}
        // data.consistentParametersCheckList.map(item=>{ //参数一致性核查表
        //   let code = item.CheckItem 
        //   form3.setFieldsValue({
        //     [`${code}IsEnable`]: item.Status? [item.Status] : [],
        //     [`${code}SetVal`]:item.SetValue,
        //     [`${code}TraceVal`]:item.TraceabilityValue,
        //     [`${code}Uniform`]:item.AutoUniformity,
        //     [`${code}RangCheck3`]:item.Uniformity? [item.Uniformity] : [],//手工修正结果
        //     [`${code}Remark3`]:item.Remark,
        //     [`${code}ParFiles`]:item.Upload,
        //   })
        //   uploadList[`${code}ParFiles`] = item.UploadList&&item.UploadList[0]&&item.UploadList.map(item=>{
        //     if(!item.IsDelete){
        //     return {
        //       uid: item.GUID,
        //       name: item.FileName,
        //       status: 'done',
        //       url: `\\upload\\${item.FileName}`,
        //     }
        //   }
        //    })

        //  })
        //  setFilesList3({ ...uploadList })


         })

  
        

     })


    })
  }
  const del = (record) => { //删除
    props.deleteRemoteInspector({ ID: record.id }, () => {
      onFinish(1, 20)
    })
  }
  const issues = (record) => { //下发
    props.issueRemoteInspector({ ID: record.id }, () => {
      onFinish(pageIndex, pageSize)
    })
  }
  const [outOrInside, setOutOrInside] = useState(1)
  const onFinish = async (pageIndex, pageSize) => {  //查询
    try {
      const values = await form.validateFields();
      props.getRemoteInspectorList({
        ...values,
        month: undefined,
        BeginTime: values.month ? moment(values.month[0]).format("YYYY-MM-DD 00:00:00") : undefined,
        EndTime: values.month ? moment(values.month[1]).format("YYYY-MM-DD 23:59:59") : undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const resetData = (flag) => {
    form2.resetFields();
    form3.resetFields();
    setDasChecked(false)
    setNumChecked(false)
    setIsDisPlayCheck1(false)
    setIsDisPlayCheck2(false)
    setIsDisPlayCheck3(false)
    setIsDisPlayCheck4(false)
    setFileList1([]); setFileList2([]); //清除附件
    commonForm.resetFields();
    setAddId();
    props.updateState({ addDataConsistencyData: [], addRealTimeData: [], addParconsistencyData: [] })
    // !flag&&commonForm.resetFields();
    // !flag&&setAddId();
    // !flag&&props.updateState({ addDataConsistencyData: [], addRealTimeData: [], addParconsistencyData: [] })
  }
  const add =  () => {

    setTitle('添加')
    setVisible(true)
    setFilesCuid1(cuid())
    setFilesCuid2(cuid())
    resetData()
  }
  const [saveLoading1,setSaveLoading1] = useState(false)
  const [saveLoading2,setSaveLoading2] = useState(false)

  const [saveLoading11,setSaveLoading11] = useState(false)
  const [saveLoading22,setSaveLoading22] = useState(false)

  const [addId,setAddId] = useState();
  const save = (type) => {

    commonForm.validateFields().then(commonValues => {
      const commonData = {
        ...commonValues,
        ID:title==='添加'?  addId : editId,
        month: undefined,
        DateTime: commonValues.month ? moment(commonValues.month).format("YYYY-MM-DD 00:00:00") : undefined,
      }
      if (tabType == 1) {
        
         type==1? setSaveLoading1(true) : setSaveLoading2(true);
        
        form2.validateFields().then((values) => {
          const dataList1 = addDataConsistencyData.map(item => {
            return {
              PollutantCode: item.ChildID,
              AnalyzerMin: values[`${item.par}AnalyzerRang1`],
              AnalyzerMax: values[`${item.par}AnalyzerRang2`],
              AnalyzerUnit: values[`${item.par}AnalyzerUnit`],
              DASMin: dasChecked ? values[`${item.par}DsRang1`] : undefined,
              DASMax: dasChecked ? values[`${item.par}DsRang2`] : undefined,
              DASUnit: dasChecked ? values[`${item.par}DsUnit`] : undefined,
              DataMin: numChecked ? values[`${item.par}ScyRang1`] : undefined,
              DataMax: numChecked ? values[`${item.par}ScyRang2`] : undefined,
              DataUnit: numChecked ? values[`${item.par}ScyUnit`] : undefined,
              RangeAutoStatus: values[`${item.par}RangUniformity`], //量程一致性(自动判断)
              RangeStatus: values[`${item.par}RangCheck`]&&values[`${item.par}RangCheck`][0]?  values[`${item.par}RangCheck`][0] : undefined,
              RangeRemark: values[`${item.par}Remark`],
              Special: item.isDisplay == 1&&isDisPlayCheck1 || item.isDisplay == 3 &&isDisPlayCheck3 ? 1 : item.isDisplay == 2&&isDisPlayCheck2 || item.isDisplay == 4 &&isDisPlayCheck4 ? 2 : undefined,//颗粒物有无显示屏 流速差压法和直测流速法
              DASStatus: dasChecked ? 1 : 2,
              DataStatus: numChecked ? 1 : 2,
            }
          })
          const dataList2 = addRealTimeData.map(item => {
            return {
              PollutantCode: item.ChildID,
              AnalyzerCou: values[`${item.par}IndicaVal`],
              AnalyzerCouUnit: values[`${item.par}IndicaUnit`],
              DASCou: dasChecked ? values[`${item.par}DsData`] : undefined,
              DASCouUnit: dasChecked ? values[`${item.par}DsDataUnit`] : undefined,
              DataCou: numChecked ? values[`${item.par}ScyData`] : undefined,
              DataCouUnit: numChecked ? values[`${item.par}ScyDataUnit`] : undefined,
              CouAutoStatus: values[`${item.par}DataUniformity`],
              CouStatus: values[`${item.par}RangCheck2`]&&values[`${item.par}RangCheck2`][0]? values[`${item.par}RangCheck2`][0] : undefined,
              CouRemrak: values[`${item.par}Remark2`],
              CouType: item.concentrationType == '原始浓度' ? 1 : item.concentrationType == '标杆浓度' ? 2 : undefined,
            }
          })
            dataList1.map((item,index)=>{ // 合并颗粒物和流速的数据  量程一致性核查表 删除没勾选的 颗粒物和流速
              if(item.PollutantCode=='411'&&!item.Special || item.PollutantCode=='415'&&!item.Special ){
                dataList1.splice(index,1)
              }
            })
          
          let dataList = [],obj1=null,obj2=null,obj3=null;
          dataList1.map((item1, index1) => { //合并两个表格的数据     
            dataList2.map((item2, index2) => {
               if(item1.PollutantCode=='411' || item2.PollutantCode=='411'){ //颗粒物特殊处理
                     if(item1.PollutantCode=='411'&&item1.Special){
                      obj1 = item1 //颗粒物 有无显示屏
                     }
                     if(item2.PollutantCode=='411'&&item2.CouType==1){
                       obj2 = item2  //颗粒物 原始浓度
                     }
                     if(item2.PollutantCode=='411'&&item2.CouType==2){
                      obj3= item2  //颗粒物 标杆浓度
                    }
               }else{
                 if(item1.PollutantCode== item2.PollutantCode){
                    dataList.push({ ...item1, ...item2 })
                 }
               }
            })
          })

          dataList.push(obj1,obj2,obj3)
          dataList =  dataList.filter(item=>item) //去除值为空的情况

          props.addOrUpdConsistencyCheck({
            AddType:type,
            Data: { ...commonData, RangeUpload: values.files1, CouUpload: values.files2, },
            DataList: dataList,
          }, (id) => {
            title==='添加'&&setAddId(id)
            type==1? setSaveLoading1(false) : setSaveLoading2(false)
            onFinish(pageIndex, pageSize)
          })




        }).catch((info) => {
          console.log('Validate Failed2:', info);
        });




      } else {  //参数一致性核查表

        type==1? setSaveLoading11(true) : setSaveLoading22(true)
        form3.validateFields().then(values => {
          const paramDataList = addParconsistencyData.map(item => {
            return {
              CheckItem: item.ChildID,
              Status: values[`${item.par}IsEnable`] && values[`${item.par}IsEnable`][0] == 1 ? 1 : 2,
              SetValue: values[`${item.par}SetVal`],
              TraceabilityValue: values[`${item.par}TraceVal`],
              AutoUniformity: values[`${item.par}Uniform`],
              Uniformity:values[`${item.par}RangCheck3`]&&values[`${item.par}RangCheck3`][0] ? values[`${item.par}RangCheck3`][0] : undefined,//手工修正结果
              Remark: values[`${item.par}Remark3`],
              Upload: values[`${item.par}ParFiles`],
            }
          })
          props.addOrUpdParamCheck({
            AddType:type,
            Data: commonData,
            ParamDataList: paramDataList,
          }, (id) => {
            title==='添加'&&setAddId(id)
            onFinish(pageIndex, pageSize)
            type==1? setSaveLoading11(false) : setSaveLoading22(false)
          })
        }).catch((info) => {
          console.log('Validate Failed3:', info);
        });

      }
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });





  }
  const changeEnt = (val) => {
  }

  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)




  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
      })
      form.setFieldsValue({ DGIMN: undefined })
    }
  }

  const unitDefault = (code,value) =>{
    form2.setFieldsValue({
      [`${code}AnalyzerUnit`]:value,
      [`${code}DsUnit`]:value,
      [`${code}ScyUnit`]:value,
      [`${code}IndicaUnit`]:value,
      [`${code}DsDataUnit`]:value,
      [`${code}ScyDataUnit`]:value,
  })
  }
  const echoUnit = (data) =>{ //格式化
    data.map(item=>{

      const code = item.par
     if(item.Name == '流速' && item.isDisplay == 4 ){
       const value = item.Col1.split(',')[2];
       unitDefault(code,value)
    }

    if(item.Col1.search(",") == -1){ //单位只有一个的情况
      const value = item.Col1;
      unitDefault(code,value)
    }

    })

  }



  const getPointConsistencyParam = (mn,callback)=>{// 添加或编辑参数列表
    props.getPointConsistencyParam({ DGIMN: mn }, (pollutantList, addRealTimeList, paramList,operationName) => {
      // resetData(true)//防止提交完之后 切换tab栏 提交下一个 数据清空的情况
      commonForm.setFieldsValue({OperationUserID:operationName})
      echoUnit(pollutantList) //默认显示单位默认值
      echoUnit(addRealTimeList)
     if (paramList && paramList[0]&&title==='添加') { //附件 cuid
       let filesCuidObj = {}, filesListObj = {};
       paramList.map((item, index) => {
         filesCuidObj[`${item.par}ParFiles`] = cuid();
         filesListObj[`${item.par}ParFiles`] = [];
       })
       setFilesCuidList(filesCuidObj)
       setFilesList3(filesListObj)
     }
     callback&&callback()
   })
  }
 

  const [pointList2, setPointList2] = useState([])
  const [pointLoading2, setPointLoading2] = useState(false)
  const onValuesChange2 = async (hangedValues, allValues) => { //添加 编辑
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) {//清空时 
        setPointList2([])
        commonForm.setFieldsValue({ DGIMN: undefined })
        return;
      }
      setPointLoading2(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList2(res)
        setPointLoading2(false)
      })
      commonForm.setFieldsValue({ DGIMN: undefined })

    }
    if (Object.keys(hangedValues).join() == 'DGIMN' && hangedValues.DGIMN) { //监测点
      setTimeout(()=>{
        getPointConsistencyParam(hangedValues.DGIMN)
      },180)
    }
  }
  const [visible, setVisible] = useState(false)


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)

  const handleTableChange = (PageIndex, PageSize) => { //分页 打卡异常 响应超时 弹框
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }

  const [tabType, setTabType] = useState(1)
  const tabsChange = (key) => {
    setTabType(key)

    if(key==2){
      let uploadList = {}

      let filesCuidObj = {}, filesListObj = {};
      consistencyCheckDetail.consistentParametersCheckList&&consistencyCheckDetail.consistentParametersCheckList.map(item=>{ //参数一致性核查表
            let code = item.CheckItem;
            form3.setFieldsValue({
              [`${code}IsEnable`]: item.Status? [item.Status] : [],
              [`${code}SetVal`]:item.SetValue,
              [`${code}TraceVal`]:item.TraceabilityValue,
              [`${code}Uniform`]:item.AutoUniformity,
              [`${code}RangCheck3`]:item.Uniformity? [item.Uniformity] : [],//手工修正结果
              [`${code}Remark3`]:item.Remark,
              [`${code}ParFiles`]:item.Upload,
            })
            uploadList[`${code}ParFiles`] = item.UploadList&&item.UploadList[0]&&item.UploadList.map(items=>{
              if(!items.IsDelete){
              return {
                uid: items.GUID,
                name: items.FileName,
                status: 'done',
                url: `\\upload\\${items.FileName}`,
              }
            }
             })

           filesCuidObj[`${code}ParFiles`] = item.Upload;
            setTimeout(()=>{
            onManualChange(item.Uniformity&&[item.Uniformity], {...item, par:`${code}`}, `${code}RangCheck3`, 3)//编辑 手工修正结果 参数

           })
       })

       setFilesCuidList(filesCuidObj)
       setFilesList3({ ...uploadList })
    }
  }

  const { entList, entLoading } = props;
  const [dasChecked, setDasChecked] = useState(false)
  const onDasChange = (e) => { //DAS量程
    setDasChecked(e.target.checked)
  }

  const [numChecked, setNumChecked] = useState(false)
  const onNumChange = (e) => { //数采仪量程
    setNumChecked(e.target.checked)
  }




  const [filesCuid1, setFilesCuid1] = useState(cuid())
  const [filesCuid2, setFilesCuid2] = useState(cuid())

  const [fileList1, setFileList1] = useState([])
  const [fileList2, setFileList2] = useState([])


  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState()
  const [previewImage, setPreviewImage] = useState()

  const [fileType, setFileType] = useState(1)


  const filesCuid3 = () => {
    for (var key in filesCuidList) {
      if (key == filePar) {
        return filesCuidList[key]
      }
    }
  }
  const uploadProps = { //附件上传 
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    accept:'image/*',
    data: {
      FileUuid: fileType == 1 ? filesCuid1 : fileType == 2 ? filesCuid2 : filesCuid3(),
      FileActualType: '0',
    },
    listType: "picture-card",
    onChange(info) {
      if (fileType == 1) { setFileList1(info.fileList) } else if (fileType == 2) {
        setFileList2(info.fileList)
      } else {
        setFilesList3({
          ...filesList3,
          [filePar]: info.fileList
        })
      }
      if (info.file.status === 'done') {
        if (fileType == 1) {
          form2.setFieldsValue({ files1: filesCuid1 })
        } else if (fileType == 2) {
          form2.setFieldsValue({ files2: filesCuid2 })
        } else {
          form3.setFieldsValue({ [filePar]: filesCuid3() })
        }

      }
      if (info.file.status === 'error') {
        message.error('上传文件失败！')
      }
    },
    onRemove: (file) => {
      if (!file.error) {
        props.deleteAttach(file)
      }

    },
    onPreview: async file => { //预览
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    },
    fileList: fileType == 1 ? fileList1 : fileType == 2 ? fileList2 : fileType == 3? filesList3[filePar] : [],
  };
  const [manualOptions, setManualOptions] = useState([
    { label: '是', value: 1 },
    { label: '否', value: 2 },
    { label: '不适用', value: 3 },
  ])
  const onManualChange = (val, row, name, type) => { //手工修正结果
    if(!val){return}

    const ele = type == 1 ? document.getElementById(`advanced_search_${name}`) : type == 2 ? document.getElementById(`advanced_search_${name}`) : document.getElementById(`advanced_search_${name}`);
    if(!ele){return}
    for (var i = 0; i < ele.childNodes.length; i++) {
      if (val.toString() != i + 1) {
        ele.childNodes[i].getElementsByTagName('input')[0].setAttribute("disabled", true)
      }
      if (!val[0]) {
        ele.childNodes[i].getElementsByTagName('input')[0].removeAttribute("disabled")
      }
    }
   
    // switch (type) {
    //   case 1: // 量程一致性核查表
    //     if (val[0] == 3) { //不适用 量程 可不填
    //       setRangReq({ ...rangReq, [`${row.par}RangFlag`]: false })
    //       setRemark({ ...remark, [`${row.par}RemarkFlag`]: true })
    //     } else {
    //       setRangReq({ ...rangReq, [`${row.par}RangFlag`]: true })
    //       setRemark({ ...remark, [`${row.par}RemarkFlag`]: false })
    //     }
    //     break;
    //   case 2: // 实时数据一致性核查表
    //     if (val[0] == 3) { //不适用 示值 可不填
    //       setIndicaValReq({ ...indicaValReq, [`${row.par}IndicaValFlag`]: false })
    //       setRemark2({ ...remark2, [`${row.par}Remark2Flag`]: true })
    //     } else {
    //       setIndicaValReq({ ...indicaValReq, [`${row.par}IndicaValFlag`]: true })
    //       setRemark2({ ...remark2, [`${row.par}Remark2Flag`]: false })
    //     }


    //   case 3: // 参数一致性核查表
    //     if (val[0] == 3) {
    //       setTraceValReq({ ...traceValReq, [`${row.par}TraceValFlag`]: false })
    //       setRemark3({ ...remark3, [`${row.par}Remark3Flag`]: true })
    //     } else {
    //       setTraceValReq({ ...traceValReq, [`${row.par}TraceValFlag`]: true })
    //       setRemark3({ ...remark3, [`${row.par}Remark3Flag`]: false })
    //     }
    // }

  }

  let NO, NO2; //获取NOx的值

  const isJudge = (row, type) => {

    let analyzerRang1,analyzerRang2,analyzerUnit,analyzerFlag;

    switch (type) {
      case 1: // 量程一致性核查表 自动判断
         analyzerRang1 = form2.getFieldValue(`${row.par}AnalyzerRang1`)  , analyzerRang2 = form2.getFieldValue(`${row.par}AnalyzerRang2`), analyzerUnit = form2.getFieldValue(`${row.par}AnalyzerUnit`);
         analyzerFlag = (analyzerRang1||analyzerRang1==0) && (analyzerRang2 ||analyzerRang2==0)  && analyzerUnit || row.Name=='NOx' ||row.Name=='标干流量' ? true : false;
        const dsRang1 = form2.getFieldValue(`${row.par}DsRang1`), dsRang2 = form2.getFieldValue(`${row.par}DsRang2`), dsUnit = form2.getFieldValue(`${row.par}DsUnit`);
        const scyRang1 = form2.getFieldValue(`${row.par}ScyRang1`), scyRang2 = form2.getFieldValue(`${row.par}ScyRang2`), scyUnit = form2.getFieldValue(`${row.par}ScyUnit`);

        const dsRangFlag = (dsRang1||dsRang1==0) && (dsRang2||dsRang2==0) && dsUnit ? true : false;
        const scyRangFlag = (scyRang1||scyRang1==0) && (scyRang2||scyRang2==0) && scyUnit? true : false;
        if (analyzerFlag && dsRangFlag && !(scyRang1||scyRang1==0) && !(scyRang2||scyRang2==0)) { //只判断分析仪和DAS量程填完的状态
          props.judgeConsistencyRangeCheck({
            PollutantCode: row.ChildID,
            Special: row.isDisplay == 1 || row.isDisplay == 3 ? 1 : row.isDisplay == 2 || row.isDisplay == 4 ? 2 : undefined,
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit,
            DASStatus: dasChecked ? 1 : 2,
            DataStatus: numChecked ? 1 : 2,

          }, (data) => {
            form2.setFieldsValue({ [`${row.par}RangUniformity`]: data })
          })
        }
        if (analyzerFlag && scyRangFlag  && !(dsRang1||dsRang1==0) && !(dsRang2||dsRang2==0)) { //同上
          props.judgeConsistencyRangeCheck({
            PollutantCode: row.ChildID,
            Special: row.isDisplay == 1 || row.isDisplay == 3 ? 1 : row.isDisplay == 2 || row.isDisplay == 4 ? 2 : undefined,
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
            DASStatus: dasChecked ? 1 : 2,
            DataStatus: numChecked ? 1 : 2,
          }, (data) => {
            form2.setFieldsValue({ [`${row.par}RangUniformity`]: data })
          })
        }
        if (analyzerFlag && dsRangFlag && scyRangFlag) {
          props.judgeConsistencyRangeCheck({
            PollutantCode: row.ChildID,
            Special: row.isDisplay == 1 || row.isDisplay == 3 ? 1 : row.isDisplay == 2 || row.isDisplay == 4 ? 2 : undefined,
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit, DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
            DASStatus: dasChecked ? 1 : 2,
            DataStatus: numChecked ? 1 : 2,
          }, (data) => {
            form2.setFieldsValue({ [`${row.par}RangUniformity`]: data })
          })

        }

        break;
      case 2: // 实时数据一致性核查表 自动判断
                if(row.Name=='颗粒物'){ 
                 // isDisPlayCheck2 无显示屏  isDisPlayCheck4   直测流速法
                  analyzerRang1 =  isDisPlayCheck2?  form2.getFieldValue(`${row.ChildID}aAnalyzerRang1`) :  isDisPlayCheck1? form2.getFieldValue(`${row.ChildID}AnalyzerRang1`) : undefined;
                  analyzerRang2 =  isDisPlayCheck2?  form2.getFieldValue(`${row.ChildID}aAnalyzerRang2`) : isDisPlayCheck1? form2.getFieldValue(`${row.ChildID}AnalyzerRang2`) : undefined;
                  analyzerUnit =  isDisPlayCheck2? form2.getFieldValue(`${row.ChildID}aAnalyzerUnit`) :  isDisPlayCheck1? form2.getFieldValue(`${row.ChildID}AnalyzerUnit`) : undefined;

                }else if(row.Name=='流速'){
                  analyzerRang1 =  isDisPlayCheck4?  form2.getFieldValue(`${row.ChildID}bAnalyzerRang1`) :  isDisPlayCheck3? form2.getFieldValue(`${row.ChildID}AnalyzerRang1`): undefined;
                  analyzerRang2 =  isDisPlayCheck4?  form2.getFieldValue(`${row.ChildID}bAnalyzerRang2`) :  isDisPlayCheck3? form2.getFieldValue(`${row.ChildID}AnalyzerRang2`) : undefined;
                  analyzerUnit =  isDisPlayCheck4? form2.getFieldValue(`${row.ChildID}bAnalyzerUnit`) :  isDisPlayCheck3? form2.getFieldValue(`${row.ChildID}AnalyzerUnit`) : undefined;

               }else if(row.Name=='NOx'){
                analyzerRang1 =    form2.getFieldValue(`400AnalyzerRang1`);
                analyzerRang2 =   form2.getFieldValue(`400AnalyzerRang2`);
                analyzerUnit =  form2.getFieldValue(`400AnalyzerUnit`);
               }else{
                analyzerRang1 = form2.getFieldValue(`${row.ChildID}AnalyzerRang1`),
                analyzerRang2 =  form2.getFieldValue(`${row.ChildID}AnalyzerRang2`), 
                analyzerUnit =   form2.getFieldValue(`${row.ChildID}AnalyzerUnit`);
               }


         analyzerFlag = (analyzerRang1||analyzerRang1==0) && (analyzerRang2||analyzerRang2==0) && analyzerUnit  || row.Name =='流速' || row.Name=='标干流量'  || row.Name=='NO' || row.Name=='NO2' ? true : false;

        const indicaVal = (row.Name=='NO'&&!form2.getFieldValue(`${row.par}IndicaVal`)) || (row.Name=='NO2'&&!form2.getFieldValue(`${row.par}IndicaVal`)) ? '0'  : form2.getFieldValue(`${row.par}IndicaVal`), indicaUnit = form2.getFieldValue(`${row.par}IndicaUnit`);
        const dsData = form2.getFieldValue(`${row.par}DsData`), dsDataUnit = form2.getFieldValue(`${row.par}DsDataUnit`);
        const scyData = form2.getFieldValue(`${row.par}ScyData`), scyDataUnit = form2.getFieldValue(`${row.par}ScyDataUnit`);

        const indicaValFlag = (indicaVal||indicaVal==0) && indicaUnit || row.concentrationType=='标杆浓度' || row.Name =='流速' ||  row.Name=='NOx' || row.Name=='标干流量'? true : false;
        const dsDataFlag = (dsData||dsData==0) && dsDataUnit  ?  true : false; //只判断DAS示值填完的状态
        const scyDataFlag = (scyData||scyData==0) && scyDataUnit ? true : false;


        if (analyzerFlag && indicaValFlag && dsDataFlag && !(scyData||scyData==0)) {
          props.judgeConsistencyCouCheck({
            PollutantCode: row.ChildID,
            Special: isDisPlayCheck1 || isDisPlayCheck3 ? 1 : isDisPlayCheck2 || isDisPlayCheck4 ? 2 : undefined,//颗粒物有无显示屏 流速差压法和直测流速法
            CouType: row.concentrationType === '原始浓度' ? 1 : row.concentrationType === '标杆浓度' ? 2 : undefined,
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,//分析仪示值和单位
            DASCou: dsData, DASCouUnit: dsDataUnit, //DAS示值和单位
            DASStatus: dasChecked ? 1 : 2,
            DataStatus: numChecked ? 1 : 2,
          }, (data) => {
            form2.setFieldsValue({ [`${row.par}DataUniformity`]: data })
          })
        }
        if (analyzerFlag && indicaValFlag && scyDataFlag && !(dsData||dsData==0)) {
          props.judgeConsistencyCouCheck({
            PollutantCode: row.ChildID,
            Special: isDisPlayCheck1 || isDisPlayCheck3 ? 1 : isDisPlayCheck2 || isDisPlayCheck4 ? 2 : undefined,//颗粒物有无显示屏 流速差压法和直测流速法
            CouType: row.concentrationType === '原始浓度' ? 1 : row.concentrationType === '标杆浓度' ? 2 : undefined,
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,//分析仪示值和单位
            DataCou: scyData, DataCouUnit: scyDataUnit, //数采仪
            DASStatus: dasChecked ? 1 : 2,
            DataStatus: numChecked ? 1 : 2,
          }, (data) => {
            form2.setFieldsValue({ [`${row.par}DataUniformity`]: data })
          })
        }
        if (analyzerFlag && indicaValFlag && dsDataFlag && scyDataFlag) {
          props.judgeConsistencyCouCheck({
            PollutantCode: row.ChildID,
            Special: isDisPlayCheck1 || isDisPlayCheck3 ? 1 : isDisPlayCheck2 || isDisPlayCheck4 ? 2 : undefined,//颗粒物有无显示屏 流速差压法和直测流速法
            CouType: row.concentrationType === '原始浓度' ? 1 : row.concentrationType === '标杆浓度' ? 2 : undefined,
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,//分析仪示值和单位
            DASCou: dsData, DASCouUnit: dsDataUnit, //DAS示值和单位
            DataCou: scyData, DataCouUnit: scyDataUnit, //数采仪
            DASStatus: dasChecked ? 1 : 2,
            DataStatus: numChecked ? 1 : 2,
          }, (data) => {
            form2.setFieldsValue({ [`${row.par}DataUniformity`]: data })
          })
        }

        if (row.Name === 'NO') {
          NO = form2.getFieldValue(`${row.par}IndicaVal`);
        }
        if (row.Name === 'NO2') {
          NO2 = form2.getFieldValue(`${row.par}IndicaVal`);
        }
        if (NO && NO2) {  //获取NOx数采仪实时数据
          props.getNoxValue({ NO: NO, NO2: NO2 }, (data) => {
            form2.setFieldsValue({ [`402ScyData`]: data })
          })
        }
        break;
      case 3: // 参数一致性核查表 自动判断
        const setVal = form3.getFieldValue(`${row.par}SetVal`),
          traceVal = form3.getFieldValue(`${row.par}TraceVal`);
        if (setVal||setVal==0 && traceVal||traceVal==0) {
          if (setVal == traceVal) {
            form3.setFieldsValue({ [`${row.par}Uniform`]: 1 })
          } else {
            form3.setFieldsValue({ [`${row.par}Uniform`]: 2 })
          }
          //  props.judgeParamCheck({ PollutantCode:row.ChildID,   SetValue: setVal,   TraceabilityValue: traceVal, },(data)=>{
          //   form3.setFieldsValue({[`${row.par}Uniform`] :data })
          //  })
        }

        break;
    }
  }
  //颗粒物 有无显示屏
  const [isDisPlayCheck1, setIsDisPlayCheck1] = useState(false)
  const [isDisPlayCheck2, setIsDisPlayCheck2] = useState(false)
  const isDisplayChange = (e, name) => {
    const displayEle1 = document.getElementById(`advanced_search_isDisplay1`);
    const displayEle2 = document.getElementById(`advanced_search_isDisplay2`);
    if (name === 'isDisplay1') {
      setIsDisPlayCheck1(e.target.checked||true)
      displayEle2.setAttribute("disabled", true)
    }
    if (name === 'isDisplay2') {
      setIsDisPlayCheck2(e.target.checked)
      displayEle1.setAttribute("disabled", true)
    }
    if (!e.target.checked) { //取消选中状态
      setIsDisPlayCheck1(e.target.checked)
      setIsDisPlayCheck2(e.target.checked)
      displayEle1.removeAttribute("disabled")
      displayEle2.removeAttribute("disabled")
    }
  }

  //流速 
  const [isDisPlayCheck3, setIsDisPlayCheck3] = useState(false)
  const [isDisPlayCheck4, setIsDisPlayCheck4] = useState(false)
  const isDisplayChange2 = (e, name) => {
    const displayEle3 = document.getElementById(`advanced_search_isDisplay3`);
    const displayEle4 = document.getElementById(`advanced_search_isDisplay4`);
    if (name === 'isDisplay3') {
      setIsDisPlayCheck3(e.target.checked)
      displayEle4.setAttribute("disabled", true)
    }
    if (name === 'isDisplay4') {
      setIsDisPlayCheck4(e.target.checked)
      displayEle3.setAttribute("disabled", true)
    }
    if (!e.target.checked) { //取消选中状态
      setIsDisPlayCheck3(e.target.checked)
      setIsDisPlayCheck4(e.target.checked)
      displayEle3.removeAttribute("disabled")
      displayEle4.removeAttribute("disabled")
    }
  }

  const unitFormat = (record) => {
    return record.Col1 && record.Col1.split(',').map((item, index) => {
      if (record.Name == '流速' && record.isDisplay == 3) { //差压法
        if (index <= 1) { //只取前两个
          return <Option value={item}>{item}</Option>
        }
      } else if (record.Name == '流速' && (record.isDisplay == 4 || !record.isDisplay  ) ) { //直测流速法 或 实时数据一致性核查表 
        if (index > 1) { //只取最后一个
          return <Option value={item}>{item}</Option>
        }
      }else {
        return <Option value={item}>{item}</Option>
      }
    })
  }

  const columns2 = [
    {
      title: '序号',
      align: 'center',
      fixed:'left',
      width: 80,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      fixed:'left',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text == '颗粒物' && record.isDisplay == 1 || text == '流速' && record.isDisplay == 3) {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && record.isDisplay == 2 || text == '流速' && record.isDisplay == 4) {
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
          dataIndex: 'isDisplay',
          key: 'isDisplay',
          width: 145,
          render: (text, record) => {
            switch (text) {
              case 1:
                return <Row align='middle' justify='center'>
                  <Form.Item name='isDisplay1'>
                    <Checkbox  checked={isDisPlayCheck1} onChange={(e) => { isDisplayChange(e, 'isDisplay1') }}>有显示屏</Checkbox>
                  </Form.Item></Row>
                break;
              case 2:
                return <Row align='middle' justify='center'>
                  <Form.Item name='isDisplay2'>
                    <Checkbox checked={isDisPlayCheck2} onChange={(e) => { isDisplayChange(e, 'isDisplay2') }}>无显示屏</Checkbox>
                  </Form.Item> <NumTips style={{ top: 'auto', right: 12,zIndex:2 }} content={'1、颗粒物分析仪无显示屏时，分析仪量程填写铭牌量程'} /></Row>
                break;
              case 3:
                return <Row align='middle' style={{ paddingLeft: 10 }}>
                  <Form.Item name='isDisplay3' rules={[{ required: false, message: '请选择' }]}>
                    <Checkbox checked={isDisPlayCheck3} onChange={(e) => { isDisplayChange2(e, 'isDisplay3') }}>差压法</Checkbox>
                  </Form.Item></Row>
                break;
              case 4:
                return <Row align='middle' style={{ paddingLeft: 9 }}>
                  <Form.Item name='isDisplay4' rules={[{ required: false, message: '请选择' }]}>
                    <Checkbox checked={isDisPlayCheck4} onChange={(e) => { isDisplayChange2(e, 'isDisplay4') }}>直测流速法</Checkbox>
                  </Form.Item></Row>
                break;
              default:
                return '—'
                break;

            }

          }
        },
        {
          title: '分析仪量程',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = record.isDisplay == 1 && !isDisPlayCheck1 || record.isDisplay == 2 && !isDisPlayCheck2 ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || record.isDisplay == 4 && !isDisPlayCheck4 ? true : false
                  break;
              }
              return <Row justify='center' align='middle'>
                {/* <Form.Item name={`${record.par}AnalyzerRang1`} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={`${record.par}AnalyzerRang1`} >
              
                  <InputNumber placeholder='最小值' disabled={disabledFlag} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                <span style={{ padding: '0 2px' }}> - </span>
                {/* <Form.Item name={`${record.par}AnalyzerRang2`} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={`${record.par}AnalyzerRang2`} >
                 
                  <InputNumber placeholder='最大值' disabled={disabledFlag} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                {/* <Form.Item name={`${record.par}AnalyzerUnit`} style={{ marginLeft: 5 }} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请选择' }]}> */}
                <Form.Item name={`${record.par}AnalyzerUnit`} style={{ marginLeft: 5 }} >
                
                  <Select  allowClear placeholder='单位列表' disabled={disabledFlag} onChange={() => { isJudge(record, 1) }}>
                    {unitFormat(record)}
                  </Select>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: <Row align='middle' justify='center'> <Checkbox checked={dasChecked} onChange={onDasChange}>DAS量程</Checkbox></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {

                case 1: case 2:
                  disabledFlag = (record.isDisplay == 1 && !isDisPlayCheck1 || !dasChecked) || (record.isDisplay == 2 && !isDisPlayCheck2 || !dasChecked) ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = (record.isDisplay == 3 && !isDisPlayCheck3 || !dasChecked) || (record.isDisplay == 4 && !isDisPlayCheck4 || !dasChecked) ? true : false
                  break;
                default:
                  disabledFlag = !dasChecked
              }
              return <Row justify='center' align='middle'>
                {/* <Form.Item name={[`${record.par}DsRang1`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]} > */}
                <Form.Item name={[`${record.par}DsRang1`]} >
                  <InputNumber placeholder='最小值' disabled={disabledFlag} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                <span style={{ padding: '0 2px' }}> - </span>
                {/* <Form.Item name={[`${record.par}DsRang2`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={[`${record.par}DsRang2`]}>
                  <InputNumber placeholder='最大值' disabled={disabledFlag} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                {/* <Form.Item name={[`${record.par}DsUnit`]} style={{ marginLeft: 5 }} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请选择' }]}> */}
                <Form.Item name={[`${record.par}DsUnit`]} style={{ marginLeft: 5 }} >
                  <Select   allowClear placeholder='单位列表' disabled={disabledFlag} onChange={() => { isJudge(record, 1) }}>
                    {unitFormat(record)}
                  </Select>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={numChecked} onChange={onNumChange}>数采仪量程</Checkbox></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 320,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            } else {
              let disabledFlag = false;
              switch (record.isDisplay) {
                case 1: case 2:
                  disabledFlag = (record.isDisplay == 1 && !isDisPlayCheck1 || !numChecked) || (record.isDisplay == 2 && !isDisPlayCheck2 || !numChecked) ? true : false
                  break;
                case 3: case 4:
                  disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || !numChecked || (record.isDisplay == 4 && !isDisPlayCheck4 || !numChecked) ? true : false
                  break;
                default:
                  disabledFlag = !numChecked
              }
              return <Row justify='center' align='middle'>
                {/* <Form.Item name={[`${record.par}ScyRang1`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}  
                <Form.Item name={[`${record.par}ScyRang1`]}>
                  <InputNumber placeholder='最小值' disabled={disabledFlag} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                <span style={{ padding: '0 2px' }}> - </span>
                {/* <Form.Item name={[`${record.par}ScyRang2`]} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请输入' }]}> */}
                <Form.Item name={[`${record.par}ScyRang2`]} >
                  <InputNumber placeholder='最大值' disabled={disabledFlag} onBlur={() => { isJudge(record, 1) }} />
                </Form.Item>
                {/* <Form.Item name={[`${record.par}ScyUnit`]} style={{ marginLeft: 5 }} rules={[{ required: !disabledFlag ? rangReq[`${record.par}RangFlag`] : !disabledFlag, message: '请选择' }]}> */}
                <Form.Item name={[`${record.par}ScyUnit`]} style={{ marginLeft: 5 }} >        
                  <Select   allowClear placeholder='单位列表' disabled={disabledFlag} onChange={() => { isJudge(record, 1) }}>
                    {unitFormat(record)}
                  </Select>
                </Form.Item>
              </Row>
            }
          }
        },
        {
          title: '量程一致性(自动判断)',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 170,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            return <Row justify='center' align='middle'>
              <Form.Item name={`${record.par}RangUniformity`}>
                <Radio.Group disabled>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 220,
          render: (text, record, index) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            let disabledFlag = false;
            switch (record.isDisplay) {
              case 1: case 2:
                disabledFlag = record.isDisplay == 1 && !isDisPlayCheck1 || record.isDisplay == 2 && !isDisPlayCheck2 ? true : false
                break;
              case 3: case 4:
                disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || record.isDisplay == 4 && !isDisPlayCheck4 ? true : false
                break;
            }
            return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
              <Form.Item name={[`${record.par}RangCheck`]}>
                <Checkbox.Group disabled={disabledFlag} options={manualOptions} onChange={(val) => { onManualChange(val, record, `${record.par}RangCheck`, 1) }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 180,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            let disabledFlag = false;
            switch (record.isDisplay) {
              case 1: case 2:
                disabledFlag = record.isDisplay == 1 && !isDisPlayCheck1 || record.isDisplay == 2 && !isDisPlayCheck2 ? true : false
                break;
              case 3: case 4:
                disabledFlag = record.isDisplay == 3 && !isDisPlayCheck3 || record.isDisplay == 4 && !isDisPlayCheck4 ? true : false
                break;
            }
            
            // return <Form.Item name={`${record.par}Remark`} rules={[{ required: remark[`${record.par}RemarkFlag`], message: '请输入' }]}>
             return <Form.Item name={`${record.par}Remark`}> 
              <TextArea rows={1} disabled={disabledFlag} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 100,
          render: (text, record, index) => {
            // const attachmentDataSource = getAttachmentDataSource(text);
            const obj = {
              children: <div>
                <Form.Item name='files1' >
                  <a onClick={() => { setFileType(1); setFileVisible(true) }}>上传附件</a>
                </Form.Item>
              </div>,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = addDataConsistencyData.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;

          }
        },
      ]
    },
  ]

  const isEnableChange = (values,name) =>{
    let setValObj = {}, traceValObj = {}, parRemark3Obj = {};
    if(values[0]){ //选中
      if(name==484){
        form3.setFieldsValue({[`485IsEnable`]:[1] })
         return
      }
      if(name==485){ //	 停炉信号激活时工况真实性
        form3.setFieldsValue({[`484IsEnable`]:[1] })
        return
      }
      setTraceValReq({...traceValReq,[`${name}TraceValFlag`]: true})

    }else{
      if(name==484){
        form3.setFieldsValue({[`485IsEnable`]:[] })
        return
      }
      if(name==485){
        form3.setFieldsValue({[`484IsEnable`]:[] })
        return
      }
      setTraceValReq({...traceValReq,[`${name}TraceValFlag`]: false})
    }
    
  }
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      fixed:'left',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      fixed:'left',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text == '颗粒物' && record.concentrationType == '原始浓度') {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && record.concentrationType == '标杆浓度') {
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
          dataIndex: 'concentrationType',
          key: 'concentrationType',
          width: 130,
          render: (text, record) => {
            return text ? text : '—'

          }
        },
        {
          title: '分析仪示值',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 300,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量' || record.Name === '流速' || record.Name === '颗粒物' && record.concentrationType === '标杆浓度') {
              return '—'
            }
            return <Row justify='center' align='middle'>
              {/* <Form.Item name={`${record.par}IndicaVal`} rules={[{ required: indicaValReq[`${record.par}IndicaValFlag`], message: '请输入' }]}> */}
              <Form.Item name={`${record.par}IndicaVal`}>    
                <InputNumber placeholder='请输入' onBlur={() => { isJudge(record, 2) }} />
              </Form.Item>
              {/* <Form.Item name={`${record.par}IndicaUnit`} style={{ marginLeft: 5 }} rules={[{ required: indicaValReq[`${record.par}IndicaValFlag`], message: '请选择' }]}> */}
              <Form.Item name={`${record.par}IndicaUnit`} style={{ marginLeft: 5 }}> 
                <Select   allowClear placeholder='单位列表' onChange={() => { isJudge(record, 2) }}>
                  {unitFormat(record)}
                </Select>
              </Form.Item>
            </Row>
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={dasChecked} onChange={onDasChange}>DAS示值</Checkbox></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 300,
          render: (text, record) => {
            return <Row justify='center' align='middle'>
              {/* <Form.Item name={[`${record.par}DsData`]} rules={[{ required: dasChecked ? indicaValReq[`${record.par}IndicaValFlag`] : dasChecked, message: '请输入' }]} > */}
              <Form.Item name={[`${record.par}DsData`]} >         
                <InputNumber placeholder='请输入' disabled={!dasChecked} onBlur={() => { isJudge(record, 2) }} />
              </Form.Item>
              {/* <Form.Item name={[`${record.par}DsDataUnit`]} style={{ marginLeft: 5 }} rules={[{ required: dasChecked ? indicaValReq[`${record.par}IndicaValFlag`] : dasChecked, message: '请选择' }]}> */}
              <Form.Item name={[`${record.par}DsDataUnit`]} style={{ marginLeft: 5 }}>      
                <Select  allowClear placeholder='单位列表' disabled={!dasChecked} onChange={() => { isJudge(record, 2) }}>
                  {unitFormat(record)}
                </Select>
              </Form.Item>
            </Row>
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={numChecked} onChange={onNumChange}>数采仪实时数据</Checkbox></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 300,
          render: (text, record) => {
            if (record.Name === 'NO' || record.Name === 'NO2') {
              return '—'
            }
            return <Row justify='center' align='middle'>
              {/* <Form.Item name={[`${record.par}ScyData`]} rules={[{ required: numChecked ? indicaValReq[`${record.par}IndicaValFlag`] : numChecked, message: '请输入' }]}> */}
              <Form.Item name={[`${record.par}ScyData`]}>       
                <InputNumber placeholder='请输入' style={{ minWidth: 85 }} disabled={!numChecked} onBlur={() => { isJudge(record, 2) }} />
              </Form.Item>
              {/* <Form.Item name={[`${record.par}ScyDataUnit`]} style={{ marginLeft: 5 }} rules={[{ required: numChecked ? indicaValReq[`${record.par}IndicaValFlag`] : numChecked, message: '请选择' }]}> */}
              <Form.Item name={[`${record.par}ScyDataUnit`]} style={{ marginLeft: 5 }}> 
               <Select  allowClear placeholder='单位列表' disabled={!numChecked} onChange={() => { isJudge(record, 2) }}>
                  {unitFormat(record)}
                </Select>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '数据一致性(自动判断)',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 170,
          render: (text, record) => {
            return <Row justify='center' align='middle'>
              <Form.Item name={[`${record.par}DataUniformity`]}>
                <Radio.Group disabled>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 220,
          render: (text, record, index) => {
            return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
              <Form.Item name={[`${record.par}RangCheck2`]}>
                <Checkbox.Group options={manualOptions} onChange={(val) => { onManualChange(val, record, `${record.par}RangCheck2`, 2) }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 180,
          render: (text, record) => {
            // return <Form.Item name={`${record.par}Remark2`} rules={[{ required: remark2[`${record.par}Remark2Flag`], message: '请输入' }]}>
            return <Form.Item name={`${record.par}Remark2`}>  
            <TextArea rows={1} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 100,
          render: (text, record, index) => {
            const obj = {
              children: <div>
                <Form.Item name='files2' >
                  <a onClick={() => { setFileType(2); setFileVisible(true) }}>上传附件</a>
                </Form.Item>
              </div>,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = addRealTimeData.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;

          }
        },
      ]
    },
  ]
  const columns4 = [
    {
      title: '序号',
      align: 'center',
      fixed:'left',
      width:80,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '检查项目',
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      fixed:'left',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    },
    {
      title: '是否启用',
      align: 'center',
      dataIndex: 'isDisplay',
      key: 'isDisplay',
      render: (text, record) => {

        return <Form.Item name={`${record.par}IsEnable`}>
          <Checkbox.Group onChange={(value)=>{isEnableChange(value,`${record.par}` )}}> <Checkbox value={1} ></Checkbox></Checkbox.Group>
        </Form.Item>

      }
    },
    {
      title: '设定值',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
      render: (text, record) => {
        if(record.Name==='停炉信号接入有备案材料' || record.Name==='停炉信号激活时工况真实性' ){
            return '—'
        } 
        //return <Form.Item name={`${record.par}SetVal`} rules={[{ required: traceValReq[`${record.par}TraceValFlag`], message: '请输入' }]}>
        return  <Form.Item name={`${record.par}SetVal`} > 
          <InputNumber placeholder='请输入' onBlur={() => { isJudge(record, 3) }} style={{ width: '100%' }} />
        </Form.Item>

      }
    },
    {
      title: '溯源值',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
      render: (text, record) => {
        if(record.Name==='停炉信号接入有备案材料' || record.Name==='停炉信号激活时工况真实性' ){
          return '—'
      }
        // return <Form.Item name={`${record.par}TraceVal`} rules={[{ required: traceValReq[`${record.par}TraceValFlag`], message: '请输入' }]}>
        return <Form.Item name={`${record.par}TraceVal`}>
          <InputNumber placeholder='请输入' onBlur={() => { isJudge(record, 3) }} style={{ width: '100%' }} />
        </Form.Item>

      }
    },
    {
      title: '一致性(自动判断)',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
      width: 150,
      render: (text, record) => {
        if(record.Name==='停炉信号接入有备案材料' || record.Name==='停炉信号激活时工况真实性' ){
          return '—'
      }
        return <Row justify='center' align='middle'>
          <Form.Item name={`${record.par}Uniform`}>
            <Radio.Group disabled>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Row>
      }
    },
    {
      title: '手工修正结果',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
      width: 220,
      render: (text, record, index) => {
        return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
          <Form.Item name={`${record.par}RangCheck3`}>
            <Checkbox.Group options={manualOptions} onChange={(val) => { onManualChange(val, record, `${record.par}RangCheck3`, 3) }} />
          </Form.Item>
        </Row>
      }
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
      width: 180,
      render: (text, record) => {
        // return <Form.Item name={`${record.par}Remark3`} rules={[{ required: remark3[`${record.par}Remark3Flag`], message: '请输入' }]}>
         return <Form.Item name={`${record.par}Remark3`}> 
          <TextArea rows={1} placeholder='请输入' style={{ width: '100%' }} />
        </Form.Item>
      }
    },
    {
      title: '附件',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
      width: 100,
      render: (text, record, index) => {
        return <div>
          <Form.Item name={`${record.par}ParFiles`} >
            <a style={{ paddingRight: 8 }} onClick={() => { setFileType(3); setFilePar(`${record.par}ParFiles`); setFileVisible(true); }}>上传附件</a>
          </Form.Item>
        </div>;

      }
    },
    {
      title: '判断依据',
      align: 'center',
      dataIndex: 'Col1',
      key: 'Col1',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    }
  ]

  const ModalCommonContent = () => {

  }

  const { addParconsistencyData } = props;

  const [fileVisible, setFileVisible] = useState(false)

  const userlist = tableInfo&&tableInfo['View_UserOperation']&&tableInfo['View_UserOperation'].dataSource || [];
  
  return (
    <div className={styles.remoteSupervisionSty}>

      <BreadcrumbWrapper>
        <Card title={
          <Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(pageIndex, pageSize) }}
            initialValues={{
              month: [moment().add(-30, 'day'),moment()],
            }}
            className={styles.queryForm}
            onValuesChange={onValuesChange}
          >
            <Row align='middle'>
              <Form.Item label='行政区' name='RegionCode' className='regSty'>
                <RegionList levelNum={2} style={{ width: 150}}/>
              </Form.Item>
              <Form.Item label='企业' name='EntCode'>
                <EntAtmoList pollutantType={2} style={{ width: 200}}/>
              </Form.Item>
              <Spin spinning={pointLoading} size='small' style={{ top: -8, left: 20 }}>
                <Form.Item label='监测点名称' name='DGIMN' >

                  <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 200}}>
                    {
                      pointList[0] && pointList.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Spin>
            </Row>

            <Row >
              <Form.Item label='核查日期' name='month'>
                {/* <DatePicker allowClear={false} picker="day" /> */}
                <RangePicker_  format='YYYY-MM-DD'  allowClear={false} showTime={false}  style={{ marginLeft: 0,width: 407}}/>
              </Form.Item>
              <Form.Item label='核查结果' name='CheckStatus' className='checkSty'>
                <Select placeholder='请选择' allowClear style={{ marginLeft: 0,width: 200}}>
                  <Option key={1} value={1} >合格</Option>
                  <Option key={2} value={2} >不合格</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" loading={tableLoading} htmlType="submit">
                  查询
               </Button>
                <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                  重置
                </Button>
               {!isRecord&&<Button style={{ marginRight: 8 }} onClick={add}>
                  添加
            </Button>}
              </Form.Item>
            </Row>
          </Form>}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            // scroll={{x:false, y: clientHeight - 500 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              onChange: handleTableChange,
            }}
          />
        </Card>
      </BreadcrumbWrapper>
      <Modal
        title={title}
        visible={visible}
        onOk={save}
        destroyOnClose
        onCancel={() => { setVisible(false);  }}
        width='98%'
        wrapClassName={styles.modalSty}
        okText='保存'
        getContainer={false}
        footer={[
          <Button  onClick={() => { setVisible(false)}}>
            取消
          </Button>,
          <Button  type="primary" onClick={()=>{save(1)}}  loading={tabType == 1 ? saveLoading1 || echoLoading || parLoading ||  false: saveLoading11 || echoLoading || parLoading ||false}>
            保存
          </Button>,
          <Button type="primary" onClick={()=>save(2)}  loading={tabType == 1 ? saveLoading2 || echoLoading || parLoading || false : saveLoading22 || echoLoading|| parLoading ||false} >
            提交
          </Button>,
        ]}
      >
         <Spin spinning={title==='编辑'&&editLoading}>
        <Form
          form={commonForm}
          name={"advanced_search"}
          initialValues={{
            month:moment(moment())
          }}
          className={styles.queryForm2}
          onValuesChange={onValuesChange2}
        >

          <Row className={styles.queryPar}>
            <Form.Item label='企业' name='EntCode' rules={[{ required: true, message: '请选择企业名称' }]}>
              <EntAtmoList pollutantType={2} allowClear={false} style={{width:200}}/>
            </Form.Item>
            <Spin spinning={pointLoading2} size='small' style={{ top: -8, left: '12.5%' }}>
              <Form.Item label='监测点名称' name='DGIMN'  style={{margin:'0 8px'}} rules={[{ required: true, message: '请选择监测点名称!' }]} >
                <Select  placeholder='请选择' showSearch optionFilterProp="children" style={{width:200}}>
                  {
                    pointList2[0] && pointList2.map(item => {
                      return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Spin>

            <Form.Item label='核查日期' name='month'  rules={[{ required: true, message: '请选择核查月份!' }]}>
              <DatePicker allowClear={false} picker="day" style={{width:200}}/>
            </Form.Item>
             
             <Spin size='small' spinning={title==='编辑'?  false : parLoading || false} style={{ top: -8, left: '15%' }}>
            <Form.Item label='点位运维负责人' name='OperationUserID' rules={[{ required: true, message: '请设置点位的负责运维人!' }]}>
               <Select placeholder='请选择' showSearch optionFilterProp="children">
                {userlist.map(item=>{
                 return  <Option key={item['dbo.View_User.User_ID']} value={item['dbo.View_User.User_ID']} >
                               {item['dbo.View_User.User_Name']}
                         </Option>
                })
              }
              </Select>
            </Form.Item>
            </Spin>
          </Row>


          <Tabs
            defaultActiveKey="1"
            onChange={key => {
              tabsChange(key);
            }}
            className={styles.tabSty}
          >
            <TabPane tab="数据一致性核查表" key="1">
              <Form
                form={form2}
                name={"advanced_search"}
                initialValues={{}}
                className={styles.queryForm2}
                onValuesChange={onValuesChange2}
              >
                <SdlTable
                  loading={parLoading}
                  columns={columns2}
                  dataSource={addDataConsistencyData}
                  pagination={false}
                  scroll={{  y: 'auto' }}
                  className='compactTableSty'
                  rowClassName={null}
                  sticky
                />
                <SdlTable
                  loading={parLoading}                                         
                  columns={columns3}                                         
                  dataSource={addRealTimeData}
                  pagination={false}
                  scroll={{ y: 'auto' }}
                  className='compactTableSty'
                  sticky
                />
                <Row style={{ color: '#f5222d', marginTop: 10 }}>
                  <span style={{ paddingRight: 10 }}>注：</span>
                  <ol type="1" style={{ listStyle: 'auto' }}>
                    <li>填写数值，带单位；</li>
                    <li>项目无DAS，可只填写实时数据内容；若使用我司数采仪，仍需简单核算、确认历史数据情况；</li>
                    <li>数字里传输数据须完全一致；模拟量传输，实时数据数据差值/量程≤1‰ (参考HJ/T 477-2009)；</li>
                    <li>多量程仅核查正常使用量程；</li>
                    <li>“数采仪里程”选项，若数采仪使用数字量方式传输且不需设定量程，可不勾选；</li>
                    <li>若同时存在普通数采仪及动态管控仪数采仪，“数采仪”相关选项选择向“国发平台”发送数据的数采仪；</li>
                    <li>颗粒物数值一致性： ≤10mg/m3的、绝对误差≤3mg/m3、 >10mg/m3的、绝对误差≤5mg/m3；</li>
                    <li>流速直测法的(如热质式、超声波式)，有显示屏的填写设置量程，无显示屏的填写铭牌量程；</li>
                    <li>手工修正结果填写“是、否、不适用“三项，不适用必须备注填写原因</li>
                  </ol>
                </Row>
              </Form>
            </TabPane>
            <TabPane tab="参数一致性核查表" key="2">
              <Form
                form={form3}
                name={"advanced_search"}
                initialValues={{}}
                className={styles.queryForm2}
                onValuesChange={onValuesChange2}
              >
                <SdlTable
                  loading={parLoading}
                  columns={columns4}
                  dataSource={addParconsistencyData}
                  pagination={false}
                  scroll={{ y: 'auto' }}
                  className='compactTableSty'
                  sticky
                />
                <Row style={{ color: '#f5222d', marginTop: 10 }}>
                  <span style={{ paddingRight: 10 }}>注：</span>
                  <ol type="1" style={{ listStyle: 'auto' }}>
                    <li>设定值一般在DAS查阅；若现场无DAS，应在其他对应设备查阅，如数采仪；</li>
                    <li>无72小时调试检测报告的，应向客户发送告知函；</li>
                    <li>已上传告知函的，同一点位可不再上传相应附件；</li>
                  </ol>
                </Row>
              </Form>
            </TabPane>
          </Tabs>
        </Form>
        </Spin>
      </Modal>

      <Modal
        title='上传附件'
        visible={fileVisible}
        onOk={() => { setFileVisible(false) }}
        destroyOnClose
        onCancel={() => { setFileVisible(false) }}
        width={'50%'}
      >
        <Upload {...uploadProps} style={{ width: '100%' }} >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        </Upload>
      </Modal>
      <Modal //预览上传附件
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => { setPreviewVisible(false) }}

      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);