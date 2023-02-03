/**
 * 功  能：运维督查管理 
 * 创建人：jab
 * 创建时间：2022.04.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled, ToTopOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import OperationInspectoUserList from '@/components/OperationInspectoUserList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import cuid from 'cuid';
import { getBase64, } from '@/utils/utils';
import Detail from './Detail';
import Lightbox from "react-image-lightbox-rotate";

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'cruxParSupervisionRectifica'




const dvaPropsData = ({ loading, cruxParSupervisionRectifica, global, common, point, autoForm }) => ({
  tableDatas: cruxParSupervisionRectifica.tableDatas,
  tableLoading: cruxParSupervisionRectifica.tableLoading,
  tableTotal: cruxParSupervisionRectifica.tableTotal,
  pointParamesLoading: loading.effects[`${namespace}/getPointParames`],
  infoloading: loading.effects[`${namespace}/getInspectorOperationInfoList`],
  userLoading: loading.effects[`common/getUserList`],
  entLoading: common.entLoading,
  clientHeight: global.clientHeight,
  monitoringTypeList: point.monitoringTypeList,
  systemModelList: point.systemModelList,
  loadingSystemModel: loading.effects[`point/getSystemModelList`] || false,
  systemModelListTotal: point.systemModelListTotal,
  operationInfoList: cruxParSupervisionRectifica.operationInfoList,
  exportLoading: loading.effects[`${namespace}/exportInspectorOperationManage`],



})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getPointByEntCode: (payload, callback) => { //监测点
      dispatch({
        type: `remoteSupervision/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },
    getEntNoFilterList: (payload, callback) => { //企业
      dispatch({
        type: `common/getEntNoFilterList`,
        payload: payload,
        callback: callback
      })
    },
    getMonitoringTypeList: (payload) => {
      dispatch({
        type: `point/getMonitoringTypeList`, //获取监测类别
        payload: payload,
      })
    },
    getSystemModelList: (payload) => { //列表 系统型号
      dispatch({
        type: `point/getSystemModelList`,
        payload: payload,
      })
    },
    getInspectorOperationManageList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getInspectorOperationManageList`,
        payload: payload,
      })
    },
    getInspectorOperationInfoList: (payload, callback) => {//获取单个督查表实体
      dispatch({
        type: `${namespace}/getInspectorOperationInfoList`,
        payload: payload,
        callback: callback,
      })

    },
    getPointParames: (payload, callback) => { //获取单个排口默认值
      dispatch({
        type: `${namespace}/getPointParames`,
        payload: payload,
        callback: callback
      })

    },
    deleteAttach: (file) => { //删除照片
      dispatch({
        type: "autoForm/deleteAttach",
        payload: {
          Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
        }
      })
    },
    addOrEditInspectorOperation: (payload, callback) => { //添加或修改
      dispatch({
        type: `${namespace}/addOrEditInspectorOperation`,
        payload: payload,
        callback: callback
      })

    },
    exportInspectorOperationManage: (payload, callback) => { //导出
      dispatch({
        type: `${namespace}/exportInspectorOperationManage`,
        payload: payload,
        callback: callback
      })
    },
    deleteInspectorOperation: (payload, callback) => { //删除
      dispatch({
        type: `${namespace}/deleteInspectorOperation`,
        payload: payload,
        callback: callback
      })
    },
    pushInspectorOperation: (payload, callback) => { //整改问题推送
      dispatch({
        type: `${namespace}/pushInspectorOperation`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {

  const { match: { path } } = props;
  //是否为运维督查记录
  const isRecord = path === '/operations/supervisionRecod' || path === '/operations/siteSupervisionRecod' ? true : false;
  // 是否为现场督查 1 现场 2 远程  其他为全部
  const inspectorType = path === '/operations/siteInspector' || path === '/operations/siteSupervisionRecod' ? 1 : path === '/operations/cruxParSupervisionRectifica' || path === '/operations/supervisionRecod' ? 2 : '';

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();

  const [tableForm] = Form.useForm();


  const [fromVisible, setFromVisible] = useState(false)


  const [type, setType] = useState()
  const [pushFlag, setPushFlag] = useState(true)


  const [manufacturerId, setManufacturerId] = useState(undefined)

  const { tableDatas, tableTotal, tableLoading, pointParamesLoading, infoloading, exportLoading, userLoading, entLoading, systemModelList, operationInfoList, isDetailModal,regDetailPar, } = props;


  const userCookie = Cookie.get('currentUser');



  useEffect(() => {
    isDetailModal ? onFinish() : initData()
  }, []);

  const initData = () => {
    onFinish()
    setTimeout(() => {
      props.getInspectorOperationInfoList({ ID: '', InspectorType: inspectorType, PollutantType: "2" }, (data) => {
        foramtProblemFilesList(data)
      })
      props.getMonitoringTypeList({})
    })
  }

  let columns = [
    {
      title: '序号',
      align: 'center',
      width: 80,
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '行政区',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: `企业名称`,
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '站点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '督查类别',
      dataIndex: 'InspectorTypeName',
      key: 'InspectorTypeName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测因子',
      dataIndex: 'PollutantCodeName',
      key: 'PollutantCodeName',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    {
      title: '督查人员',
      dataIndex: 'InspectorName',
      key: 'InspectorName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '督查日期',
      dataIndex: 'InspectorDate',
      key: 'InspectorDate',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text ? moment(text).format("YYYY-MM-DD") : null;
      }
    },
    {
      title: '运维人员',
      dataIndex: 'OperationUserName',
      key: 'OperationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '原则问题数量',
      dataIndex: 'PrincipleProblemNum',
      key: 'PrincipleProblemNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '重点问题数量',
      dataIndex: 'importanProblemNum',
      key: 'importanProblemNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '一般问题数量',
      dataIndex: 'CommonlyProblemNum',
      key: 'CommonlyProblemNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: `原则问题`,
      dataIndex: 'PrincipleProblem',
      key: 'PrincipleProblem',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    {
      title: '重点问题',
      dataIndex: 'importanProblem',
      key: 'importanProblem',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    {
      title: '一般问题',
      dataIndex: 'CommonlyProblem',
      key: 'CommonlyProblem',
      align: 'center',
      width: 200,
      ellipsis: true,
    },

    {
      title: '总分',
      dataIndex: 'TotalScore',
      key: 'TotalScore',
      align: 'center',
      ellipsis: true,
    },
    // {
    //   title: '状态',
    //   dataIndex: 'Status',
    //   key: 'Status',
    //   align: 'center',
    //   ellipsis: true,
    //   render: (text, record, index) => {
    //     return text==0 ? '保存' : text==1 ? '提交' : '推送';
    //   }
    // },
    {
      title: '推送状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return <span style={{ color: text == '未推送' ? '#f5222d' : '#52c41a' }}>{text}</span>;
      }
    },
    {
      title: '创建人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'UpdateUserName',
      key: 'UpdateUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'UpdateTime',
      key: 'UpdateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 180,
      ellipsis: true,
      render: (text, record) => {
        if (isRecord) {
          return <Tooltip title='详情'> <a onClick={() => { detail(record) }} ><DetailIcon /></a> </Tooltip>
        }
        const flag = record.IsFlag;
        const pushStatusFlag = record.Status == 2; //推送状态  只能查看详情
        const noSubmitStatusFlag = record.Status == 0 || record.Status == 2; //暂存状态 推送状态  不可以推送

        return <span>
          <Fragment><Tooltip title={!flag ? "运维督查记录已超过30天，不可编辑" : pushStatusFlag ? '推送状态，不可编辑' : "编辑"}> <a onClick={() => {
            if ((!flag) || pushStatusFlag) {
              return;
            }
            edit(record)

          }} ><EditOutlined style={{ cursor: (!flag && 'not-allowed') || (pushStatusFlag && 'not-allowed'), color: (!flag && '#00000040') || (pushStatusFlag && '#00000040'), fontSize: 16 }} /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment>
            <Tooltip title='详情'> <a onClick={() => { detail(record) }} ><DetailIcon /></a> </Tooltip> <Divider type="vertical" />
          </Fragment>
          <Fragment>
            <Tooltip title={!flag ? "运维督查记录已超过30天，不可推送" : noSubmitStatusFlag ? "只有提交状态才可以整改推送" : "整改推送"}>
              <Popconfirm disabled={(!flag) || noSubmitStatusFlag} placement="left" title="是否把整改问题推送给运维人员？"
                onConfirm={() => {
                  if ((!flag) || noSubmitStatusFlag) { return; } rectificationPush(record);
                }
                } okText="是" cancelText="否">
                <a style={{ cursor: (!flag && 'not-allowed') || (noSubmitStatusFlag && 'not-allowed'), color: (!flag && '#00000040') || (noSubmitStatusFlag && '#00000040'), }} > <ToTopOutlined style={{ fontSize: 16 }} /> </a>
              </Popconfirm>
            </Tooltip>
            <Divider type="vertical" />
          </Fragment>
          <Fragment>
            <Tooltip placement={(!flag) || pushStatusFlag ? "left" : 'top'} title={!flag ? "运维督查记录已超过30天，不可删除" : pushStatusFlag ? '推送状态，不可删除' : "删除"}>
              <Popconfirm disabled={(!flag) || pushStatusFlag} placement="left" title="确定要删除这条数据吗？"
                onConfirm={() => {
                  if ((!flag) || pushStatusFlag) { return; } del(record)
                }
                } okText="是" cancelText="否">
                <a style={{ cursor: (!flag && 'not-allowed') || (pushStatusFlag && 'not-allowed'), color: (!flag && '#00000040') || (pushStatusFlag && '#00000040'), }} > <DelIcon style={{ fontSize: 16 }} /> </a>
              </Popconfirm>
            </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];

  const [defaultEvaluate, setDefaultEvaluate] = useState(undefined)
  const [detailLoading, setDetailLoading] = useState(false)
  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    tableForm.resetFields();
    setFilesList0([])
    setDetailLoading(true)
    record.Status == 1 ? setPushFlag(false) : setPushFlag(true)
    form2.setFieldsValue({
      ID: record.ID,
    })
    props.getInspectorOperationInfoList(
      {
        ID: record.ID,
        InspectorType: inspectorType,
      }, (data) => {

        if (!data) {
          setDetailLoading(false)
          return
        }
        const echoData = data.Info && data.Info[0];

        if (!echoData) {
          setDetailLoading(false)
        }
        if (echoData) {
          const pollType = echoData.PollutantType;
          setPollutantType(pollType)

          setDefaultEvaluate(echoData.Evaluate ? echoData.Evaluate : undefined)//评价默认值

          setDeviceInfoList(echoData.MonitorPointEquipmentList)

          form2.setFieldsValue({
            ...echoData,
            EntCode: undefined,
            DGIMN: undefined,
            RegionCode: echoData.RegionCode.split(","),
            PollutantCode: echoData.PollutantCode.split(","),
            InspectorDate: moment(echoData.InspectorDate),
          })

          setGaschoiceData(echoData.GasManufacturerName ? echoData.GasManufacturerName : undefined)
          setPmchoiceData(echoData.PMManufacturerName ? echoData.PMManufacturerName : undefined)

          setDetailLoading(false)
          getEntList(pollType, () => { //单独获取企业填写的值
            form2.setFieldsValue({
              EntCode: echoData.EntCode,
            })

          })
          setPointLoading2(true)
          props.getPointByEntCode({ EntCode: echoData.EntCode }, (res) => { //单独获取监测点填写的值
            setPointList2(res)
            setPointLoading2(false)
            form2.setFieldsValue({
              DGIMN: echoData.DGIMN,
            })
          })
          if (echoData.Files && echoData.Files[0]) { // 附件
            setFilesCuid0(echoData.Files)
            tableForm.setFieldsValue({ Files: echoData.Files })
            let fileList = [];
            echoData.FilesList.map(item => {
              if (!item.IsDelete) {
                fileList.push({
                  uid: item.GUID,
                  name: item.FileName,
                  status: 'done',
                  url: `\\upload\\${item.FileName}`,
                })

              }
            })
            setFilesList0(fileList)
          }
          //督查内容
          tableForm.setFieldsValue({ Evaluate: echoData.Evaluate })//评价
          tableForm.setFieldsValue({ TotalScore: echoData.TotalScore }) //总分
        }

        const echoPrincipleProblemList = data.PrincipleProblemList && data.PrincipleProblemList; //原则问题
        const uploadList1 = {}, uploadCuid1 = {};
        echoPrincipleProblemList.map(item => {
          tableForm.setFieldsValue({
            [`Inspector${item.Sort}`]: item.Inspector,
            [`Remark${item.Sort}`]: item.Remark,
            [`Files1${item.Sort}`]: item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList[0].FileUuid,
          })
          const problemFilesList1 = [];
          item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList.map(items => {
            if (!items.IsDelete) {
              problemFilesList1.push({
                uid: items.GUID,
                name: items.FileName,
                status: 'done',
                url: `\\upload\\${items.FileName}`,
              })
            }
          })
          uploadList1[`Files1${item.Sort}`] = problemFilesList1;
          uploadCuid1[`Files1${item.Sort}`] = item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList[0].FileUuid ? item.AttachmentsList[0].FileUuid : cuid();
        })

        setFilesList1({ ...uploadList1 })
        setFilesCuidList1({ ...uploadCuid1 })

        const echoImportanProblemList = data.importanProblemList && data.importanProblemList; //重点问题
        const uploadList2 = {}, uploadCuid2 = {};
        echoImportanProblemList.map(item => {
          tableForm.setFieldsValue({
            [`Inspector${item.Sort}`]: item.Inspector,
            [`Remark${item.Sort}`]: item.Remark,
            [`Files2${item.Sort}`]: item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList[0].FileUuid,
          })
          const problemFilesList2 = [];
          item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList.map(items => {
            if (!items.IsDelete) {
              problemFilesList2.push({
                uid: items.GUID,
                name: items.FileName,
                status: 'done',
                url: `\\upload\\${items.FileName}`,
              })
            }
          })
          uploadList2[`Files2${item.Sort}`] = problemFilesList2;
          uploadCuid2[`Files2${item.Sort}`] = item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList[0].FileUuid ? item.AttachmentsList[0].FileUuid : cuid();
        })
        setFilesList2({ ...uploadList2 })
        setFilesCuidList2({ ...uploadCuid2 })


        const echoCommonlyProblemList = data.CommonlyProblemList && data.CommonlyProblemList; //一般问题
        const uploadList3 = {}, uploadCuid3 = {};;
        echoCommonlyProblemList.map(item => {
          tableForm.setFieldsValue({
            [`Inspector${item.Sort}`]: item.Inspector,
            [`Remark${item.Sort}`]: item.Remark,
            [`Files3${item.Sort}`]: item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList[0].FileUuid,
          })
          const problemFilesList3 = [];
          item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList.map(items => {
            if (!items.IsDelete) {
              problemFilesList3.push({
                uid: items.GUID,
                name: items.FileName,
                status: 'done',
                url: `\\upload\\${items.FileName}`,
              })
            }
          })
          uploadList3[`Files3${item.Sort}`] = problemFilesList3;
          uploadCuid3[`Files3${item.Sort}`] = item.AttachmentsList && item.AttachmentsList[0] && item.AttachmentsList[0].FileUuid ? item.AttachmentsList[0].FileUuid : cuid();

        })
        setFilesList3({ ...uploadList3 })
        setFilesCuidList3({ ...uploadCuid3 })
      })
  };
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const detail = (record) => { //详情
    setDetailId(record.ID);
    setDetailVisible(true)
  }

  const rectificationPush = (record) => { //整改推送
    props.pushInspectorOperation({ ID: record.ID }, () => {
      setPageIndex(1)
      onFinish(1, pageSize)
    })
  };

  const del = (record) => { //删除
    props.deleteInspectorOperation({ ID: record.ID }, () => {
      setPageIndex(1)
      onFinish(1, pageSize)
    })
  };


  const [entLoading2, setEntLoading2] = useState(false)
  const [entList, setEntList] = useState([])
  const getEntList = (pollutantType, callback) => {
    setEntLoading2(true)
    props.getEntNoFilterList({ RegionCode: '', PollutantType: pollutantType }, (data) => {
      setEntList(data)
      setEntLoading2(false);
      callback && callback();
    })
  }



  const foramtProblemFilesList = (data) => {
    const filesCuidObj1 = {}, filesListObj1 = {};
    data.PrincipleProblemList && data.PrincipleProblemList.map((item, index) => {
      filesCuidObj1[`Files1${item.Sort}`] = cuid();
      filesListObj1[`Files1${item.Sort}`] = [];
    })
    setFilesCuidList1(filesCuidObj1)
    setFilesList1(filesListObj1)

    const filesCuidObj2 = {}, filesListObj2 = {};
    data.importanProblemList && data.importanProblemList.map((item, index) => {
      filesCuidObj2[`Files2${item.Sort}`] = cuid();
      filesListObj2[`Files2${item.Sort}`] = [];
    })
    setFilesCuidList2(filesCuidObj2)
    setFilesList2(filesListObj2)


    const filesCuidObj3 = {}, filesListObj3 = {};
    data.CommonlyProblemList && data.CommonlyProblemList.map((item, index) => {
      filesCuidObj3[`Files3${item.Sort}`] = cuid();
      filesListObj3[`Files3${item.Sort}`] = [];
    })
    setFilesCuidList3(filesCuidObj3)
    setFilesList3(filesListObj3)
  }
  const add = () => {
    setFromVisible(true)
    setTimeout(() => {
      setType('add')
      setPushFlag(true)
      setPollutantType("2");
      setDeviceInfoList([])
      form2.resetFields();
      tableForm.resetFields();
      form2.setFieldsValue({ Inspector: userCookie && JSON.parse(userCookie).UserId })
      setGaschoiceData(null);//清空生产商的值 
      setPmchoiceData(null);
      setEvaluate(null); //评价
      setFilesList0([])
      setFilesCuid0(cuid())
      setTimeout(() => {
        props.getInspectorOperationInfoList({ ID: '', InspectorType: inspectorType, PollutantType: "2" }, (data) => {
          foramtProblemFilesList(data)
        })
        getEntList(2);
      }, 100);

    })
  };
  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();

      props.getInspectorOperationManageList({
        ...values,
        BTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        ETime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        InspectorType: inspectorType,
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : pageIndex,
        pageSize: pageSizes ? pageSizes : pageSize,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();

    props.exportInspectorOperationManage({
      ...values,
      BTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
      ETime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
      InspectorType: inspectorType,

    })
  }
  const formatData = (data, type) => {
    return data.map(item => {
      return {
        InspectorTypeID: item.InspectorTypeID,
        InspectorContentID: item.InspectorContentID,
        InspectorNum: item.InspectorNum,
        ParentID: item.ParentID,
        Inspector: tableForm.getFieldValue([`Inspector${item.Sort}`]),
        Remark: tableForm.getFieldValue([`Remark${item.Sort}`]),
        Attachment: type == 1 ? tableForm.getFieldValue([`Files1${item.Sort}`]) : type == 2 ? tableForm.getFieldValue([`Files2${item.Sort}`]) : tableForm.getFieldValue([`Files3${item.Sort}`]),
      }
    })
  }

  const [saveLoading0, setSaveLoading0] = useState(false)
  const [saveLoading1, setSaveLoading1] = useState(false)
  const [saveLoading2, setSaveLoading2] = useState(false)

  const save = async (type) => {


    const values = await form2.validateFields();
    try {
      type == 0 ? setSaveLoading0(true) : type == 1 ? setSaveLoading1(true) : setSaveLoading2(true);

      let principleProblemList = operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList || [];
      let importanProblemList = operationInfoList.importanProblemList && operationInfoList.importanProblemList || [];
      let commonlyProblemList = operationInfoList.CommonlyProblemList && operationInfoList.CommonlyProblemList || [];

      if (principleProblemList) {
        principleProblemList = formatData(principleProblemList, 1)
      }
      if (importanProblemList) {
        importanProblemList = formatData(importanProblemList, 2)
      }
      if (commonlyProblemList) {
        commonlyProblemList = formatData(commonlyProblemList, 3)
      }

      let devicePar = {} //设备信息参数

      const gas = deviceInfoList.filter(item => item.SystemName === "气态污染物CEMS")
      const pm = deviceInfoList.filter(item => item.SystemName === "颗粒物CEMS")

      if (gas && gas[0]) {
        devicePar.GasManufacturer = gas.map(item => item.Manufacturer).join(',')
        devicePar.GasEquipment = gas.map(item => item.Equipment).join(',')
      }
      if (pm && pm[0]) {
        devicePar.PMManufacturer = pm.map(item => item.Manufacturer).join(',')
        devicePar.PMEquipment = pm.map(item => item.Equipment).join(',')
      }

      const data = {
        ...values,
        RegionCode: values.RegionCode.join(","),
        PollutantCode: values.PollutantCode.join(","),
        InspectorDate: moment(values.InspectorDate).format("YYYY-MM-DD HH:mm:ss"),
        IsSubmit: type,
        TotalScore: tableForm.getFieldValue([`TotalScore`]),
        Files: tableForm.getFieldValue([`Files`]),
        Evaluate: tableForm.getFieldValue([`Evaluate`]),
        InspectorOperationInfoList: [...principleProblemList, ...importanProblemList, ...commonlyProblemList],
        ...devicePar,
      }

      if (type == 0 || type == 1) {
        props.addOrEditInspectorOperation(data, (isSuccess) => {
          type == 0 ? setSaveLoading0(false) : type == 1 ? setSaveLoading1(false) : null;
          isSuccess && setFromVisible(false)
          isSuccess && onFinish()

        })
      } else { //推送
        props.pushInspectorOperation({ ID: form2.getFieldValue('ID') }, (isSuccess) => {
          setSaveLoading2(false)
          isSuccess && setFromVisible(false)
          isSuccess && onFinish()
        })
      }

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      type == 0 ? setSaveLoading0(false) : type == 1 ? setSaveLoading1(false) : setSaveLoading2(false);


    }

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
        form.setFieldsValue({ DGIMN: res[0].DGIMN })
      })
    }
  }


  const [pointList2, setPointList2] = useState([])
  const [pointLoading2, setPointLoading2] = useState(false)
  const [pollutantType, setPollutantType] = useState("2")
  const [deviceInfoList, setDeviceInfoList] = useState([]) //设备信息
  const onAddEditValuesChange = (hangedValues, allValues) => { //添加修改时的监测类型请求
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form2.setFieldsValue({ DGIMN: undefined })
        setPointList2([])
        return;
      }
      setPointLoading2(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        const data = res.filter(item => item.PollutantType == form2.getFieldValue('PollutantType'))
        setPointList2(data)
        setPointLoading2(false)
      })
      form2.setFieldsValue({ DGIMN: undefined })
    }

    if (Object.keys(hangedValues).join() == 'PollutantType') {
      getEntList(hangedValues.PollutantType)
      form2.resetFields();
      form2.setFieldsValue({ PollutantType: hangedValues.PollutantType, Inspector: userCookie && JSON.parse(userCookie).UserId });
      tableForm.resetFields();
      setPollutantType(hangedValues.PollutantType)
      setGaschoiceData(null);//清空生产商的值 
      setPmchoiceData(null);
      setEvaluate(null); //评价

      props.getInspectorOperationInfoList({ ID: '', InspectorType: inspectorType, PollutantType: hangedValues.PollutantType, }, (data) => {
        foramtProblemFilesList(data)
      })
    }
    if (Object.keys(hangedValues).join() == 'DGIMN') {
      props.getPointParames({ DGIMN: hangedValues.DGIMN }, (data) => {
        form2.setFieldsValue({
          ...data,
          OutType: data.OutputType ? data.OutputType : '1',
          RegionCode: data.RegionCode ? data.RegionCode.split(',') : undefined,
          PollutantCode: data.PollutantCode ? data.PollutantCode.split(',') : undefined,
        })
        setDeviceInfoList(data.MonitorPointEquipmentList)
        // setGaschoiceData(data.GasManufacturerName? data.GasManufacturerName : undefined)
        // setPmchoiceData(data.PMManufacturerName? data.PMManufacturerName : undefined)
      })
    }
  }
  const ExportComponents = () => <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>导出 </Button>

  const searchComponents = () => {
    return isDetailModal ?
      <Form
        form={form}
        name="advanced_search"
        layout='inline'
        initialValues={{
          RegionCode:regDetailPar.regionCode&&regDetailPar.regionCode,
          time: regDetailPar.time&&regDetailPar.time,
        }}
      >
        <Form.Item label='行政区' name='RegionCode' hidden>
          <RegionList noFilter levelNum={3} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="督查日期" name="time" style={{ marginLeft: 8, marginRight: 8 }} hidden >
          <RangePicker_
            style={{ width: 300 }}
            allowClear={false}
            format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item>
        <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>导出 </Button>
        </Form.Item>
      </Form>

      :
      <Form
        form={form}
        name="advanced_search"
        initialValues={{
          time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day"),]
        }}
        className={styles["ant-advanced-search-form"]}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Row align='middle'>
          <Form.Item label='行政区' name='RegionCode' >
            <RegionList noFilter levelNum={3} style={{ width: 150 }} />
          </Form.Item>
          <Spin spinning={entLoading} size='small' style={{ top: -3, left: 39 }}>
            <Form.Item label='企业' name='EntCode' style={{ marginLeft: 8, marginRight: 8 }}>
              <EntAtmoList noFilter style={{ width: 300 }} />
            </Form.Item>
          </Spin>
          <Spin spinning={pointLoading} size='small' style={{ top: -3, left: 44 }}>
            <Form.Item label='站点名称' name='DGIMN' >

              <Select placeholder='请选择' showSearch optionFilterProp="children" style={{ width: 150 }}>
                {
                  pointList[0] && pointList.map(item => {
                    return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Spin>
        </Row>

        <Row>
          <Form.Item label="督查人员" name="Inspector"  >
            <OperationInspectoUserList type='2' style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label="督查日期" name="time" style={{ marginLeft: 8, marginRight: 8 }}  >
            <RangePicker_
              style={{ width: 300 }}
              allowClear={false}
              format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="运维人员" name="OperationUser" style={{ marginRight: 8 }}  >
            <OperationInspectoUserList noFirst style={{ width: 150 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
              查询
     </Button>
            <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }} >
              重置
     </Button>
            {!isRecord && <Button style={{ marginRight: 8 }} onClick={() => { add() }} >
              添加
       </Button>}
            <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>导出 </Button>

          </Form.Item>

        </Row>
      </Form>
  }


  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)

  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }


  const generatorCol = [
    {
      title: '设备厂家',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key: 'SystemName',
      align: 'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key: 'SystemModel',
      align: 'center',
    },
    {
      title: '监测类别',
      dataIndex: 'MonitoringType',
      key: 'MonitoringType',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { generatorColChoice(record) }}> 选择 </Button>
      }
    },

  ]

  const generatorColChoice = (record) => {
    if (popVisible) {
      form2.setFieldsValue({ GasManufacturer: record.ManufacturerID, GasEquipment: record.SystemModel });
      setGaschoiceData(record.ManufacturerName)
      setPopVisible(false)
    } else {//颗粒物
      form2.setFieldsValue({ PMManufacturer: record.ManufacturerID, PMEquipment: record.SystemModel });
      setPmchoiceData(record.ManufacturerName)
      setPmPopVisible(false)
    }

  }

  const [gaschoiceData, setGaschoiceData] = useState()
  const [pmchoiceData, setPmchoiceData] = useState()

  const onClearChoice = (value) => {
    form2.setFieldsValue({ GasManufacturer: value, GasEquipment: '' });
    setGaschoiceData(value)
  }

  const onPmClearChoice = (value) => {
    form2.setFieldsValue({ PMManufacturer: value, PMEquipment: '' });
    setPmchoiceData(value)
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(10)
  const onFinish3 = async (pageIndex2, pageSize2) => { //生成商弹出框 查询
    try {
      const values = await form3.validateFields();
      props.getSystemModelList({
        pageIndex: pageIndex2,
        pageSize: pageSize2,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const handleTableChange2 = async (PageIndex, PageSize) => { //分页
    const values = await form3.validateFields();
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    props.getSystemModelList({ ...values, PageIndex, PageSize })
  }
  const [popVisible, setPopVisible] = useState(false)
  const [pmPopVisible, setPmPopVisible] = useState(false) //颗粒物弹出框

  useEffect(() => {
    if (pmPopVisible || popVisible) {
      form3.resetFields()
      setPageIndex2(1)
      setPageSize2(10)
      onFinish3(1, 10)
    }
  }, [pmPopVisible, popVisible])


  const { monitoringTypeList } = props;

  const manufacturerList = operationInfoList && operationInfoList.EquipmentManufacturerList || [];
  const selectPopover = (type) => {
    return <Popover
      title=""
      trigger="click"
      visible={type === 'pm' ? pmPopVisible : popVisible}
      onVisibleChange={(visible) => { type === 'pm' ? setPmPopVisible(visible) : setPopVisible(visible) }}
      placement={"right"}
      getPopupContainer={trigger => trigger.parentNode}
      content={
        <Form
          form={form3}
          name="advanced_search3"
          onFinish={() => { onFinish3(pageIndex2, pageSize2) }}
          initialValues={{
            ManufacturerId: manufacturerList[0] && manufacturerList[0].ID,
          }}
        >
          <Row>
            <Form.Item style={{ marginRight: 8 }} name='ManufacturerID' >
              <Select placeholder='请选择设备厂家' showSearch allowClear filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {
                  manufacturerList[0] && manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item style={{ marginRight: 8 }} name="SystemModel">
              <Input allowClear placeholder="请输入系统型号" />
            </Form.Item>
            <Form.Item style={{ marginRight: 8 }} name="MonitoringType">
              <Select allowClear placeholder="请选择监测类别">
                {
                  monitoringTypeList[0] && monitoringTypeList.map(item => {
                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                  })
                }
              </Select>

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType='submit'>
                查询
             </Button>
            </Form.Item>
          </Row>
          <SdlTable scroll={{ y: 'calc(100vh - 550px)' }} style={{ width: 800 }}
            loading={props.loadingSystemModel} bordered dataSource={systemModelList} columns={generatorCol}
            pagination={{
              total: props.systemModelListTotal,
              pageSize: pageSize2,
              current: pageIndex2,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange2,
            }}
          />
        </Form>
      }
    >
      <Select onChange={type === 'pm' ? onPmClearChoice : onClearChoice} allowClear showSearch={false} value={type === 'pm' ? pmchoiceData : gaschoiceData} dropdownClassName={'popSelectSty'} placeholder="请选择">
      </Select>
    </Popover>
  }
  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    return obj;
  };
  const [principleDisabled, setPrincipleDisabled] = useState({})
  const principleChange = (val, sort) => { //有无原则问题
    if (!val) { //为否时
      setPrincipleDisabled({ ...principleDisabled, [sort]: true })
      tableForm.setFieldsValue({ [`Remark${sort}`]: undefined })
    } else {
      setPrincipleDisabled({ ...principleDisabled, [sort]: false })
    }
    setTimeout(() => {
      console.log(principleDisabled)
    }, 1000)
  }
  const supervisionCol1 = [{
    title: <span style={{ fontWeight: 'bold', fontSize: 14 }}>
      {operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList[0] && operationInfoList.PrincipleProblemList[0].Title}
    </span>,
    align: 'center',
    children: [
      {
        title: '序号',
        align: 'center',
        width: 80,
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '督查内容',
        dataIndex: 'ContentItem',
        key: 'ContentItem',
        align: 'center',
        width: 380,
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: `有无原则问题`,
        dataIndex: 'Inspector',
        key: 'Inspector',
        align: 'center',
        width: 200,
        render: (text, record) => {
          return <Form.Item name={`Inspector${record.Sort}`}>
            <Select placeholder='请选择' onChange={(val, ) => principleChange(val, record.Sort)}> <Option value={'0'}>有</Option>   <Option value={null}>无</Option>     </Select>
          </Form.Item>
        },
      },
      {
        title: '问题描述',
        dataIndex: 'Remark',
        key: 'Remark',
        align: 'center',
        render: (text, record) => {
          return <Form.Item name={`Remark${record.Sort}`}>
            <TextArea rows={1} placeholder='请输入' disabled={principleDisabled[`${record.Sort}`]} />
          </Form.Item>
        },
      },
      {
        title: '附件',
        dataIndex: 'Attachments',
        key: 'Attachments',
        align: 'center',
        render: (text, record) => {
          return <Form.Item name={`Files1${record.Sort}`}>
            <a onClick={() => { setFileType(1); setFileVisible(true); setFiles1(`Files1${record.Sort}`); }}>{filesList1[`Files1${record.Sort}`] && filesList1[`Files1${record.Sort}`][0] ? '查看附件' : '上传附件'}</a>
          </Form.Item>
        },
      },
    ]
  }
  ]


  const [evaluate, setEvaluate] = useState(null);
  const supervisionCol2 = [{
    title: <span style={{ fontWeight: 'bold', fontSize: 14 }}>
      {operationInfoList.importanProblemList && operationInfoList.importanProblemList[0] && operationInfoList.importanProblemList[0].Title}
    </span>,
    align: 'center',
    children: [
      {
        title: '序号',
        align: 'center',
        width: 80,
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '督查内容',
        dataIndex: 'ContentItem',
        key: 'ContentItem',
        align: 'center',
        width: 380,
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: `扣分`,
        dataIndex: 'Inspector',
        key: 'Inspector',
        align: 'center',
        width: 200,
        render: (text, record) => {
          return <Form.Item name={`Inspector${record.Sort}`}>
            <InputNumber placeholder='请输入' max={-0.1} />
          </Form.Item>
        },
      },
      {
        title: '说明',
        dataIndex: 'Remark',
        key: 'Remark',
        align: 'center',
        render: (text, record) => {
          return <Form.Item name={`Remark${record.Sort}`}>
            <TextArea rows={1} placeholder='请输入' />
          </Form.Item>
        },
      },
      {
        title: '附件',
        dataIndex: 'Attachments',
        key: 'Attachments',
        align: 'center',
        render: (text, record) => {
          return <Form.Item name={`Files2${record.Sort}`} >
            <a onClick={() => { setFileType(2); setFileVisible(true); setFiles2(`Files2${record.Sort}`); }}>{filesList2[`Files2${record.Sort}`] && filesList2[`Files2${record.Sort}`][0] ? '查看附件' : '上传附件'}</a>
          </Form.Item>
        },
      },

    ]

  }]

  const supervisionCol3 = [{
    title: <span style={{ fontWeight: 'bold', fontSize: 14 }}>
      {operationInfoList.CommonlyProblemList && operationInfoList.CommonlyProblemList[0] && operationInfoList.CommonlyProblemList[0].Title}
    </span>,
    align: 'center',
    children: [
      {
        title: '序号',
        align: 'center',
        width: 80,
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '督查内容',
        dataIndex: 'ContentItem',
        key: 'ContentItem',
        align: 'center',
        width: 380,
        render: (text, record) => {
          return <div style={{ textAlign: "left" }}>{text}</div>
        },
      },
      {
        title: `扣分`,
        dataIndex: 'Inspector',
        key: 'Inspector',
        align: 'center',
        width: 200,
        render: (text, record) => {
          return <Form.Item name={`Inspector${record.Sort}`}>
            <InputNumber placeholder='请输入' max={-0.1} />
          </Form.Item>
        },
      },
      {
        title: '说明',
        dataIndex: 'Remark',
        key: 'Remark',
        align: 'center',
        render: (text, record) => {
          return <Form.Item name={`Remark${record.Sort}`}>
            <TextArea rows={1} placeholder='请输入' />
          </Form.Item>
        },
      },
      {
        title: '附件',
        dataIndex: 'Attachments',
        key: 'Attachments',
        align: 'center',
        render: (text, record) => {
          return <Form.Item name={`Files3${record.Sort}`} >
            <a onClick={() => { setFileType(3); setFileVisible(true); setFiles3(`Files3${record.Sort}`); }}>{filesList3[`Files3${record.Sort}`] && filesList3[`Files3${record.Sort}`][0] ? '查看附件' : '上传附件'}</a>
          </Form.Item>
        },
      },
    ]
  }]
  const supervisionCol4 = [
    {
      align: 'center',
      render: (text, record, index) => {
        return index == 0 ? '总分' : '评价'
      },
    },
    {
      align: 'center',
      render: (text, record, index) => {
        if (index == 0) {
          return <Form.Item name='TotalScore'>
            <InputNumber disabled />
          </Form.Item>
        } else {
          return {
            children: <> {!detailLoading && <TextArea defaultValue={type == 'add' ? undefined : defaultEvaluate} onChange={(e) => { tableForm.setFieldsValue({ Evaluate: e.target.value }) }} rows={1} placeholder='请输入' />}</>,
            props: { colSpan: 3 },
          };
        }
      }
    },
    {
      align: 'center',
      render: (text, record, index) => {
        const obj = {
          children: '附件',
          props: {},
        };
        if (index === 1) {
          obj.props.colSpan = 0;
        }
        return obj;
      }
    },
    {
      key: 'Component',
      render: (text, record, index) => {
        const obj = {
          children: <Form.Item>
            <a onClick={() => { setFileType(0); setFileVisible(true) }}>{filesList0 && filesList0[0] ? '查看附件' : '上传附件'}</a>
          </Form.Item>,
          props: {},
        };
        if (index === 1) {
          obj.props.colSpan = 0;
        }
        return obj;
      }
    },
  ]

  const deviceCol = [
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key: 'SystemName',
      align: 'center',
    },
    {
      title: 'CEMS设备生产商',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: 'CEMS设备规格型号',
      dataIndex: 'Equipment',
      key: 'Equipment',
      align: 'center',
    },
  ]
  const pollutantList = () => {
    const data = pollutantType == 1 ? operationInfoList.WaterPollutantList : operationInfoList.GasPollutantList;
    return data && data.map(item => {
      return <Option key={item.PollutantCode} value={item.PollutantCode} >{item.PollutantName}</Option>
    })

  }
  const [fileType, setFileType] = useState(0)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState()
  const [previewImage, setPreviewImage] = useState()

  //总评
  const [fileVisible, setFileVisible] = useState(false)
  const [filesCuid0, setFilesCuid0] = useState(cuid())
  const [filesList0, setFilesList0] = useState([])


  /***原则问题 */
  const [files1, setFiles1] = useState() // 上传附件 点击字段
  const [filesCuidList1, setFilesCuidList1] = useState({}) // 上传附件
  const [filesList1, setFilesList1] = useState({}) // 附件列表
  const filesCuid1 = () => {
    for (var key in filesCuidList1) {
      if (key == files1) {
        return filesCuidList1[key]
      }
    }
  }
  /***重点问题 */
  const [files2, setFiles2] = useState()
  const [filesCuidList2, setFilesCuidList2] = useState({})
  const [filesList2, setFilesList2] = useState({})
  const filesCuid2 = () => {
    for (var key in filesCuidList2) {
      if (key == files2) {
        return filesCuidList2[key]
      }
    }
  }
  /***一般问题 */
  const [files3, setFiles3] = useState()
  const [filesCuidList3, setFilesCuidList3] = useState({})
  const [filesList3, setFilesList3] = useState({})
  const filesCuid3 = () => {
    for (var key in filesCuidList3) {
      if (key == files3) {
        return filesCuidList3[key]
      }
    }
  }

  const [photoIndex, setPhotoIndex] = useState(0); //预览附件Index
  const [imgUrlList, setImgUrlList] = useState([]);//预览附件列表

  const uploadProps = { //附件上传 
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    accept: 'image/*',
    data: {
      FileUuid: fileType == 0 ? filesCuid0 : fileType == 1 ? filesCuid1() : fileType == 2 ? filesCuid2() : filesCuid3(),
      FileActualType: '0',
    },
    listType: "picture-card",
    beforeUpload: (file) => {
      const fileType = file?.type; //获取文件类型 type  image/*
      if (!(/^image/g.test(fileType))) {
        message.error(`请上传图片格式文件!`);
        return false;
      }
      // 将从父组件拿到的accept类型转为数组，类似['.docs','.rar','.zip','.png']
      // const docsArr = accept?.split(",");
      // if (!docsArr?.includes(`.${fileDate[0]}`)) {
      //   message.error(`仅支持文件格式：${accept}格式附件!`);
      //   return false;
      // }
      // if (file.size / 1024 / 1024 > 100) {
      //   message.error("文件大小不能超过100兆");
      //   return false;
      // }
    },
    onChange(info) {
      const fileList = info.fileList.map(item => {
        if (item.response && item.response.IsSuccess) { //刚上传的
          return { ...item, url: `/upload/${item.response.Datas}`, }
        } else {
          return { ...item }
        }
      })
      console.log(info)
      if (info.file.status === 'done') {
        fileType == 0 ? setFilesList0(fileList) : fileType == 1 ? setFilesList1({ ...filesList1, [files1]: fileList }) : fileType == 2 ? setFilesList2({ ...filesList2, [files2]: fileList }) : setFilesList3({ ...filesList3, [files3]: fileList })
        fileType == 0 ? tableForm.setFieldsValue({ Files: filesCuid0 }) : fileType == 1 ? tableForm.setFieldsValue({ [files1]: filesCuid1() }) : fileType == 2 ? tableForm.setFieldsValue({ [files2]: filesCuid2() }) : tableForm.setFieldsValue({ [files3]: filesCuid3() })
      }
      if (info.file.status === 'error') {
        message.error('上传文件失败！')
      }
    },
    onPreview: async file => { //预览
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      // setPreviewImage(file.url || file.preview)
      // setPreviewVisible(true)
      // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
      const imageList = fileType == 0 ? filesList0 : fileType == 1 ? filesList1[files1] : fileType == 2 ? filesList2[files2] : filesList3[files3]

      let imageListIndex = 0;
      imageList.map((item, index) => {
        if (item.uid === file.uid) {
          imageListIndex = index;
        }
      });
      if (imageList && imageList[0]) {
        //拼接放大的图片地址列表
        const imgData = [];
        imageList.map((item, key) => {
          imgData.push(item.url)
        })
        setImgUrlList(imgData)
      }
      setPhotoIndex(imageListIndex)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    },
    onRemove: (file) => {
      if (!file.error) {
        props.deleteAttach(file)
      }

    },
    fileList: fileType == 0 ? filesList0 : fileType == 1 ? filesList1[files1] : fileType == 2 ? filesList2[files2] : filesList3[files3]
  };

  if (isDetailModal) {
    columns = columns.filter(item => item.title != '操作')
  }

  return (
    <div className={styles.supervisionManagerSty}>
      <BreadcrumbWrapper hideBreadcrumb={isDetailModal} >
        <Card title={searchComponents()} className={isDetailModal&&styles.supervisionManagerModalSty}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            scroll={{y:'calc(100vh - 360px)'}}
            pagination={{
              total: tableTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Card>
      </BreadcrumbWrapper>
      <Modal
        title={`${type === 'add' ? '添加' : '编辑'}`}
        visible={fromVisible}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        width='90%'
        footer={[
          <Button onClick={() => { setFromVisible(false) }}>
            取消
          </Button>,
          <Button type="primary" onClick={() => { save(0) }} loading={saveLoading0 || detailLoading || pointLoading2 || false}>
            保存
          </Button>,
          <Button type="primary" onClick={() => save(1)} loading={saveLoading1 || detailLoading || pointLoading2 || false} >
            提交
          </Button>,
          !pushFlag && <Button type="primary" onClick={() => save(2)} loading={saveLoading2 || detailLoading || pointLoading2 || false} >
            推送
         </Button>,
        ]}
      >
        <div style={{ fontSize: 16, padding: 6, textAlign: 'center', fontWeight: 'bold' }}>运维督查表</div>

        <Spin spinning={detailLoading}>

          <Form
            name="basic"
            form={form2}
            initialValues={{
              PollutantType: '2',
              InspectorDate: moment(),
            }}
            onValuesChange={onAddEditValuesChange}
          >

            <div className={'essentialInfoSty'}>
              <TitleComponents text='基本信息' />
              <Row>
                <Col span={12}>
                  <Form.Item label="行业" name="PollutantType" >
                    <EntType disabled={type == 'add' ? false : true} placeholder='请选择' allowClear={false} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Spin spinning={type == 'add' && infoloading} size='small' style={{ top: -3 }}>
                    <Form.Item label='督查类别' name="InspectorType" rules={[{ required: true, message: '请输入督查类别' }]} >
                      <Select placeholder='请选择'>
                        {
                          operationInfoList.InspectorTypeList && operationInfoList.InspectorTypeList.map(item => {
                            return <Option key={item.ChildID} value={item.ChildID} >{item.Name}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Spin>
                </Col>

                <Col span={12}>
                  <Spin spinning={entLoading2} size='small' style={{ top: -3 }}>
                    <Form.Item label="企业名称" name="EntCode" rules={[{ required: true, message: '请输入企业名称' }]}>
                      <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" >
                        {
                          entList[0] && entList.map(item => {
                            return <Option key={item.EntCode} value={item.EntCode} >{item.EntName}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Spin>
                </Col>
                <Col span={12}>
                  <Spin spinning={pointLoading2} size='small' style={{ top: -3 }}>
                    <Form.Item label='站点名称' name='DGIMN' rules={[{ required: true, message: '请选择站点名称' }]}>

                      <Select placeholder='请选择' allowClear showSearch optionFilterProp="children">
                        {
                          pointList2[0] && pointList2.map(item => {
                            return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Spin>
                </Col>

                {pollutantType == 2 && <Col span={12}>
                  <Form.Item label="是否排口" name="OutType" rules={[{ required: true, message: '请选择是否排口' }]} >
                    <Select placeholder='请选择' optionFilterProp="children">
                      <Option value={"0"}>排放口</Option>
                      <Option value={"1"}>非排放口</Option>
                    </Select>
                  </Form.Item>
                </Col>}
                <Col span={12}>
                  <Spin spinning={infoloading} size='small' style={{ top: -3, left: 0 }} >
                    <Form.Item label='行政区' name='RegionCode' rules={[{ required: true, message: '请选择行政区' }]}>
                      <SdlCascader noFilter selectType='3,是' />
                    </Form.Item>
                  </Spin>
                </Col>

                <Col span={12}>
                  <Spin spinning={type == 'add' && infoloading} size='small' style={{ top: -3, left: 0 }} >
                    <Form.Item label="监测因子" name="PollutantCode" rules={[{ required: true, message: '请输入监测因子' }]} >
                      <Select placeholder='请选择' mode='multiple' maxTagCount={4} maxTagPlaceholder='...'>
                        {pollutantList()}
                      </Select>
                    </Form.Item>
                  </Spin>
                </Col>
                <Col span={12}>
                  {/* <Spin spinning={type=='add'&&infoloading} size='small' style={{top:-3,left:0}} > */}
                  <Form.Item label="督查人员" name="Inspector" rules={[{ required: true, message: '请输入督查人员' }]} >
                    <OperationInspectoUserList noFirst type='2' allowClear={false} disabled />
                  </Form.Item>
                  {/* </Spin> */}
                </Col >
                <Col span={12}>
                  <Form.Item label="督查日期" name="InspectorDate" rules={[{ required: true, message: '请选择督查日期' }]} >
                    <DatePicker allowClear={false} />
                  </Form.Item>
                </Col >
                <Col span={12}>
                  {/* <Spin spinning={type=='add'&&infoloading} size='small' style={{top:-3,left:0}}> */}
                  <Form.Item allowClear={false} label="运维人员" name="OperationUser" rules={[{ required: true, message: '请输入运维人员' }]}>
                    <OperationInspectoUserList noFirst allowClear={false} />
                  </Form.Item>
                  {/* </Spin> */}
                </Col>
              </Row>
            </div>


            <div className={'deviceInfoSty'}>
              <TitleComponents text='设备信息' />

              {pollutantType == 1 ?
                <>
                  <Row className={'waterDeviceInfo'}>
                    <Col span={12}>
                      <Spin spinning={type == 'add' && infoloading} size='small' style={{ top: -3, left: 0 }} >
                        <Form.Item label='设备厂家' name='GasManufacturer' >

                          <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" >
                            {
                              manufacturerList[0] && manufacturerList.map(item => {
                                return <Option key={item.ID} value={item.ID} >{item.ManufacturerName}</Option>
                              })
                            }
                          </Select>
                        </Form.Item>
                      </Spin>
                    </Col>
                    <Col span={12}>
                      <Form.Item label='设备类型' name='GasEquipment'>
                        <Input placeholder='请输入' allowClear />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item label='设备备注' name='EquipmentRemark'>
                        <TextArea rows={1} placeholder='请输入' allowClear />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
                :
                <>
                  {/* <Row>
            <Col span={12}>
            <Form.Item label='气态CEMS设备生产商' name='GasManufacturer' rules={[{ required: false, message: '请选择气态CEMS设备生产商' }]}>
             {selectPopover()}
          </Form.Item>
            </Col>
            <Col span={12}>
                 <Form.Item label='气态CEMS设备规格型号' name='GasEquipment' rules={[{ required: false, message: '请输入气态CEMS设备规格型号' }]}>
                 <Input placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
          </Row>

           <Row>
            <Col span={12}>
            <Form.Item label='颗粒物CEMS设备生产商' name='PMManufacturer' rules={[{ required: false, message: '请选择颗粒物CEMS设备生产商' }]}>
            {selectPopover('pm')}
          </Form.Item>
            </Col>
            <Col span={12}>
                 <Form.Item label='颗粒物CEMS设备规格型号' name='PMEquipment' rules={[{ required: false, message: '请输入颗粒物CEMS设备规格型号' }]}>
                  <Input placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
          <Col span={24}>
          <Form.Item label='设备备注' name='EquipmentRemark'>
                  <TextArea rows={1} placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
          </Row> */}
                  <Table
                    bordered
                    dataSource={deviceInfoList}
                    columns={deviceCol}
                    rowClassName="editable-row"
                    pagination={false}
                    loading={pointParamesLoading}
                    size="small"
                    style={{ paddingBottom: 10 }}
                  />
                </>}

              <Form.Item hidden name="ID" >
                <Input />
              </Form.Item>
            </div>


          </Form>

          <div className={'supervisionContentSty'}>
            <Spin spinning={type == 'add' && infoloading}>
              <Form name="tableForm" form={tableForm}>
                <TitleComponents text='督查内容' />
                {!(operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList[0]) && !(operationInfoList.importanProblemList && operationInfoList.importanProblemList[0]) && !(operationInfoList.CommonlyProblemList && operationInfoList.CommonlyProblemList[0]) ?
                  <Table
                    bordered
                    dataSource={[]}
                    columns={[]}
                    pagination={false}
                    locale={{ emptyText: '暂无模板数据' }}
                    className="emptyTableSty"
                  />
                  :
                  <>
                    {operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList[0] && <Table
                      bordered
                      dataSource={operationInfoList.PrincipleProblemList && operationInfoList.PrincipleProblemList}
                      columns={supervisionCol1}
                      rowClassName="editable-row"
                      pagination={false}
                    />}
                    {operationInfoList.importanProblemList && operationInfoList.importanProblemList[0] && <Table
                      bordered
                      dataSource={operationInfoList.importanProblemList}
                      columns={supervisionCol2}
                      rowClassName="editable-row"
                      className="impTableSty"
                      pagination={false}
                    />}
                    {operationInfoList.CommonlyProblemList && operationInfoList.CommonlyProblemList[0] && <><Table
                      bordered
                      dataSource={operationInfoList.CommonlyProblemList}
                      columns={supervisionCol3}
                      rowClassName="editable-row"
                      pagination={false}
                      className={'commonlyTableSty'}
                    />
                      <Table
                        bordered
                        dataSource={[{ Sort: 1 }, { Sort: 2 }]}
                        columns={supervisionCol4}
                        className="summaryTableSty"
                        pagination={false}
                      /></>}
                  </>
                }

              </Form>
            </Spin>
          </div>

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
      {/* <Modal //预览上传附件
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => { setPreviewVisible(false) }}
        destroyOnClose
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
      {previewVisible && <Lightbox
        mainSrc={imgUrlList[photoIndex]}
        nextSrc={imgUrlList[(photoIndex + 1) % imgUrlList.length]}
        prevSrc={imgUrlList[(photoIndex + imgUrlList.length - 1) % imgUrlList.length]}
        onCloseRequest={() => setPreviewVisible(false)}
        onPreMovePrevRequest={() =>
          setPhotoIndex((photoIndex + imgUrlList.length - 1) % imgUrlList.length)
        }
        onPreMoveNextRequest={() =>
          setPhotoIndex((photoIndex + 1) % imgUrlList.length)
        }
      />}
      <Modal //详情
        visible={detailVisible}
        title={'详情'}
        footer={null}
        width={'90%'}
        className={styles.fromModal}
        onCancel={() => { setDetailVisible(false) }}
        destroyOnClose
      >
        <Detail ID={detailId} />
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);