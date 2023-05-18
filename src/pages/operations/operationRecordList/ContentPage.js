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
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal';


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
  taskTypeList: operationRecordList.taskTypeList,
  taskTypeLoading: loading.effects[`${namespace}/getTaskTypeList`],
  regQueryPar: operationRecordList.regQueryPar,
  imageListVisible: common.imageListVisible,
  recordListCol: operationRecordList.recordListCol,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (namespace,payload) => {
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
    getOperationRecordListByDGIMN: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getOperationRecordListByDGIMN`,
        payload: payload,
        callback: callback
      })
    },
    exportOperationRecordListByDGIMN: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportOperationRecordListByDGIMN`,
        payload: payload,
      })
    },
    getOperationImageList: (payload, callback) => { //电子表单 图片类型
      dispatch({
        type: 'common/getOperationImageList',
        payload: payload,
        callback: callback
      })
    },

  }
}
const Index = (props) => {


  const [form] = Form.useForm();


  const { DGIMN, PollutantType, tableDatas, tableTotal, tableLoading, regQueryPar, exportLoading, taskTypeLoading, taskTypeList,recordListCol, } = props;



  useEffect(() => {
    form.resetFields();
    props.getTaskTypeList({ DGIMN: DGIMN, PollutantType: PollutantType });
    onFinish(pageIndex, pageSize)
  }, [DGIMN]);

  const column = [
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '运维日期',
      dataIndex: 'Time',
      key: 'Time',
      align: 'center',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '运维人员',
      dataIndex: 'OperationName',
      key: 'OperationName',
      align: 'center',
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '运维内容',
      dataIndex: 'OperationTypeName',
      key: 'OperationTypeName',
      align: 'center',
      ellipsis: true,
      fixed: 'left',
    },
  ]
  const [columns, setColumns] = useState([]);
  const onFinish = async (pageIndexs, pageSizes, par) => {  //查询  par参数 分页需要的参数
    
    try {
      const values = await form.validateFields();

      props.getOperationRecordListByDGIMN(par ? par : {
        ...values,
        DGIMN: DGIMN,
        PollutantType: PollutantType,
        Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      }, (col) => {
        // if (col && Object.keys(col).length) {
        //   const cols = []
        //   for (let key in col) {
        //     cols.push({
        //       title: col[key],
        //       dataIndex: key,
        //       key: key,
        //       align: 'center',
        //       ellipsis: true,
        //       render: (text, record, index) => {

        //         if (text && text != '-') {
        //           if (text instanceof Array) {
        //             let keys = ''
        //             keys = `${key}${index}`;
        //             console.log(keys, popKey, popVisible)
        //             return  <RecordFormPopover keys={keys} text={text}/>  
        //           }
        //         }
        //       }
        //     })

        //   }
          // setColumns([...column, ...cols])
        // }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();
    props.exportOperationRecordListByDGIMN({
      ...values,
      DGIMN: DGIMN,
      PollutantType: PollutantType,
      Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,

    })
  }







 const [selectDate,setSelectDate] = useState([moment(new Date()).add(-30, 'day'), moment()])

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      initialValues={{
        time: selectDate,
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { setPageIndex(1); onFinish(1, pageSize) }}
    >
      <Form.Item label='运维日期' name='time' >
        <RangePicker_
          format={'YYYY-MM-DD'}
          style={{ width: 240 }}
          onChange={(value)=>{
            setSelectDate(value)
          }}
        />
      </Form.Item>
      <Spin spinning={taskTypeLoading} size='small'>
        <Form.Item label='运维内容' name='TaskType'>
          <Select placeholder='请选择' allowClear style={{ width: 150 }}>
            {taskTypeList.map(item => <Option key={item.ID} value={item.ID} >{item.TypeName}</Option>)}
          </Select>
        </Form.Item>
      </Spin>
      <Form.Item>
        <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
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
    onFinish(PageIndex, PageSize, { ...regQueryPar, pageIndex: PageIndex, pageSize: PageSize })
  }


  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)

  const [isPop, setIsPop] = useState(1);
  const [detailVisible, setDetailVisible] = useState(false)
  const [typeID, setTypeID] = useState(null)
  const [taskID, setTaskID] = useState(1)
  const detail = (record,type) => { //详情
    setIsPop(type)
    if (record.RecordType == 1) {
      setTypeID(record.TypeID);
      setTaskID(record.TaskID)
      setDetailVisible(true)
    } else {
      // 获取详情 图片类型表单
      props.getOperationImageList({ FormMainID: record.FormMainID })
    }
  }
  const [popVisible, setPopVisible] = useState(false);
  const [popKey, setPopKey] = useState(-1);

  const  RecordFormPopover = (props) =>{
    const dataSource = props.dataSource,keys = props.keys;
    return <div> {dataSource.length && dataSource.length > 1 ? <Popover
      zIndex={1000}
      trigger="click"
      onVisibleChange={(newVisible) => { setPopVisible(newVisible); }}
      visible={keys == popKey && popVisible}
      overlayClassName={styles.detailPopSty}
      content={
        <Table
          bordered
          showHeader={false}
          size='small'
          columns={[
            {
              align: 'center',
              width: 50,
              render: (text, record, index) => index + 1
            },
            {
              align: 'center',
              width: 100,
              render: (text, record, index) => <a onClick={() => { detail(record,1) }}>查看详情</a>
            }
          ]}
          dataSource={dataSource} pagination={false} />
      }>
      <a onClick={() => { setPopKey(keys) }}>查看详情</a>
    </Popover> :
      <a onClick={() => { setPopKey(keys); detail(dataSource[0],2) }}>查看详情</a>
    }</div>
  }
 const getCol = () =>{
   const col = []
  if (recordListCol && Object.keys(recordListCol).length) {
    for (let key in recordListCol) {
      const dataIndexKey =  key&&key.replaceAll('_','');
      col.push({
        title: recordListCol[key],
        dataIndex: dataIndexKey,
        key: dataIndexKey,
        align: 'center',
        ellipsis: true,
        width:recordListCol[key]&&recordListCol[key].length&&recordListCol[key].length>5 ? recordListCol[key].length*16 : 100,
        render: (text, record, index) => {
          if (text && text != '-') {
            if (text instanceof Array) {
              let keys = ''
              keys = `${key}${index}`;   
              return  <RecordFormPopover keys={keys} dataSource={text}/>  
            }
          }
        }
      })

    }
  }
  setColumns([...column, ...col])
 }
 useEffect(()=>{
  getCol()
 },[recordListCol,popVisible,popKey])

  return (
    <div className={styles.operationRecordListSty}>
      <Card title={searchComponents()}>
        <SdlTable
          resizable
          loading={tableLoading}
          bordered
          dataSource={tableDatas}
          columns={columns}
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
        onCancel={() => { setDetailVisible(false);isPop==1? setPopVisible(true) : setPopKey(-1) }}
        destroyOnClose
      >
        <RecordForm hideBreadcrumb match={{ params: { typeID: typeID, taskID: taskID } }} />
      </Modal>
        {props.imageListVisible&&<ViewImagesModal  onCloseRequest={()=>{
                  props.updateState('common',{ imageListVisible: false})
                  isPop==1&&setPopVisible(true)
        }}/>}
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);