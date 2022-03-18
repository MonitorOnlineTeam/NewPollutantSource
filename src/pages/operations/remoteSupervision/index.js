/**
 * 功  能：远程督查
 * 创建人：贾安波
 * 创建时间：2021.3.16
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Checkbox, Upload, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, UploadOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
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

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import cuid from 'cuid';

const namespace = 'remoteSupervision'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


const dvaPropsData = ({ loading, remoteSupervision, global, common }) => ({
  tableDatas: remoteSupervision.faultFeedbackList,
  tableLoading: loading.effects[`${namespace}/getFaultFeedbackList`],
  editLoading: loading.effects[`${namespace}/updateFaultFeedbackIsSolve`],
  pointListByEntCode: common.pointListByEntCode,
  clientHeight: global.clientHeight,
  tableTotal: global.tableTotal,
  entList: remoteSupervision.entList,
  addDataConsistencyData: remoteSupervision.addDataConsistencyData,
  addRealTimeConsistencyData: remoteSupervision.addRealTimeConsistencyData,
  addParconsistencyData: remoteSupervision.addParconsistencyData,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getFaultFeedbackList: (payload) => { // 列表
      dispatch({
        type: `${namespace}/getFaultFeedbackList`,
        payload: payload,
      })
    },
    updateFaultFeedbackIsSolve: (payload, callback) => { // 编辑
      dispatch({
        type: `${namespace}/updateFaultFeedbackIsSolve`,
        payload: payload,
        callback: callback
      })
    },
    getPointByEntCode: (payload, callback) => { // 根据企业获取监测点
      dispatch({
        type: `${namespace}/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },
    exportFaultFeedback: (payload) => { // 导出
      dispatch({
        type: `${namespace}/exportFaultFeedback`,
        payload: payload,
      })
    },
    getFaultFeedbackEntPoint: (payload) => { // 企业列表
      dispatch({
        type: `${namespace}/getFaultFeedbackEntPoint`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {
  const pchildref = useRef();
  const [form] = Form.useForm();
  const [form2] = Form.useForm(); //添加编辑表单
  const [showType, setShowType] = useState('1')
  const [dates, setDates] = useState([]);
  const { tableDatas, tableLoading, exportLoading, clientHeight, type, time, tableTotal } = props;


  useEffect(() => {
    onFinish(pageIndex, pageSize);
    props.getFaultFeedbackEntPoint({})
  }, []);





  const exports = async () => {
    const values = await form.validateFields();
    props.exportTaskWorkOrderList({
      ...queryPar,
      pageIndex: undefined,
      pageSize: undefined,
    })

  };
  const [ID, setID] = useState()
  const columns = [
    {
      title: '省/市',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
    },
    {
      title: '企业名称',
      dataIndex: 'ParentName',
      key: 'ParentName',
      align: 'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
    },
    {
      title: '核查月份',
      dataIndex: 'FaultTime',
      key: 'FaultTime',
      align: 'center',
    },
    {
      title: '核查结果',
      dataIndex: 'IsSolve',
      key: 'IsSolve',
      align: 'center',
      render: (text, record, index) => {
        if (text == 1) {
          return '已解决'
        } else {
          return '待解决'
        }

      }
    },
    {
      title: '核查人',
      dataIndex: 'CreatUserName',
      key: 'CreatUserName',
      align: 'center',
    },
    {
      title: '核查时间',
      dataIndex: 'CreatDateTime',
      key: 'CreatDateTime',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <Tooltip title="编辑">
              <a onClick={() => {
                setVisible(true)
                setID(record.ID)
              }}  >
                <EditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="详情">
              <a onClick={() => {
                router.push({ pathname: '/operations/remoteSupervision/detail', query: { detailData: JSON.stringify(record) } })
              }}>
                <ProfileOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="删除">
              <Popconfirm title="确定要删除此条信息吗？" onConfirm={() => del(record)} okText="是" cancelText="否">
                <a href="#" ><DelIcon /></a>
              </Popconfirm>
            </Tooltip>
          </>
        )
      }

    }
  ]


  const [outOrInside, setOutOrInside] = useState(1)
  const onFinish = async (pageIndex, pageSize) => {  //查询
    try {
      const values = await form.validateFields();
      props.getFaultFeedbackList({
        ...values,
        time: undefined,
        FaultBTime: values.Time ? moment(values.Time[0]).format("YYYY-MM-DD HH:mm:ss") : undefined,
        FaultETime: values.Time ? moment(values.Time[1]).format("YYYY-MM-DD HH:mm:ss") : undefined,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const add = async () => {
    setVisible(true)
    form2.resetFields();
    setDasChecked(false)
    setNumChecked(false)
    setIsDisPlayCheck1(false)
    setIsDisPlayCheck2(false)
    setIsDisPlayCheck3(false)
    setIsDisPlayCheck4(false)

    
  }
  const save = () => {
    props.updateFaultFeedbackIsSolve({
      ID: ID,
      IsSolve: IsSolve
    }, () => {
      setVisible(false)
      onFinish(pageIndex, pageSize)
    })
  }
  const changeEnt = (val) => {
  }

  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)

  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if(!hangedValues.EntCode){ //清空时 不走请求
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

  const [pointList2, setPointList2] = useState([])
  const [pointLoading2, setPointLoading2] = useState(false)
  const onValuesChange2 = (hangedValues, allValues) => { //添加 编辑
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if(!hangedValues.EntCode){//清空时 
        form2.setFieldsValue({ DGIMN: undefined })
        setPointList2([])
        return;
      }
      setPointLoading2(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList2(res)
        setPointLoading2(false)
      })
      form2.setFieldsValue({ DGIMN: undefined })
    }
    if (Object.keys(hangedValues).join() == 'DGIMN') { //监测点
    }
    if (Object.keys(hangedValues).join() == 'month') { //
      console.log(hangedValues)
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

  const tabsChange = (key) => {

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
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState()
  const [previewImage, setPreviewImage] = useState()


  const uploadProps = { // 设备运营接手资料  资料附件上传 
    action: '/api/rest/PollutantSourceApi/UploadApi/PostFiles',
    data: {
      FileUuid: filesCuid1,
      FileActualType: '0',
    },
    listType: "picture-card",
    onChange(info) {
      setFileList1(info.fileList)
      if (info.file.status === 'error') {
        message.error('上传文件失败！')
      }
    },
    onRemove: (file) => {
      if (!file.error) {
        // props.deleteAttach(file)
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
    fileList: fileList1,
  };
  // cosnt []
  const [manualOptions, setManualOptions] = useState([
    { label: '是', value: "0" },
    { label: '否', value: "1" },
    { label: '不适用', value: "2" },
  ])
  const onManualChange = (val, name, index) => { //手工修正结果

    const ele = document.getElementById(`advanced_search_rangCheck${index}`)
    for (var i = 0; i < ele.childNodes.length; i++) {
      if (val.toString() != i) {
        // ele.childNodes[i].setAttribute('class','ant-checkbox-wrapper ant-checkbox-wrapper-disabled ant-checkbox-group-item') //设置禁用样式
        ele.childNodes[i].getElementsByTagName('input')[0].setAttribute("disabled", true)
      }
      if (!val[0]) {
        ele.childNodes[i].getElementsByTagName('input')[0].removeAttribute("disabled")
      }
    }
  }
  const isJudge=(row)=>{
    console.log(row.par)
  }
  //颗粒物 有无显示屏
 const [isDisPlayCheck1,setIsDisPlayCheck1] = useState(false)
 const [isDisPlayCheck2,setIsDisPlayCheck2] = useState(false)
 const isDisplayChange=(e,name)=>{
  const displayEle1 = document.getElementById(`advanced_search_isDisplay1`);
  const displayEle2 = document.getElementById(`advanced_search_isDisplay2`);
  if(name==='isDisplay1'){
    setIsDisPlayCheck1(e.target.checked)
    displayEle2.setAttribute("disabled", true)
  }
  if(name==='isDisplay2'){
    setIsDisPlayCheck2(e.target.checked)
    displayEle1.setAttribute("disabled", true)
  }
  if(!e.target.checked){ //取消选中状态
    setIsDisPlayCheck1(e.target.checked)
    setIsDisPlayCheck2(e.target.checked)
    displayEle1.removeAttribute("disabled") 
    displayEle2.removeAttribute("disabled")
  }
 }

   //流速 有无显示屏
   const [isDisPlayCheck3,setIsDisPlayCheck3] = useState(false)
   const [isDisPlayCheck4,setIsDisPlayCheck4] = useState(false)
   const isDisplayChange2 =(e,name)=>{
    const displayEle3 = document.getElementById(`advanced_search_isDisplay3`);
    const displayEle4 = document.getElementById(`advanced_search_isDisplay4`);
    if(name==='isDisplay3'){
      setIsDisPlayCheck3(e.target.checked)
      displayEle4.setAttribute("disabled", true)
    }
    if(name==='isDisplay4'){
      setIsDisPlayCheck4(e.target.checked)
      displayEle3.setAttribute("disabled", true)
    }
    if(!e.target.checked){ //取消选中状态
      setIsDisPlayCheck3(e.target.checked)
      setIsDisPlayCheck4(e.target.checked)
      displayEle3.removeAttribute("disabled") 
      displayEle4.removeAttribute("disabled")
    }
   }
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'par',
      key: 'par',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text=='颗粒物'&&record.isDisplay==1 || text=='流速'&&record.isDisplay==3) {
          obj.props.rowSpan = 2;
        }
        if (text=='颗粒物'&&record.isDisplay==2  || text=='流速'&&record.isDisplay==4) {
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
          width: 130,
          render: (text, record) => {
            switch (text) {
              case 1:
                return <Row align='middle' justify='center'>
                  <Form.Item name='isDisplay1'>
                    <Checkbox  onChange={(e)=>{isDisplayChange(e,'isDisplay1')}}>有显示屏</Checkbox>
                  </Form.Item></Row>
                break;
              case 2:
                return <Row align='middle' justify='center'>
                  <Form.Item  name='isDisplay2'>
                  <Checkbox onChange={(e)=>{isDisplayChange(e,'isDisplay2')}}>无显示屏</Checkbox>
                  </Form.Item> <NumTips style={{ top: 'auto', right: 12 }} content={'1、颗粒物分析仪无显示屏时，分析仪量程填写铭牌量程'} /></Row>
                break;
              case 3:
                return <Row align='middle' style={{ paddingLeft: 12 }}>
                  <Form.Item name='isDisplay3' rules={[{ required: false, message: '请选择' }]}>
                    <Checkbox  onChange={(e)=>{isDisplayChange2(e,'isDisplay3')}}>差压法</Checkbox>
                  </Form.Item></Row>
                break;
              case 4:
                return <Row align='middle' style={{ paddingLeft: 12 }}>
                  <Form.Item name='isDisplay4' rules={[{ required: false, message: '请选择' }]}>
                    <Checkbox  onChange={(e)=>{isDisplayChange2(e,'isDisplay4')}}>只测流速法</Checkbox>
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
          dataIndex: 'age',
          key: 'age',
          width: 300,
          render: (text, record) => {
            if(record.par==='NOx'||record.par==='标杆流量'){
              return '—'
            }else{
              let disabledFlag  = false;
              switch(record.isDisplay){
                case 1: case 2:
                disabledFlag = record.isDisplay==1&&!isDisPlayCheck1 || record.isDisplay==2&&!isDisPlayCheck2? true : false 
                 break;
                 case 3: case 4:
                disabledFlag = record.isDisplay==3&&!isDisPlayCheck3 || record.isDisplay==4&&!isDisPlayCheck4? true : false 
                   break;
              }
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='最小值'  disabled={disabledFlag} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <span style={{ padding: '0 2px' }}> - </span>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='最大值' disabled={disabledFlag}  onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <Form.Item name='EntCode' style={{ marginLeft: 5 }} rules={[{ required: true, message: '请选择' }]}>
                <Select placeholder='单位列表' disabled={disabledFlag} onBlur={()=>{isJudge(record)}}>
                </Select>
              </Form.Item>
            </Row>
          }
        }
        },
        {
          title: <Row align='middle' justify='center'> <Checkbox checked={dasChecked} onChange={onDasChange}>DAS量程</Checkbox></Row>,
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 300,
          render: (text, record) => {
            if(record.par==='NOx'||record.par==='标杆流量'){
              return '—'
            }else{              
              let disabledFlag  = false;
              switch(record.isDisplay){
                case 1: case 2:
                disabledFlag = (record.isDisplay==1&&!isDisPlayCheck1 || !dasChecked) || (record.isDisplay==2&&!isDisPlayCheck2 || !dasChecked)? true : false 
                 break;
                 case 3: case 4:
                disabledFlag = (record.isDisplay==3&&!isDisPlayCheck3||!dasChecked )|| (record.isDisplay==4&&!isDisPlayCheck4|| !dasChecked) ? true : false 
                   break;
                 default:
                  disabledFlag=!dasChecked
              }
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]} >
                <Input placeholder='最小值' disabled={disabledFlag} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <span style={{ padding: '0 2px' }}> - </span>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='最大值' disabled={disabledFlag}  onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <Form.Item name='EntCode' style={{ marginLeft: 5 }} rules={[{ required: true, message: '请选择' }]}>
                <Input placeholder='单位列表' disabled={disabledFlag}  onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
            </Row>
          }
        }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={numChecked} onChange={onNumChange}>数采仪量程</Checkbox></Row>,
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 300,
          render: (text, record) => {
            if(record.par==='NOx'||record.par==='标杆流量'){
              return '—'
            }else{
              let disabledFlag  = false;
              switch(record.isDisplay){
                case 1: case 2:
                disabledFlag = (record.isDisplay==1&&!isDisPlayCheck1 || !numChecked) || (record.isDisplay==2&&!isDisPlayCheck2 || !numChecked)? true : false 
                 break;
                 case 3: case 4:
                disabledFlag = record.isDisplay==3&&!isDisPlayCheck3&&!numChecked || (record.isDisplay==4&&!isDisPlayCheck2 || !numChecked)? true : false 
                   break;
                 default:
                  disabledFlag=!numChecked
              }
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='最小值' disabled={disabledFlag} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <span style={{ padding: '0 2px' }}> - </span>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='最大值' disabled={disabledFlag} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <Form.Item name='EntCode' style={{ marginLeft: 5 }} rules={[{ required: true, message: '请选择' }]}>
                <Input placeholder='单位列表' disabled={disabledFlag} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
            </Row>
          }
        }
        },
        {
          title: '量程一致性(自动判断)',
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 150,
          render: (text, record) => {
            if(record.par==='NOx'||record.par==='标杆流量'){
              return '—'
            }
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode2'>
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
          dataIndex: 'age',
          key: 'age',
          width: 220,
          render: (text, record, index) => {
            if(record.par==='NOx'||record.par==='标杆流量'){
              return '—'
            }
            return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
              <Form.Item name='EntCode' name={`rangCheck${index}`}>
                <Checkbox.Group options={manualOptions} onChange={(val) => { onManualChange(val, `rangCheck${index}`, index) }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 100,
          render: (text, record) => {
            if(record.par==='NOx'||record.par==='标杆流量'){
              return '—'
            }
            return <Form.Item name='EntCode' rules={[{ required: false, message: '请输入' }]}>
              <Input placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'file',
          key: 'file',
          width: 150,
          render: (text, record, index) => {
            // const attachmentDataSource = getAttachmentDataSource(text);
            const obj = {
              children: <div>
                <Form.Item name='Files' >
                  <a onClick={() => { setFileVisible(true) }}>上传附件</a>
                </Form.Item>
                {/* <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} /> */}
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
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'par',
      key: 'par',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text=='颗粒物'&&record.isDisplay==1) {
          obj.props.rowSpan = 2;
        }
        if (text=='颗粒物'&&record.isDisplay==2 ) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '实时一致性核查表',
      children: [
        {
          title: '浓度类型',
          align: 'center',
          dataIndex: 'type',
          key: 'type',
          width: 130,
          render: (text, record) => {
        
            return  text? text : '—'



          }
        },
        {
          title: '分析仪示值',
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 300,
          render: (text, record) => {
            if(record.par==='NOx'||record.par==='标杆流量' || record.par==='流速' || record.par==='颗粒物'&&record.type==='标杆浓度'){
              return '—'
            }
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='请输入' onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <Form.Item name='EntCode' style={{ marginLeft: 5 }} rules={[{ required: true, message: '请选择' }]}>
                <Select placeholder='单位列表' onBlur={()=>{isJudge(record)}}>
                </Select>
              </Form.Item>
            </Row>
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={dasChecked} onChange={onDasChange}>DAS示值</Checkbox></Row>,
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 300,
          render: (text, record) => {
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]} >
                <Input placeholder='请输入' disabled={!dasChecked} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <Form.Item name='EntCode' style={{ marginLeft: 5 }} rules={[{ required: true, message: '请选择' }]}>
                <Input placeholder='单位列表' disabled={!dasChecked} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
            </Row>
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={numChecked} onChange={onNumChange}>数采仪实时数据</Checkbox></Row>,
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 300,
          render: (text, record) => {
            if(record.par==='NO'||record.par==='NOx'){
              return '—'
            }
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='最小值' disabled={!numChecked} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <span style={{ padding: '0 2px' }}> - </span>
              <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
                <Input placeholder='最大值' disabled={!numChecked} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
              <Form.Item name='EntCode' style={{ marginLeft: 5 }} rules={[{ required: true, message: '请选择' }]}>
                <Input placeholder='单位列表' disabled={!numChecked} onBlur={()=>{isJudge(record)}}/>
              </Form.Item>
            </Row>
          }
        },
        {
          title: '量程一致性(自动判断)',
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 150,
          render: (text, record) => {
            return <Row justify='center' align='middle'>
              <Form.Item name='EntCode2' disabled>
                <Radio.Group>
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
          dataIndex: 'age',
          key: 'age',
          width: 220,
          render: (text, record, index) => {
            return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
              <Form.Item name='EntCode' name={`rangCheck${index}`}>
                <Checkbox.Group options={manualOptions} onChange={(val) => { onManualChange(val, `rangCheck${index}`, index) }} />
              </Form.Item>
            </Row>
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'age',
          key: 'age',
          width: 100,
          render: (text, record) => {
            return <Form.Item name='EntCode' rules={[{ required: false, message: '请输入' }]}>
              <Input placeholder='请输入' style={{ width: '100%' }} />
            </Form.Item>
          }
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'file',
          key: 'file',
          width: 150,
          render: (text, record, index) => {
            const obj = {
              children: <div>
                <Form.Item name='Files' >
                  <a onClick={() => { setFileVisible(true) }}>上传附件</a>
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
  const columns4 = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '检查项目',
      dataIndex: 'par',
      key: 'par',
      align: 'center',
      render: (text, record, index) => {
      return <div style={{textAlign:'left'}}>{text}</div>
      }
    },
    {
      title: '是否启用',
      align: 'center',
      dataIndex: 'isDisplay',
      key: 'isDisplay',
      render: (text, record) => {
          return  <Form.Item name='EntCode2' rules={[{ required: false, message: '请选择' }]}>
                <Checkbox />
              </Form.Item>

      }
    },
    {
      title: '设定值',
      align: 'center',
      dataIndex: 'age',
      key: 'age',
      render: (text, record) => {
        return  <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder='最小值' style={{ width: '100%' }}/>
          </Form.Item>
  
      }
    },
    {
      title: '溯源值',
      align: 'center',
      dataIndex: 'age',
      key: 'age',
      render: (text, record) => {
        return  <Form.Item name='EntCode' rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder='最小值' style={{ width: '100%' }}/>
          </Form.Item>
  
      }
    },
    {
      title: '量程一致性(自动判断)',
      align: 'center',
      dataIndex: 'age',
      key: 'age',
      width: 150,
      render: (text, record) => {
        return <Row justify='center' align='middle'>
          <Form.Item name='EntCode2'>
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
      dataIndex: 'age',
      key: 'age',
      width: 220,
      render: (text, record, index) => {
        return <Row justify='center' align='middle' style={{ marginLeft: 3 }}>
          <Form.Item name='EntCode' name={`rangCheck${index}`}>
            <Checkbox.Group options={manualOptions} onChange={(val) => { onManualChange(val, `rangCheck${index}`, index) }} />
          </Form.Item>
        </Row>
      }
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'age',
      key: 'age',
      width: 150,
      render: (text, record) => {
        return <Form.Item name='EntCode' rules={[{ required: false, message: '请输入' }]}>
          <Input placeholder='请输入' style={{ width: '100%' }} />
        </Form.Item>
      }
    },
    {
      title: '附件',
      align: 'center',
      dataIndex: 'file',
      key: 'file',
      width: 150,

      render: (text, record, index) => {
        return <div>
        <Form.Item name='Files' >
          <a style={{paddingRight:8}} onClick={() => { setFileVisible(true) }}>上传附件</a>
        </Form.Item>
      </div>;

      }
    },
    {
      title: '判断依据',
      align: 'center',
      dataIndex: 'file',
      key: 'file',
      render: (text, record, index) => {
        return <div style={{textAlign:'left'}}>{text}</div>
        }
    }
  ]

  const { addDataConsistencyData, addParconsistencyData,addRealTimeConsistencyData } = props;

  const [fileVisible, setFileVisible] = useState(false)
  return (
    <div className={styles.remoteSupervisionSty}>

      <BreadcrumbWrapper>
        <Card title={
          <Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(pageIndex, pageSize) }}
            initialValues={{
            }}
            className={styles.queryForm}
            onValuesChange={onValuesChange}
          >
            <Row >
              <Form.Item label='行政区' name='RegionCode' >
                <RegionList levelNum={2} />
              </Form.Item>
              <Form.Item label='企业' name='EntCode'>
                <EntAtmoList pollutantType={2}/>
              </Form.Item>
              <Form.Item label='监测点名称' name='DGIMN' >
                {pointLoading ?
                  <Spin size='small' />
                  :
                  <Select placeholder='请选择' allowClear>
                    {
                      pointList[0] && pointList.map(item => {
                        return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                      })
                    }
                  </Select>
                }
              </Form.Item>
            </Row>

            <Row >
              <Form.Item label='核查月份' name='month'>
                <DatePicker allowClear picker="month" />
              </Form.Item>
              <Form.Item label='核查结果' name='EquipmentName'>
                <Select placeholder='请选择' allowClear>
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
                <Button style={{ marginRight: 8 }} onClick={add}>
                  添加
            </Button>
              </Form.Item>
            </Row>
          </Form>}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            scroll={{ y: clientHeight - 500 }}
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
        title='添加'
        visible={visible}
        onOk={save}
        destroyOnClose
        onCancel={() => { setVisible(false); }}
        width='98%'
        // confirmLoading={props.addEditLoading}
        wrapClassName={styles.modalSty}
        okText='保存'
      >    <Form
        form={form2}
        name="advanced_search"
        initialValues={{
        }}
        className={styles.queryForm2}
        onValuesChange={onValuesChange2}
      >
          <Row className={styles.queryPar}>
            <Form.Item label='企业' name='EntCode' rules={[{ required: true, message: '请选择企业名称!' }]}>
              <EntAtmoList pollutantType={2}/>
            </Form.Item>
            <Form.Item label='监测点名称' name='DGIMN' style={{ padding: '0 10px' }} rules={[{ required: true, message: '请选择监测点名称!' }]}>
              {pointLoading2 ?
                <Spin size='small' />
                :
                <Select placeholder='请选择' allowClear>
                  {
                    pointList2[0] && pointList2.map(item => {
                      return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                    })
                  }
                </Select>
              }
            </Form.Item>


            <Form.Item label='核查月份' name='month' rules={[{ required: true, message: '请选择核查月份!' }]}>
              <DatePicker allowClear picker="month" />
            </Form.Item>
          </Row>


          <Tabs
            defaultActiveKey="1"
            onChange={key => {
              tabsChange(key);
            }}
            className={styles.tabSty}
          >
            <TabPane tab="数据一致性核查表" key="1">
              <SdlTable
                // loading={this.props.exceptionDataLoading}
                columns={columns2}
                dataSource={addDataConsistencyData}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
               <SdlTable
                // loading={this.props.exceptionDataLoading}
                columns={columns3}
                dataSource={addRealTimeConsistencyData}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
          <Row style={{color:'#f5222d',marginTop:10}}>
            <span style={{paddingRight:10}}>注：</span>
           <ol type="1" style={{listStyle:'auto'}}>
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
            </TabPane>
            <TabPane tab="参数一致性核查表" key="2">
              <SdlTable
                // loading={this.props.exceptionDataLoading}
                columns={columns4}
                dataSource={addParconsistencyData}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
          <Row style={{color:'#f5222d',marginTop:10}}>
            <span style={{paddingRight:10}}>注：</span>
           <ol type="1" style={{listStyle:'auto'}}>
            <li>设定值一般在DAS查阅；若现场无DAS，应在其他对应设备查阅，如数采仪；</li>
            <li>无72小时调试检测报告的，应向客户发送告知函；</li>
            <li>已上传告知函的，同一点位可不再上传相应附件；</li>
          </ol>
          </Row>
            </TabPane>
          </Tabs>
        </Form>

      </Modal>

      <Modal
        title='上传附件'
        visible={fileVisible}
        onOk={() => { setFileVisible(false) }}
        destroyOnClose={true}
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
      // width={'35%'}

      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);