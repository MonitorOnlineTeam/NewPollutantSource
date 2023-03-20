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
  tableLoading: loading.effects[`${namespace}/getOperationRecordListByDGIMN`],
  tableTotal: operationRecordList.tableTotal,
  exportLoading: loading.effects[`${namespace}/exportOperationRecordListByDGIMN`],
  taskTypeList:operationRecordList.taskTypeList,
  taskTypeLoading: loading.effects[`${namespace}/getTaskTypeList`],
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
    getTaskTypeList: (payload, callback) => { //获取工单类型
      dispatch({
        type: `${namespace}/getTaskTypeList`,
        payload: payload,
      })
    },
    getOperationRecordListByDGIMN: (payload,callback) => { //列表
      dispatch({
        type: `${namespace}/getOperationRecordListByDGIMN`,
        payload: payload,
        callback:callback
      })
    },
    exportOperationRecordListByDGIMN: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportOperationRecordListByDGIMN`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {


  const [form] = Form.useForm();


  const { DGIMN,PollutantType,tableDatas, tableTotal, tableLoading,regQueryPar, exportLoading, taskTypeLoading,taskTypeList, } = props;



  useEffect(() => {
    props.getTaskTypeList({DGIMN:DGIMN,PollutantType:PollutantType});
    onFinish(pageIndex,pageSize)
  }, [DGIMN]);


  const [ columns , setColumn] = useState([]);




 




  const onFinish = async (pageIndexs, pageSizes,par) => {  //查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();

      props.getOperationRecordListByDGIMN(par?par : {
        ...values,
        DGIMN: DGIMN,
        PollutantType: PollutantType,
        Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        time2:undefined,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      },(col)=>{
        const cols = []
        if(col&&col){
          for(let key in col){
            cols.push({
                title: col[key],
                dataIndex: key,
                key: key,
                align: 'center',
                ellipsis: true, 
            })
          }
          setColumn(cols)
        }
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
          <Form.Item label='运维内容' name='TaskType'>
          <Select placeholder='请选择' allowClear  style={{width:150}}>
            {taskTypeList.map(item=><Option key={item.ID} value={item.ID} >{item.TypeName}</Option>)} 
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