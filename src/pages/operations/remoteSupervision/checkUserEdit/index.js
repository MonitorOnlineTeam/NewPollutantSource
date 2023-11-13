/**
 * 功  能：核查人员修改
 * 创建人：jab
 * 创建时间：2023.11.16
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Checkbox, Upload, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';


import { RollbackOutlined } from '@ant-design/icons';

import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from "../style.less"
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import AttachmentView from '../components/AttachmentView'

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const namespace = 'remoteSupervision'




const dvaPropsData = ({ loading, remoteSupervision, global }) => ({
  // tableLoading: loading.effects[`${namespace}/getConsistencyCheckInfo`],
  clientHeight: global.clientHeight,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getConsistencyCheckInfo: (payload, callback) => {
      dispatch({
        type: `${namespace}/getConsistencyCheckInfo`,
        payload: payload,
        callback: callback,
      })
    },
    getCheckPointConsistencyParam: (payload, callback) => {
      dispatch({
        type: `${namespace}/getCheckPointConsistencyParam`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {
  const { visible, title, onCancel, id, mn, type, clientHeight } = props;
  const [form2] = Form.useForm(); //添加编辑表单  数据一致性核查表
  const [form3] = Form.useForm(); //添加编辑表单   参数一致性核查表
  const [commonForm] = Form.useForm();
  const [rangeUpload, setRangeUpload] = useState()
  const [couUpload, setCouUpload] = useState()
  const [consistencyCheckDetail, setConsistencyCheckDetail] = useState({})
  const [tableData1, setTableData1] = useState([])
  const [tableData2, setTableData2] = useState([])

  const [dasRangStatus, setDasRangStatus] = useState(false)
  const [dataRangStatus, setDataRangStatus] = useState(false)
  const [dataRealTimeRangStatus, setDataRealTimeRangStatus] = useState(false) //数采仪实时数据
  const [tableLoading, setTableLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setTableLoading(true)
      props.getConsistencyCheckInfo({ ID: id }, (data) => { //DAS量程
        setRangeUpload(data.rangeUpload)
        setCouUpload(data.couUpload)
        setConsistencyCheckDetail(data)
        if (data.consistencyCheckList && data.consistencyCheckList[0]) {//获取das量程和数采仪量程是否被选中
          setDasRangStatus(data.consistencyCheckList[0].DataList.DASStatus == 1 ? true : false)
          setDataRangStatus(data.consistencyCheckList[0].DataList.DataRangeStatus == 1 ? true : false)
          setDataRealTimeRangStatus(data.consistencyCheckList[0].DataList.DataStatus == 1 ? true : false)
        }


        // 量程一致性核查表 数据
        let data1 = data.consistencyCheckList && data.consistencyCheckList.filter(item => !(item.DataList.CouType && item.PollutantName === '颗粒物' || !item.DataList.CouType && !item.DataList.Special && item.PollutantName === '流速'))
        let flag1 = true, flag2 = true;
        for (let i = 0; i < data1.length; i++) {
          if (data1[i].PollutantName === '颗粒物') {
            data1.splice(i + 1, 0, { PollutantName: '颗粒物', DataList: { flag: data1[i].DataList.Special == 1 ? 1 : 2 } })
            flag1 = false;
            break;
          }
        }
        for (let j = 0; j < data1.length; j++) {
          if (data1[j].PollutantName === '流速') {
            data1.splice(j + 1, 0, { PollutantName: '流速', DataList: { flag: data1[j].DataList.Special == 1 ? 1 : 2 } })
            flag2 = false;
            break;
          }

        }


        //颗粒物和流速都未选择的状态
        for (let k = 0; k < data.consistencyCheckList.length; k++) {
          if (flag1 && data.consistencyCheckList[k].PollutantName === '颗粒物') {
            data1.splice(k + 1, 0, { PollutantName: '颗粒物', DataList: { flag: 3 } }, { PollutantName: '颗粒物', DataList: { flag: 4 } })
            break;
          }
        }
        for (let l = 0; l < data.consistencyCheckList.length; l++) {
          if (flag2 && data.consistencyCheckList[l].PollutantName === '流速') {
            data1.splice(l + 1, 0, { PollutantName: '流速', DataList: { flag: 3 } }, { PollutantName: '流速', DataList: { flag: 4 } })
            break;
          }
        }
        //  setTimeout(()=>{
        setTableData1(data1)

        // 实时数据一致性核查表 数据
        let data2 = data.consistencyCheckList && data.consistencyCheckList.filter(item => !(item.DataList.Special && item.PollutantName === '颗粒物'))
        setTableData2(data2)

        const echoData = (data) =>{
          for (let i = 0; i < data.consistencyCheckList.length; i++) {
            const item = data.consistencyCheckList?.[i]?.DataList;
            echoRangRealTimeForamtData(item?.PollutantCode, item)
          }
          for (let i = 0; i < data.consistentParametersCheckList.length; i++) {
            const item = data.consistentParametersCheckList?.[i];
            echoParForamtData(item?.CheckItem, item)
          }
          setTableLoading(false)
        }
        if (data.consistencyCheckList?.[0] && data.consistentParametersCheckList?.[0]) {
          echoData(data)
        } else {
          props.getCheckPointConsistencyParam({ DGIMN: mn }, (data) => {
            if (data) {
              echoData(data)
              setConsistencyCheckDetail(data)
            }
          })
        }
      })
    }




  }, [visible]);
  const echoRangRealTimeForamtData = (code, val, ) => { //格式化 量程和实时数据一致性核查表
    form2.setFieldsValue({
      [`${code}RangCheck`]: val?.RangeStatus ? [val.RangeStatus] : [],
      [`${code}Remark`]: val?.RangeRemark,
      [`${code}RangCheck2`]: val?.CouStatus ? [val.CouStatus] : [],
      [`${code}Remark2`]: val?.CouRemrak,
    })
    onManualChange(val.RangeStatus && [val.RangeStatus], `${val.RangeStatus}RangCheck`)
    onManualChange(val.CouStatus && [val.CouStatus], `${val.CouStatus}RangCheck2`)

  }
  const echoParForamtData = (code, val, ) => { //格式化 参数一致性核查表
    form2.setFieldsValue({
      [`${code}RangCheck3`]: val.Uniformity ? [val.Uniformity] : [],
      [`${code}Remark3`]: val.Remark,
    })
    onManualChange(val.Uniformity && [val.Uniformity], `${val.Uniformity}RangCheck3`) //编辑 手工修正结果 参数一致性核查

  }
  const getAttachmentDataSource = (fileInfo) => {
    const fileList = [];
    if (fileInfo && fileInfo[0]) {
      fileInfo.map(item => {
        if (!item.IsDelete) {
          fileList.push({ name: item.FileName, attach: item.FileName })
        }
      })
    }
    return fileList;
  }

  const [manualOptions, setManualOptions] = useState([
    { label: '是', value: 1 },
    { label: '否', value: 2 },
    { label: '不适用', value: 3 },
  ])
  const onManualChange = (val, name, ) => { //手工修正结果

    if (!val) { return }
    const ele = document.getElementById(`advanced_search_${name}`)
    if (!ele) { return }
    for (var i = 0; i < ele.childNodes.length; i++) {
      if (val.toString() != i + 1) {
        ele.childNodes && ele.childNodes[i] && ele.childNodes[i].getElementsByTagName('input')[0].setAttribute("disabled", true)
      }
      if (!val[0]) { //点击取消复选框
        ele.childNodes && ele.childNodes[i] && ele.childNodes[i].getElementsByTagName('input')[0].removeAttribute("disabled")
      }
    }
  }
  const [saveLoading1, setSaveLoading1] = useState(false)
  const [saveLoading2, setSaveLoading2] = useState(false)
  const save = (type) => {
    const commonData = {
      ID: id,
      DGIMN: consistencyCheckDetail?.DGIMN,
      OperationUserID: consistencyCheckDetail?.operationUserID,
      DateTime: consistencyCheckDetail?.dateTime,
      Commitment: consistencyCheckDetail?.Commitment,
    }
    const values2 = form2.getFieldsValue();
    const dataList = consistencyCheckDetail.consistencyCheckList.map(item => {
      const data = item.DataList;
      console.log(values2[`${data?.PollutantCode}RangCheck`])
      return {
        PollutantCode: data?.PollutantCode,
        AnalyzerMin: data?.AnalyzerMin,
        AnalyzerMax: data?.AnalyzerMax,
        AnalyzerUnit: data?.AnalyzerUnit,
        DASMin: data?.DASMin,
        DASMax: data.DASMax,
        DASUnit: data?.DASUnit,
        DataMin: data?.DataMin,
        DataMax: data?.DataMax,
        DataUnit: data?.DataUnit,
        RangeAutoStatus: data?.RangeAutoStatus, //量程一致性(自动判断)
        OperationRangeRemark: data?.OperationRangeRemark,
        Special: data?.Special,//颗粒物有无显示屏 流速差压法和直测流速法
        DASStatus: data?.DASStatus,
        DataRangeStatus: data?.DataRangeStatus, //数采仪量程
        DataStatus: data?.DataStatus, //数采仪实时数据
        AnalyzerFile: item?.AnalyzerFileList?.[0]?.FileUuid,
        DASFile: item?.DASFileList?.[0]?.FileUuid,
        RangeFile: item?.DataFileList?.[0]?.FileUuid,
        RangCheck: values2[`${data?.PollutantCode}RangCheck`] && values2[`${item.PollutantCode}RangCheck`]?.[0] ? values2[`${item.PollutantCode}RangCheck`][0] : undefined,//手工修正结果
        Remark: values2[`${data?.PollutantCode}Remark`],
        CouStatus: values2[`${data?.PollutantCode}RangCheck2`] && values2[`${item.PollutantCode}RangCheck2`]?.[0] ? values2[`${item.PollutantCode}RangCheck2`][0] : undefined,//手工修正结果
        CouRemrak: values2[`${data?.PollutantCode}Remark2`],
      }
    })
    const values3 = form3.getFieldsValue();
    const paramDataList = consistencyCheckDetail.consistentParametersCheckList.map(item => {
      return {
        ...item,
        SetFile: item?.SetFileList?.[0]?.FileUuid,
        InstrumentFile: item?.InstrumentFileList?.[0]?.FileUuid,
        TraceabilityFile: item?.TraceabilityFileList?.[0]?.FileUuid,
        DataFile: item?.DataFileList?.[0]?.FileUuid,
        Uniformity: values3[`${item.CheckItem}RangCheck3`] && values3[`${item.CheckItem}RangCheck3`]?.[0] ? values3[`${item.CheckItem}RangCheck3`][0] : undefined,//手工修正结果
        Remark: values3[`${item.CheckItem}Remark3`],
      }
    })
    const data = {
      AddType: type,
      isCheckUser: true,
      Data: {
        ...commonData,
        CouUpload: consistencyCheckDetail?.couUpload?.[0]?.FileUuid,
      },
      DataList: dataList,
      ParamDataList: paramDataList,
    }
    console.log(data)
    //  props.addRemoteInspector({
    //   AddType: type,
    //   isCheckUser: isCheckUser,
    //   Data: {
    //     ...commonData,
    //     CouUpload:  consistencyCheckDetail?.couUpload?.[0]?.FileUuid,
    //   },
    //   DataList: dataList,
    //   ParamDataList: paramDataList,
    // }, (isSuccess) => {
    //   type == 1 ? setSaveLoading1(false) : setSaveLoading2(false)
    //   isSuccess && props.onFinish()
    // })

    // commonForm.validateFields().then(commonValues => {
    //   if (type == 2 && !isCheckUser && !commonValues.Commitment) { //运维人员不在结尾的“已阅读已承诺”打勾，不能提交
    //     message.error(`请确认“已阅读已承诺”!`)
    //     return;
    //   }
    //   const commonData = {
    //     ...commonValues,
    //     // ID: title === '添加' ? addId : editId,
    //     ID: editId,
    //     month: undefined,
    //     DateTime: commonValues.month ? moment(commonValues.month).format("YYYY-MM-DD 00:00:00") : undefined,
    //     Commitment: commonValues.Commitment ? 1 : undefined,
    //   }
    //   // if (tabType == 1) { //数据一致性核查表

    //   type == 1 ? setSaveLoading1(true) : setSaveLoading2(true);
    //   form2.validateFields().then((values) => {
    //     form3.validateFields().then(values2 => {
    //       const dataList1 = addDataConsistencyData.map(item => {
    //         return {
    //           PollutantCode: item.ChildID,
    //           AnalyzerMin: values[`${item.par}AnalyzerRang1`],
    //           AnalyzerMax: values[`${item.par}AnalyzerRang2`],
    //           AnalyzerUnit: values[`${item.par}AnalyzerUnit`],
    //           DASMin: dasChecked ? values[`${item.par}DsRang1`] : undefined,
    //           DASMax: dasChecked ? values[`${item.par}DsRang2`] : undefined,
    //           DASUnit: dasChecked ? values[`${item.par}DsUnit`] : undefined,
    //           DataMin: numChecked ? values[`${item.par}ScyRang1`] : undefined,
    //           DataMax: numChecked ? values[`${item.par}ScyRang2`] : undefined,
    //           DataUnit: numChecked ? values[`${item.par}ScyUnit`] : undefined,
    //           RangeAutoStatus: values[`${item.par}RangUniformity`], //量程一致性(自动判断)
    //           RangeStatus: values[`${item.par}RangCheck`] && values[`${item.par}RangCheck`][0] ? values[`${item.par}RangCheck`][0] : undefined,
    //           RangeRemark: values[`${item.par}Remark`],
    //           OperationRangeRemark: values[`${item.par}OperationRangeRemark`],
    //           Special: item.isDisplay == 1 && isDisPlayCheck1 || item.isDisplay == 3 && isDisPlayCheck3 ? 1 : item.isDisplay == 2 && isDisPlayCheck2 || item.isDisplay == 4 && isDisPlayCheck4 ? 2 : undefined,//颗粒物有无显示屏 流速差压法和直测流速法
    //           DASStatus: dasChecked ? 1 : 2,
    //           DataRangeStatus: numChecked ? 1 : 2, //数采仪量程
    //           DataStatus: numRealTimeChecked ? 1 : 2, //数采仪实时数据
    //           AnalyzerFile: values[`${item.par}AnalyzerFilePar`],
    //           DASFile: values[`${item.par}DasFilePar`],
    //           RangeFile: values[`${item.par}RangeFilePar`],
    //         }
    //       })
    //       const dataList2 = addRealTimeData.map(item => {
    //         return {
    //           PollutantCode: item.ChildID,
    //           AnalyzerCou: values[`${item.par}IndicaVal`],
    //           AnalyzerCouUnit: values[`${item.par}IndicaUnit`],
    //           DASCou: dasChecked ? values[`${item.par}DsData`] : undefined,
    //           DASCouUnit: dasChecked ? values[`${item.par}DsDataUnit`] : undefined,
    //           DataCou: numRealTimeChecked ? values[`${item.par}ScyData`] : undefined,
    //           DataCouUnit: numRealTimeChecked ? values[`${item.par}ScyDataUnit`] : undefined,
    //           CouAutoStatus: values[`${item.par}DataUniformity`],
    //           CouStatus: values[`${item.par}RangCheck2`] && values[`${item.par}RangCheck2`][0] ? values[`${item.par}RangCheck2`][0] : undefined,
    //           CouRemrak: values[`${item.par}Remark2`],
    //           OperationDataRemark: values[`${item.par}OperationDataRemark`],
    //           CouType: item.concentrationType == '原始浓度' ? 1 : item.concentrationType == '标杆浓度' ? 2 : undefined,
    //         }
    //       })
    //       dataList1.map((item, index) => { // 合并颗粒物和流速的数据  量程一致性核查表 删除没勾选的 颗粒物和流速
    //         if (item.PollutantCode == '411' && !item.Special || item.PollutantCode == '415' && !item.Special) {
    //           dataList1.splice(index, 1)
    //         }
    //       })

    //       let dataList = [], obj1 = null, obj2 = null, obj3 = null;
    //       dataList1.map((item1, index1) => { //合并两个表格的数据     
    //         dataList2.map((item2, index2) => {
    //           if (item1.PollutantCode == '411' || item2.PollutantCode == '411') { //颗粒物特殊处理
    //             if (item1.PollutantCode == '411' && item1.Special) {
    //               obj1 = item1 //颗粒物 有无显示屏
    //             }
    //             if (item2.PollutantCode == '411' && item2.CouType == 1) {
    //               obj2 = item2  //颗粒物 原始浓度
    //             }
    //             if (item2.PollutantCode == '411' && item2.CouType == 2) {
    //               obj3 = item2  //颗粒物 标杆浓度
    //             }
    //           } else {
    //             if (item1.PollutantCode == item2.PollutantCode) {
    //               dataList.push({ ...item1, ...item2 })
    //             }
    //           }
    //         })
    //       })

    //       dataList.push(obj1, obj2, obj3)
    //       dataList = dataList.filter(item => item) //去除值为空的情况

    //       const paramDataList = addParconsistencyData.map(item => {
    //         const values = values2
    //         return {
    //           CheckItem: item.ChildID,
    //           Status: values[`${item.par}IsEnable`] && values[`${item.par}IsEnable`][0] == 1 ? 1 : 2,
    //           SetValue: values[`${item.par}SetVal`],
    //           InstrumentSetValue: values[`${item.par}InstrumentSetVal`],
    //           TraceabilityValue: values[`${item.par}TraceVal`],
    //           DataValue: values[`${item.par}DataVal`],
    //           AutoUniformity: values[`${item.par}Uniform`],
    //           Uniformity: values[`${item.par}RangCheck3`] && values[`${item.par}RangCheck3`][0] ? values[`${item.par}RangCheck3`][0] : undefined,//手工修正结果
    //           Remark: values[`${item.par}Remark3`],
    //           OperationReamrk: values[`${item.par}OperationReamrk`],
    //           SetFile: values[`${item.par}SettingFilePar`],
    //           InstrumentFile: values[`${item.par}InstrumentFilePar`],
    //           TraceabilityFile: values[`${item.par}TraceabilityFilePar`],
    //           DataFile: values[`${item.par}DataFilePar`],
    //           SetStatus: values[`${item.par}SetStatus`] && values[`${item.par}SetStatus`][0] == 1 ? 1 : 2,
    //           InstrumentStatus: values[`${item.par}InstrumentStatus`] && values[`${item.par}InstrumentStatus`][0] == 1 ? 1 : 2,
    //           DataStatus: values[`${item.par}DataStatus`] && values[`${item.par}DataStatus`][0] == 1 ? 1 : 2,
    //         }
    //       })
    //       props.addRemoteInspector({
    //         AddType: type,
    //         isCheckUser: isCheckUser,
    //         Data: {
    //           ...commonData,
    //           CouUpload: values.files2,
    //         },
    //         DataList: dataList,
    //         ParamDataList: paramDataList,
    //       }, (isSuccess) => {
    //         // title === '添加' && id && setAddId(id)
    //         type == 1 ? setSaveLoading1(false) : setSaveLoading2(false)
    //         isSuccess && onFinish(pageIndex, pageSize)
    //       })


    //     }).catch((info) => {
    //       console.log('Validate Failed3:', info);
    //     });

    //   }).catch((info) => {
    //     console.log('Validate Failed2:', info);
    //   });
    // });





  }
  const columns1 = [
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

        if (text == '颗粒物' && record.DataList.Special || text == '流速' && record.DataList.Special) {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && record.DataList.flag == 3 || text == '流速' && record.DataList.flag == 3) {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && !record.DataList.Special && record.DataList.flag != 3 && record.DataList.flag != 4 || text == '流速' && !record.DataList.Special && record.DataList.flag != 3 && record.DataList.flag != 4) {
          obj.props.rowSpan = 0;
        }
        if (text == '颗粒物' && record.DataList.flag == 4 || text == '流速' && record.DataList.flag == 4) {
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
          width: 200,
          render: (text, record) => {
            if (text == '颗粒物') {
              if (record.DataList.Special && record.DataList.Special == 1 || record.DataList.flag == 3) {
                return <Checkbox checked={record.DataList.flag ? false : true} >有显示屏</Checkbox>
              } else if (record.DataList.Special && record.DataList.Special == 2 || record.DataList.flag == 4) {
                return <Checkbox checked={record.DataList.flag ? false : true} >无显示屏</Checkbox>
              } else if (record.DataList.flag == 2) {
                return <Checkbox checked={false} >有显示屏</Checkbox>
              } else {
                return <Checkbox checked={false} >无显示屏</Checkbox>
              }

            } else if (text == '流速') {
              if (record.DataList.Special && record.DataList.Special == 1 || record.DataList.flag == 3) {
                return <div style={{ marginLeft: -12 }}><Checkbox checked={record.DataList.flag ? false : true} >差压法</Checkbox></div>
              } else if (record.DataList.Special && record.DataList.Special == 2 || record.DataList.flag == 4) {
                return <Checkbox style={{ marginLeft: 15 }} checked={record.DataList.flag ? false : true} >直测流速法</Checkbox>
              } else if (record.DataList.flag == 2) {
                return <div style={{ marginLeft: -12 }}><Checkbox checked={false} >差压法</Checkbox></div>
              } else {
                return <Checkbox style={{ marginLeft: 15 }} checked={false} >直测流速法</Checkbox>
              }

            } else {
              return '—'
            }

          }
        },
        {
          title: '分析仪量程',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 120,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            } else {
              return record.DataList.AnalyzerMin || record.DataList.AnalyzerMin == 0 || record.DataList.AnalyzerMax || record.DataList.AnalyzerMax == 0 ? `${record.DataList.AnalyzerMin}-${record.DataList.AnalyzerMax}${record.DataList.AnalyzerUnit ? `（${record.DataList.AnalyzerUnit}）` : ''}` : null;
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
              {text && text[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
            </div>;
          }
        },
        {
          title: <Row align='middle' justify='center'> <Checkbox checked={dasRangStatus}></Checkbox><span style={{ paddingLeft: 5 }}>DAS量程</span></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 120,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            } else {
              return record.DataList.DASMin || record.DataList.DASMin == 0 || record.DataList.DASMax || record.DataList.DASMax == 0 ? `${record.DataList.DASMin}-${record.DataList.DASMax}${record.DataList.DASUnit ? `（${record.DataList.DASUnit}）` : ''}` : null;
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
              {text && text[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
            </div>;
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={dataRangStatus}  ></Checkbox><span style={{ paddingLeft: 5 }}>数采仪量程</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 150,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            } else {
              return record.DataList.DataMin || record.DataList.DataMin == 0 ? `${record.DataList.DataMin}-${record.DataList.DataMax}${record.DataList.DataUnit ? `（${record.DataList.DataUnit}）` : ''}` : null;

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
              {text && text[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
            </div>;
          }
        },
        {
          title: '量程一致性(自动判断)',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 180,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            } else {
              return record.DataList.RangeAutoStatus == 1 ? '是' : record.DataList.RangeAutoStatus == 2 ? '否' : null
            }
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 220,
          render: (text, record, index) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量') {
              return '—'
            }
            const disabledFlag = (record.PollutantName === '颗粒物' || record.PollutantName === '流速') && !record.DataList?.Special;
            return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
              <Form.Item name={`${record?.DataList?.PollutantCode}RangCheck`}>
                <Checkbox.Group disabled={disabledFlag} options={manualOptions} onChange={(val) => { onManualChange(val, `${record?.DataList?.PollutantCode}RangCheck`,) }} />
              </Form.Item>
            </Row>
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
            } else {
              return record.DataList.OperationRangeRemark
            }

          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 180,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标干流量') {
              return '—'
            }
            const disabledFlag = (record.PollutantName === '颗粒物' || record.PollutantName === '流速') && !record.DataList?.Special;
            return <Form.Item name={`${record?.DataList?.PollutantCode}Remark`}>
              <TextArea rows={1} disabled={disabledFlag} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
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
            return record.DataList.CouType == 1 ? '原始浓度' : record.DataList.CouType == 2 ? '标杆浓度' : '—'

          }
        },
        {
          title: '分析仪示值',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 120,
          render: (text, record) => {
            if (record.PollutantName === 'NOx' || record.PollutantName === '标干流量' || record.PollutantName === '流速' || record.PollutantName === '颗粒物' && record.DataList.CouType === 2) {
              return '—'
            }
            return record.DataList.AnalyzerCou
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={dasRangStatus} ></Checkbox> <span style={{ paddingLeft: 5 }}>DAS示值</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 120,
          render: (text, record) => {
            return record.DataList.DASCou
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={dataRealTimeRangStatus} ></Checkbox><span style={{ paddingLeft: 5 }}>数采仪实时数据</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 150,
          render: (text, record) => {
            if (record.PollutantName === 'NO' || record.PollutantName === 'NO2') {
              return '—'
            } else {
              return record.DataList.DataCou
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
                {couUpload && couUpload[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
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
          width: 150,
          render: (text, record) => {
            return record.DataList.CouAutoStatus == 1 ? '是' : record.DataList.CouAutoStatus == 2 ? '否' : null
          }

        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 220,
          render: (text, record, index) => {
            return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
              <Form.Item name={`${record?.DataList?.PollutantCode}RangCheck2`}>
                <Checkbox.Group options={manualOptions} onChange={(val) => { onManualChange(val, `${record?.DataList?.PollutantCode}RangCheck2`,) }} />
              </Form.Item>
            </Row>
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
          width: 180,
          render: (text, record) => {
            return <Form.Item name={`${record?.DataList?.PollutantCode}Remark2`}>
              <TextArea rows={1} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
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
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    },
    {
      title: '参数一致性核查表',
      children: [
        {
          title: '仪表设定值',
          align: 'center',
          dataIndex: 'SetValue',
          key: 'SetValue',
          width: 100,
          render: (text, record, index) => {
            return record.ItemName === '停炉信号接入有备案材料' || record.ItemName === '停炉信号激活时工况真实性' ? '—' : <Row justify='center' align='middle'> {(record.SetStatus == 1 || text) && <Checkbox checked={record.SetStatus == 1 ? true : false} style={{ paddingRight: 4 }}></Checkbox>}{text}</Row>;
          }
        },
        {
          title: '仪表设定值照片',
          align: 'center',
          dataIndex: 'SetFileList',
          key: 'SetFileList',
          width: 120,
          render: (text, record, index) => {
            const attachmentDataSource = getAttachmentDataSource(text);
            return <div>
              {text && text[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
            </div>;
          }
        },
        {
          title: 'DAS设定值',
          align: 'center',
          dataIndex: 'InstrumentSetValue',
          key: 'InstrumentSetValue',
          width: 110,
          render: (text, record, index) => {
            return record.ItemName === '停炉信号接入有备案材料' || record.ItemName === '停炉信号激活时工况真实性' ? '—' : <Row justify='center' align='middle'> {(record.InstrumentStatus == 1 || text) && <Checkbox checked={record.InstrumentStatus == 1 ? true : false} style={{ paddingRight: 4 }}></Checkbox>}{text}</Row>;
          }
        },
        {
          title: 'DAS设定值照片',
          align: 'center',
          dataIndex: 'InstrumentFileList',
          key: 'InstrumentFileList',
          width: 125,
          render: (text, record, index) => {
            const attachmentDataSource = getAttachmentDataSource(text);
            return <div>
              {text && text[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
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
            return record.ItemName === '停炉信号接入有备案材料' || record.ItemName === '停炉信号激活时工况真实性' ? '—' : <Row justify='center' align='middle'> {(record.DataStatus == 1 || text) && <Checkbox checked={record.DataStatus == 1 ? true : false} style={{ paddingRight: 4 }}></Checkbox>}{text}</Row>;
          }
        },
        {
          title: '数采仪设定值照片',
          align: 'center',
          dataIndex: 'DataFileList',
          key: 'DataFileList',
          width: 140,
          render: (text, record, index) => {
            const attachmentDataSource = getAttachmentDataSource(text);
            return <div>
              {text && text[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
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
            return record.ItemName === '停炉信号接入有备案材料' || record.ItemName === '停炉信号激活时工况真实性' ? '—' : text;
          }
        },
        {
          title: '溯源值照片',
          align: 'center',
          dataIndex: 'TraceabilityFileList',
          key: 'TraceabilityFileList',
          width: 120,
          render: (text, record, index) => {
            const attachmentDataSource = getAttachmentDataSource(text);
            return <div>
              {text && text[0] && <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} />}
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
            if (record.ItemName === '停炉信号接入有备案材料' || record.ItemName === '停炉信号激活时工况真实性') {
              return '—'
            } else {
              return text == 1 ? '是' : text == 2 ? '否' : null
            }
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'Uniformity',
          key: 'Uniformity',
          width: 220,
          render: (text, record, index) => {
            return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
              <Form.Item name={`${record?.DataList?.PollutantCode}RangCheck3`}>
                <Checkbox.Group options={manualOptions} onChange={(val) => { onManualChange(val, `${record?.DataList?.CheckItem}RangCheck3`,) }} />
              </Form.Item>
            </Row>
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
          render: (text, record) => {
            return <Form.Item name={`${record?.DataList?.PollutantCode}Remark3`}>
              <TextArea rows={1} placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
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
    }
  ]





  return (
    <Modal
      title={title}
      visible={visible}
      destroyOnClose
      onCancel={() => { onCancel && onCancel() }}
      wrapClassName={styles.modalSty}
      getContainer={false}
      mask={false}
      footer={[
        <Button onClick={() => { onCancel && onCancel() }}>
          取消
      </Button>,
        <Button type="primary" onClick={() => { save(1) }} loading={saveLoading1 || tableLoading || false}>
          保存
      </Button>,
        <Button type="primary" onClick={() => save(2)} loading={saveLoading2 || tableLoading || false} >
          提交
      </Button>,
      ]}
    >
      <Form
        form={commonForm}
        name={"advanced_search3"}
      >
        <Spin spinning={tableLoading}>
          <Row style={{ padding: '12px 0' }}>
            <Col span={8} style={{ paddingRight: 5 }}>
              <Form.Item label="企业名称">
                {consistencyCheckDetail.entName}
              </Form.Item>
            </Col>
            <Col span={8} style={{ paddingRight: 5 }}>
              <Form.Item label="监测点名称" >
                {consistencyCheckDetail.pointName}
              </Form.Item>
            </Col>
            <Col span={8} style={{ paddingRight: 5 }}>
              <Form.Item label="核查结果" >
                {consistencyCheckDetail.resultCheck === '不合格' ? <span style={{ color: '#f5222d' }}>{consistencyCheckDetail.resultCheck}</span> : <span>{consistencyCheckDetail.resultCheck}</span>}
              </Form.Item>
            </Col>
            <Col span={8} style={{ paddingRight: 5 }}>
              <Form.Item label="核查人">
                {consistencyCheckDetail.checkUserName}
              </Form.Item>
            </Col>
            <Col span={8} style={{ paddingRight: 5 }}>
              <Form.Item label="核查日期" >
                {consistencyCheckDetail.dateTime && moment(consistencyCheckDetail.dateTime).format("YYYY-MM-DD")}
              </Form.Item>
            </Col>
            <Col span={8} style={{ paddingRight: 5 }}>
              <Form.Item label="任务执行人"  >
                {consistencyCheckDetail.operationUserName}
              </Form.Item>
            </Col>
          </Row>
          <Form
            form={form2}
            name={"advanced_search"}
            initialValues={{}}
            className={styles.queryForm2}
          // onValuesChange={onValuesChange2}
          >
            <SdlTable
              columns={columns1}
              dataSource={tableData1}
              pagination={false}
              scroll={{ y: 'auto' }}
              size='small'
              rowClassName={null}
              sticky
            />
            <SdlTable
              columns={columns2}
              dataSource={tableData2}
              pagination={false}
              scroll={{ y: 'auto' }}
              size='small'
              rowClassName={null}
              sticky
            />
          </Form>
          <Row style={{ color: '#f5222d', marginTop: 10, fontSize: 16 }}>
            <span style={{ paddingRight: 12 }}>注：</span>
            <ol type="1" style={{ listStyle: 'auto', paddingBottom: 8 }}>
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
          <Form
            form={form3}
            name={"advanced_search"}
            initialValues={{}}
            className={styles.queryForm2}
          // onValuesChange={onValuesChange2}
          >
            <SdlTable
              columns={columns3}
              dataSource={consistencyCheckDetail.consistentParametersCheckList}
              pagination={false}
              scroll={{ y: 'auto' }}
              rowClassName={null}
              sticky
            />
            <Row style={{ color: '#f5222d', marginTop: 10, fontSize: 16 }}>
              <span style={{ paddingRight: 10 }}>注：</span>
              <ol type="1" style={{ listStyle: 'auto' }}>
                <li>设定值一般在DAS查阅；若现场无DAS，应在其他对应设备查阅，如数采仪；</li>
                <li>无72小时调试检测报告的，应向客户发送告知函；</li>
                <li>已上传告知函的，同一点位可不再上传相应附件；</li>
              </ol>
            </Row>
            <div style={{ color: '#f5222d', marginTop: 4, fontSize: 18 }}>
              我承诺：当月上传的全部量程、参数设定值和溯源值均已核对无误，现场实时数据保持一致，上传的各项数据和照片如有任何问题，本人愿接受相应处罚。
           </div>
            <Form.Item name='Commitment' valuePropName="checked" style={{ marginBottom: 0 }}>
              <Checkbox className={styles.commitmentSty}>
                已阅读已承诺！
            </Checkbox>
            </Form.Item>
          </Form>
        </Spin>
      </Form>
    </Modal>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);