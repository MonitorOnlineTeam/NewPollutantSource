/**
 * 功  能：运维记录
 * 创建人：jab
 * 创建时间：2022.04.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, IssuesCloseOutlined, AuditOutlined, DownOutlined, ProfileOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled, ToTopOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import styles from "./style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RecordForm from '@/pages/operations/recordForm'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operationRecordList'




const dvaPropsData = ({ loading, operationRecordList, global, common, point, autoForm }) => ({
  clientHeight: global.clientHeight,
  entLoading: common.entLoading,
  tableDatas: operationRecordList.tableDatas,
  tableLoading: loading.effects[`${namespace}/getKeyParameterQuestionList`],
  tableTotal: operationRecordList.tableTotal,
  exportLoading: loading.effects[`${namespace}/exportKeyParameterQuestionList`],
  regQueryPar:operationRecordList.regQueryPar,

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
    getKeyParameterQuestionList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getKeyParameterQuestionList`,
        payload: payload,
      })
    },
    exportKeyParameterQuestionList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportKeyParameterQuestionList`,
        payload: payload,
      })
    },
    checkItemKeyParameterQuestion: (payload, callback) => { //核查整改
      dispatch({
        type: `${namespace}/checkItemKeyParameterQuestion`,
        payload: payload,
        callback: callback
      })
    },
  }
}
const Index = (props) => {

  const { match: { path } } = props;

  const [form] = Form.useForm();


  const { DGIMN,tableDatas, tableTotal, tableLoading, exportLoading, entLoading,regQueryPar, } = props;


  const userCookie = Cookie.get('currentUser');



  useEffect(() => {
    onFinish(pageIndex,pageSize)
  }, [DGIMN]);


  const columns = [
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
    },
    {
      title: '状态',
      dataIndex: 'rectificationStatus',
      key: 'rectificationStatus',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return  <span style={{ color: text=='整改待核实'? '#f5222d': text=='整改已完成'? '#52c41a' : ''}}>{text}</span> 
      }
    },
    {
      title: '整改完成时间',
      dataIndex: 'rectificationTime',
      key: 'rectificationTime',
      align: 'center',
      ellipsis: true,
    },

    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      ellipsis: true,
      render: (text, record) =><div> <a onClick={() => {detail(record)}}> 查看详情 </a> </div>
    }
  ];




 




  const onFinish = async (pageIndexs, pageSizes,par) => {  //查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();

      props.getKeyParameterQuestionList(par?par : {
        ...values,
        beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
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
    props.exportKeyParameterQuestionList({
      ...values,
      beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      checkBeginTime: values.time2 && moment(values.time2[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      checkEndTime: values.time2 && moment(values.time2[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
      time2:undefined,

    })
  }






  


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      initialValues={{
        time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day"),]
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={()=>{setPageIndex(1); onFinish(1,pageSize)}}
    >
        <Form.Item label='运维日期' name='time' >
        <RangePicker_ 
         showTime={{format:'YYYY-MM-DD HH:mm:ss',
         defaultValue: [ moment(' 00:00:00',' HH:mm:ss' ), moment( ' 23:59:59',' HH:mm:ss' )]}}
         style={{width:350}}
         />
        </Form.Item>
          <Form.Item label='运维内容' name='DGIMN'>
          <Select placeholder='请选择' allowClear  style={{width:150}}>
            <Option key={1} value={1} >巡检</Option>
            <Option key={2} value={2} >校准</Option>
            <Option key={3} value={3} >维修</Option>    
          </Select>
          </Form.Item>
        <Form.Item>
          <Button type="primary" loading={tableLoading} htmlType='submit'  style={{marginRight:8}}>
            查询
          </Button>
          <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>
            导出 
          </Button>

        </Form.Item>

    </Form>
  }


  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize,{...regQueryPar,pageIndex:PageIndex,pageSize:PageSize})
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)


  const [detailVisible, setDetailVisible] = useState(false)
  const [typeID, setTypeID] = useState(null)
  const [taskID, setTaskID] = useState(1)
  const detail = (record) => { //详情
    setTypeID(record.typeId);
    setTaskID(record.taskId)
    setDetailVisible(true)
    
  }





  return (
    <div className={styles.operationRecordListSty}>
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

      <Modal //表单详情
        visible={detailVisible}
        title={'详情'}
        wrapClassName='spreadOverModal'
        footer={null}
        width={'100%'}
        className={styles.fromModal}
        onCancel={() => { setDetailVisible(false) }}
        destroyOnClose
      >
     <RecordForm hideBreadcrumb   match={{params:{typeID: typeID,taskID:taskID}}}  />
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);