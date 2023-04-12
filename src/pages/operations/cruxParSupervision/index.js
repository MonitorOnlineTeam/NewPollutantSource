/**
 * 功  能：关键参数督查
 * 创建人：jab
 * 创建时间：2023.02.05
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, IssuesCloseOutlined,AuditOutlined, DownOutlined, ProfileOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled, ToTopOutlined, } from '@ant-design/icons';
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
import CheckDetail from './CheckDetail';
import Lightbox from "react-image-lightbox-rotate";

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'cruxParSupervision'




const dvaPropsData = ({ loading, cruxParSupervision, global, common, point, autoForm }) => ({
  entLoading: common.entLoading,
  clientHeight: global.clientHeight,
  tableDatas: cruxParSupervision.tableDatas,
  tableLoading: cruxParSupervision.tableLoading || loading.effects[`${namespace}/deleteKeyParameterCheck`] || loading.effects[`${namespace}/issuedKeyParameter`] || false,
  tableTotal: cruxParSupervision.tableTotal,
  regQueryPar:cruxParSupervision.regQueryPar,
  checkDetailLoading: loading.effects[`${namespace}/getKeyParameterCheckDetailList`],
  editCheckTime:cruxParSupervision.editCheckTime,
  exportLoading:loading.effects[`${namespace}/exportKeyParameterCheckList`],
  taskTableLoading: cruxParSupervision.taskTableLoading,
  taskTableDatas: cruxParSupervision.taskTableDatas,
  taskTableTotal: cruxParSupervision.taskTableTotal,
  taskOkLoading:loading.effects[`${namespace}/retransmissionKeyParameter`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
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
    getKeyParameterCheckList: (payload) => { //获取关键参数核查列表
      dispatch({
        type: `${namespace}/getKeyParameterCheckList`,
        payload: payload,
      })
    },
    exportKeyParameterCheckList: (payload) => { //获取关键参数核查列表 导出
      dispatch({
        type: `${namespace}/exportKeyParameterCheckList`,
        payload: payload,
      })
    },
    subCheckItem: (payload,callback) => { //保存或提交关键参数核查
      dispatch({
        type: `${namespace}/subCheckItem`,
        payload: payload,
        callback: callback
      })
    },
    deleteKeyParameterCheck: (payload,callback) => { //删除关键参数核查信息
      dispatch({
        type: `${namespace}/deleteKeyParameterCheck`,
        payload: payload,
        callback: callback
      })
    },
    issuedKeyParameter: (payload,callback) => { //下发关键参数核查信息
      dispatch({
        type: `${namespace}/issuedKeyParameter`,
        payload: payload,
        callback: callback
      })
    },
    retransmissionKeyParameter: (payload,callback) => { //转发任务单
      dispatch({
        type: `${namespace}/retransmissionKeyParameter`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {

  const { match: { path } } = props;
  //是否为运维督查记录
  const isRecord = path === '/operations/cruxParSupervisionRecord' ? true : false;

  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [forwardTaskForm] = Form.useForm();

  



  const { tableDatas, tableTotal, tableLoading, exportLoading, entLoading,saveloading,regQueryPar,taskTableLoading,taskTableTotal,taskTableDatas,taskOkLoading,} = props;


  const userCookie = Cookie.get('currentUser');



  useEffect(() => {
    onFinish(pageIndex,pageSize)
  }, []);


  const columns = [
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
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
    },
    {
      title: '市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
    },
    {
      title: `企业名称`,
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维人员',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查人',
      dataIndex: 'checkUserName',
      key: 'checkUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查日期',
      dataIndex: 'checkTime',
      key: 'checkTime',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text ? moment(text).format('YYYY-MM-DD') : undefined
      }
    },
    {
      title: '核查状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '核查结果',
      dataIndex: 'checkResult',
      key: 'checkResult',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return    <span style={{ color:text === '不合格'? '#f5222d' : '#52c41a' }}>{text}</span> 
      }
    },
    {
      title: '问题数量',
      dataIndex: 'questionCount',
      key: 'questionCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '下发状态',
      dataIndex: 'issuedStatus',
      key: 'issuedStatus',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return  <span style={{ color:text === '待下发'? '#f5222d' : '#52c41a' }}>{text}</span> 
      }
    },
    {
      title: '下发时间',
      dataIndex: 'issuedTime',
      key: 'issuedTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '下发次数',
      dataIndex: 'issuedCount',
      key: 'issuedCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新人',
      dataIndex: 'updUserName',
      key: 'updUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updTime',
      key: 'updTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      ellipsis: true,
      render: (text, record) => {      
        let detail = <Tooltip title="详情">
                     <a onClick={() => {  checkDetail(record,2) }}>  <ProfileOutlined style={{ fontSize: 16 }} /></a>
                     </Tooltip>
        if (isRecord) { //远程督查记录页面
          return detail
        }
        const issuesFlag = record.checkResult&&record.checkStatus==='提交';
        return (
          <>
            <Tooltip title={"删除"} >
              <Popconfirm title="确定要删除此条信息吗？" placement="left" onConfirm={() => del(record)} okText="是" cancelText="否">
                <a><DelIcon style={{ fontSize: 16 }} /></a>
              </Popconfirm>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="核查">
              <a onClick={() => { checkDetail(record,1)  }}>
                <AuditOutlined style={{ fontSize: 16 }} />
              </a>
            </Tooltip>
           <Divider type="vertical" />
            <Tooltip placement={issuesFlag ? "top" : "left"}  title={issuesFlag ? "下发" : "只有核查并提交之后才可以下发" } >
              <Popconfirm disabled={!issuesFlag} title="确定要下发督查结果给点位的运维负责人吗？" placement="left" onConfirm={() => issues(record)} okText="是" cancelText="否">
                <a className={issuesFlag? '':'disabledSty'}><IssuesCloseOutlined style={{ fontSize: 16 }} /></a>
              </Popconfirm>
            </Tooltip>
            {/* </>} */}
            <Divider type="vertical" />
            {detail}
          </>
        )
      }

    }
  ];






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


  const onFinish = async (pageIndexs, pageSizes,par) => {  //查询
    try {
      const values = await form.validateFields();
      props.getKeyParameterCheckList(par? par: { 
        ...values,
        beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        checkBeginTime: values.time2 && moment(values.time2[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        checkEndTime: values.time2 && moment(values.time2[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        time2:undefined,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();
    props.exportKeyParameterCheckList({
      ...values,
      beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      checkBeginTime: values.time2 && moment(values.time2[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      checkEndTime: values.time2 && moment(values.time2[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
      time2:undefined,
      pageIndex: undefined,
      pageSize: undefined,
    })
  }


  const [saveLoading1, setSaveLoading1] = useState(false)
  const [saveLoading2, setSaveLoading2] = useState(false)

  const save =  (type) => {

      type == 1 ? setSaveLoading1(true) : setSaveLoading2(true);
      const data = {
        id:checkDetailId,
        checkTime:props.editCheckTime && moment(props.editCheckTime).format("YYYY-MM-DD HH:mm:ss"),
        submitStatus: type,
      }
        props.subCheckItem(data, (isSuccess) => {
          type == 1 ? setSaveLoading1(false) : setSaveLoading2(false);
          if(isSuccess){
             setCheckDetailVisible(false)
             onFinish(pageIndex,pageSize)
            }
        })
    
  }



  const searchComponents = () => {
    return  <Form
        form={form}
        name="advanced_search"
        initialValues={{
          time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day"),]
        }}
        className={styles["ant-advanced-search-form"]}
        onFinish={()=>{setPageIndex(1); onFinish(1,pageSize)}}
        onValuesChange={onValuesChange}
      >
        <Row align='middle'>
          <Form.Item label='行政区' name='regionCode' className='minWidth'>
            <RegionList noFilter levelNum={2} style={{ width: 150 }} />
          </Form.Item>
          <Spin spinning={entLoading} size='small' style={{ top: -3, left: 39 }}>
            <Form.Item label='企业' name='entCode' style={{  marginRight: 8 }}>
              <EntAtmoList noFilter style={{ width: 300 }} />
            </Form.Item>
          </Spin>
          <Spin spinning={pointLoading} size='small' style={{ top: -3, left: 44 }}>
            <Form.Item label='监测点名称' name='DGIMN' >

              <Select placeholder='请选择' showSearch optionFilterProp="children" style={{ width: 150 }}>
                {
                  pointList[0] && pointList.map(item => {
                    return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Spin>
          <Form.Item label="创建时间" name="time" style={{marginRight: 8 }}  >
            <RangePicker_
              style={{ width: 300 }}
              allowClear={false}
              // showTime={{
              //   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              // }} 
              format="YYYY-MM-DD" />
          </Form.Item>
        </Row>

        <Row style={{paddingTop:5}}>
          <Form.Item label="核查人" name="checkUser"  className='minWidth'>
            <OperationInspectoUserList type='2' style={{ width: 150 }} />
          </Form.Item>
          <Form.Item label="核查日期" name="time2"  >
            <RangePicker_
              style={{ width: 300 }}
              format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="核查结果" name="checkResult"   >
            <Select placeholder='请选择' allowClear style={{ width: 150 }}>
              <Option key={2} value={2} >合格</Option>
              <Option key={1} value={1} >不合格</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{paddingLeft:16}}>
            <Button type="primary" loading={tableLoading} style={{ marginRight:8 }} htmlType='submit'>
              查询
            </Button>
            <Button onClick={() => { form.resetFields() }}   style={{ marginRight:8 }}>
              重置
            </Button>
            <Button icon={<ExportOutlined />} style={{ marginRight:8 }} onClick={() => { exports() }} loading={exportLoading}>导出 </Button>
              {!isRecord&&<Button type="primary" onClick={()=>{forwardClick()}}>
              转发任务单
            </Button>}
          </Form.Item>

        </Row>
      </Form>
  }

  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)

  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize,{...regQueryPar,pageIndex:PageIndex,pageSize:PageSize}) //regQueryPar 防止输入查询条件 不点击查询 直接点击分页的情况
  }





  const [checkDetailVisible, setCheckDetailVisible] = useState(false)
  const [checkDetailId, setCheckDetailId] = useState(null)
  const [checkDetailType, setCheckDetailType] = useState(1)
  const [infoData,setInfoData] = useState(null)
  const checkDetail = (record,type) => { //核查 详情
    setCheckDetailId(record.id);
    setCheckDetailVisible(true)
    setCheckDetailType(type)
    setInfoData(record)
  }

  const del = (record) => { //删除
    props.deleteKeyParameterCheck({ id: record.id }, (isSuccess) => {
      setPageIndex(1)
      isSuccess&&onFinish(1, pageSize)
    })
  }

  const issues = (record) => { //下发
    props.issuedKeyParameter({ id: record.id }, () => {
      onFinish(pageIndex, pageSize)
    })
  }
  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)
  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'entCode') {
      if (!hangedValues.entCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.entCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
      })
      form.setFieldsValue({ DGIMN: undefined })
    }
  }

  /***转发任务单 */
  const taskColumns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '省',
      dataIndex: 'provinceName',
      key: 'provinceName',
      align: 'center',
    },
    {
      title: '市',
      dataIndex: 'cityName',
      key: 'cityName',
      align: 'center',
    },
    {
      title: `企业名称`,
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维人员',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '派单时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return text ? moment(text).format('YYYY-MM-DD') : undefined
      }
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      ellipsis: true,
      render: (text, record) => {      
         return  <a onClick={() => { forwardTask(record) }}>转发</a>      
      }

    }
  ];
  const searchTaskComponents = () => {
    return  <Form
        form={taskForm}
        name="advanced_search2"
        className={styles["ant-advanced-search-form"]}
        onFinish={onTaskFinish}
        onValuesChange={onTaskValuesChange}
        layout='inline'
      >
          <Spin spinning={entLoading} size='small'>
            <Form.Item label='企业' name='entCode' style={{  marginRight: 8 }}>
              <EntAtmoList noFilter style={{ width: 300 }} />
            </Form.Item>
          </Spin>
          <Spin spinning={taskPointLoading} size='small'>
            <Form.Item label='监测点名称' name='DGIMN' >

              <Select placeholder='请选择' showSearch allowClear optionFilterProp="children" style={{ width: 150 }}>
                {
                  taskPointList[0] && taskPointList.map(item => {
                    return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Spin>
          <Form.Item>
            <Button type="primary" loading={taskTableLoading} htmlType='submit'>
              查询
            </Button>
          </Form.Item>

      </Form>
  }
  const onTaskFinish = (values)=>{
      props.getKeyParameterCheckList({ 
        ...regQueryPar,
        ...values,
        pageIndex:undefined,
        pageSize:undefined,
        retransmission:1,
      })
  }
  const [taskPointList, setTaskPointList] = useState([])
  const [taskPointLoading, setTaskPointLoading] = useState(false)
  const onTaskValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'entCode') {
      if (!hangedValues.entCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setTaskPointList([])
        return;
      }
      setTaskPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.entCode }, (res) => {
        setTaskPointList(res)
        setTaskPointLoading(false)
      })
      taskForm.setFieldsValue({ DGIMN: undefined })
    }
  }
  const [forwardTaskVisible, setForwardTaskVisible] = useState(false)
 
  const forwardClick = () =>{
    setForwardTaskVisible(true);
    taskForm.resetFields(); 
    onTaskFinish();
  }

  const [forwardTaskOkVisible, setForwardTaskOkVisible] = useState(false)
  const [forwardTaskID, setForwardTaskID] = useState(false)
  const forwardTask = (record) =>{ //转发
     setForwardTaskOkVisible(true)
     setForwardTaskID(record.id)
     forwardTaskForm.resetFields()
  }
  const forwardTaskOk = () =>{ //转发提交
    const values =  forwardTaskForm.getFieldsValue();
    props.retransmissionKeyParameter({ ID: forwardTaskID,...values }, (res) => {
      setForwardTaskOkVisible(false)
    })
  }
  return (
    <div className={styles.supervisionManagerSty}>
      <BreadcrumbWrapper >
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            scroll={{ y: 'calc(100vh - 360px)' }}
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



      <Modal //核查和详情 
        visible={checkDetailVisible}
        title={checkDetailType ==1?  '核查' : '详情'}
        footer={checkDetailType==1? [
          <Button onClick={()=>{setCheckDetailVisible(false)}}>
            取消
          </Button>,
          <Button  type="primary" loading={saveLoading1 || props.checkDetailLoading}  onClick={()=>{save(1)}}>
            保存
          </Button>,
          <Button  type="primary" loading={saveLoading2 || props.checkDetailLoading}   onClick={()=>{save(2)}} >
            提交
          </Button> ,
        ] : null}
        width={'95%'}
        className={styles.fromModal}
        onCancel={() => { setCheckDetailVisible(false) }}
        destroyOnClose
      >
        <CheckDetail id={checkDetailId} type={checkDetailType} infoData={infoData}/>
      </Modal>
      <Modal //转发任务单
        visible={forwardTaskVisible}
        footer={null}
        title={searchTaskComponents()}
        wrapClassName='spreadOverModal'
        onCancel={() => { setForwardTaskVisible(false) }}
        destroyOnClose
      >
          <SdlTable
            resizable
            loading={taskTableLoading}
            bordered
            dataSource={taskTableDatas}
            columns={taskColumns}
            scroll={{ y: 'calc(100vh - 360px)' }}
            pagination={false}
          />
      </Modal>
      <Modal
        title="任务转发"
        visible={forwardTaskOkVisible}
        onOk={forwardTaskOk}
        onCancel={()=>{setForwardTaskOkVisible(false)}}
        confirmLoading={taskOkLoading}
      >
        <Form
        form={forwardTaskForm}
        name="advanced_search3"
        layout='inline'
      >
        <Form.Item label='转发人' name='OperationUser' style={{width:'100%'}}>
        <OperationInspectoUserList/>
        </Form.Item>
      </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);