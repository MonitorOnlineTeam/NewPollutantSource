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
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import styles from "./style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RecordForm from '@/pages/operations/recordForm'
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operationRecordnalysis'




const dvaPropsData = ({ loading, operationRecordnalysis, global, common, point, autoForm }) => ({
  clientHeight: global.clientHeight,
  taskTypeList: operationRecordnalysis.taskTypeList,
  taskTypeLoading: loading.effects[`${namespace}/getTaskTypeList`],
  tableDatas: operationRecordnalysis.tableDatas,
  tableLoading: operationRecordnalysis.tableLoading,
  tableTotal: operationRecordnalysis.tableTotal,
  exportLoading: operationRecordnalysis.exportLoading,
  tableDatas2: operationRecordnalysis.tableDatas2,
  tableLoading2: operationRecordnalysis.tableLoading2,
  tableTotal2: operationRecordnalysis.tableTotal2,
  exportLoading2:  operationRecordnalysis.exportLoading2,
  recordAnalyListQueryPar:operationRecordnalysis.recordAnalyListQueryPar,
  accountTableDatas:operationRecordnalysis.accountTableDatas,
  accountTableTotal:operationRecordnalysis.accountTableTotal,
  accountTableLoading: loading.effects[`${namespace}/getOperationRecordAnalyInfoList`],
  accountExportLoading: loading.effects[`${namespace}/exportOperationRecordAnalyInfoList`],
  accountDetailQueryPar: operationRecordnalysis.accountDetailQueryPar,
  imageListVisible: common.imageListVisible,
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
    getOperationRecordAnalyList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getOperationRecordAnalyList`,
        payload: payload,
        callback: callback
      })
    },
    getOperationRecordAnalyInfoList: (payload, callback) => { //列表 详情台账
      dispatch({
        type: `${namespace}/getOperationRecordAnalyInfoList`,
        payload: payload,
        callback: callback
      })
    },
    exportOperationRecordAnalyList: (payload) => { //列表导出
      dispatch({
        type: `${namespace}/exportOperationRecordAnalyList`,
        payload: payload,
      })
    },
    exportOperationRecordAnalyInfoList: (payload) => { //列表详情台账 导出
      dispatch({
        type: `${namespace}/exportOperationRecordAnalyInfoList`,
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
  const [accountForm] = Form.useForm();


  const { taskTypeLoading, taskTypeList, tableDatas, tableTotal, tableLoading, exportLoading, tableDatas2, tableTotal2, tableLoading2, exportLoading2,recordAnalyListQueryPar,accountTableDatas,accountTableTotal,accountTableLoading, accountDetailQueryPar, accountExportLoading,} = props;



  useEffect(() => {
    pollutantTypeChange(2)
    onFinish()
  }, []);

  const column = [
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      ellipsis: true,
      render:(text,record,index)=>{
        if (text == '合计') {
          return { children: text, props: { colSpan: 2 }, };
       }else{
          return <a onClick={()=>regDetail(record)}>{text}</a>
       }
      }
    },
    
    {
      title: '市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维企业数',
      dataIndex: 'EntCount',
      key: 'EntCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维监测点数',
      dataIndex: 'PointCount',
      key: 'PointCount',
      align: 'center',
      ellipsis: true,
    },
  ];
  const [columns, setColumns] = useState([]);
  const getChildren = (children, key,firstTitle) => {
    if (Array.isArray(children)) {
      children.splice(0, 1)
      return children.map((item,childrenIndex) => {
        return {
          title: item,
          dataIndex: key,
          key: key,
          align: 'center',
          ellipsis: true,
          width:100,
          render: (text, record, index) => {
            const textArr = text.split(',');
            return item==='上传台账数'?<a onClick={()=>accountDetail(record,textArr[textArr.length-1],firstTitle)}>{textArr[childrenIndex]}</a> : textArr[childrenIndex];
          }
        }
      })
  
    } else {
      return []
    }
  }
  const [regDetailVisible,setRegDetailVisible] = useState(false)
  const [regDetailTitle,setRegDetailTitle] = useState()
  const [regionCode,setRegionCode] = useState()

  const regDetail = (row) =>{
    const values =  form.getFieldsValue();
    setRegDetailVisible(true)
    setRegDetailTitle( `${row.ProvinceName}-统计${values.time && moment(values.time[0]).format('YYYY-MM-DD')}~${values.time && moment(values.time[1]).format('YYYY-MM-DD')}内运维记录`)
    setRegionCode(row.ProvinceCode)
    onFinish(row.ProvinceCode)
  }
  const onFinish = async (regionCode) => {  //查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();
      props.getOperationRecordAnalyList({
        ...values,
        Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        RegionCode:regionCode ?  regionCode : undefined
      }, (col) => {

        if (col && Object.keys(col).length) {
          const cols = []
          for (let key in col) {
            let titleArr = col[key] && col[key].split(',')
            cols.push({
              title: titleArr && titleArr[0],
              dataIndex: 'x',
              align: 'center',
              ellipsis: true,
              children: getChildren(titleArr, key,titleArr[0]),
            })
          }
          regionCode? setColumns2([...column2, ...cols]) : setColumns([...column, ...cols])
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async (isRegDetail) => { //导出
    const values = await form.validateFields();
    props.exportOperationRecordAnalyList({
      ...values,
      Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      RegionCode:isRegDetail? regionCode : undefined,
      time: undefined,
    })
  }


  const pollutantTypeChange = (value) => {
    props.getTaskTypeList({ type: 1, PollutantType: value });
    form.setFieldsValue({ taskType: undefined })
  }
  const searchComponents = (isRegDetail) => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      initialValues={{
        time: [moment(new Date()).add(-30, 'day'), moment().endOf("day")],
        PollutantType: 2,
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { onFinish() }}
    >
      {!isRegDetail&&<><Form.Item label='运维日期' name='time' >
        <RangePicker_
          format='YYYY-MM-DD'
          style={{ width: 240 }}
        />
      </Form.Item>
      <Form.Item label='监测点类型' name='PollutantType'>
        <Select placeholder='请选择' allowClear onChange={pollutantTypeChange} style={{ width: 150 }}>
          <Option key={2} value={2} >废气</Option>
          <Option key={1} value={1} >废水</Option>
        </Select>
      </Form.Item>
      <Spin spinning={taskTypeLoading} size='small'>
        <Form.Item label='运维内容' name='TaskType'>
          <Select placeholder='请选择' allowClear style={{ width: 150 }}>
            {taskTypeList.map(item => <Option key={item.ID} value={item.ID} >{item.TypeName}</Option>)}
          </Select>
        </Form.Item>
      </Spin></>}
      <Form.Item>
       {!isRegDetail&&<Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>}
        <Button icon={<ExportOutlined />} onClick={() => { exports(isRegDetail) }} loading={exportLoading}>
          导出
          </Button>

      </Form.Item>

    </Form>
  }
  


  //省级详情
  const column2 = [
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      ellipsis: true,
      render:(text,record,index)=>{
        if (text == '合计') {
          return { children: text, props: { colSpan: 2 }, };
       }else{
          return text
       }
      }
    },
    
    {
      title: '市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维企业数',
      dataIndex: 'EntCount',
      key: 'EntCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维监测点数',
      dataIndex: 'PointCount',
      key: 'PointCount',
      align: 'center',
      ellipsis: true,
    },
  ];
  const [columns2, setColumns2] = useState([]);


    //运维台账详情
    const accountColumn = [
      {
        title: '省',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        align: 'center',
        ellipsis: true,
      },
      
      {
        title: '市',
        dataIndex: 'CityName',
        key: 'CityName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '企业名称',
        dataIndex: 'EntName',
        key: 'EntName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '监测点名称',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '运维负责人',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '运维负责人工号',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '上传台账数',
        dataIndex: 'PointName',
        key: 'PointName',
        align: 'center',
        ellipsis: true,
      },
    ];
  const [open, setOpen] = useState(false);
  const [accountColumns, setAccountColumns] = useState([]);
  const [accountVisible, setAccountVisible] = useState(false);
  const [accountTitle, setAccountTitle] = useState('');
  const [accountTypeName, setAccountTypeName] = useState('');

  const accountDetail = (record,id,title) =>{
    const values = form.getFieldsValue();
    setAccountVisible(true)
    setRegDetailTitle(`${record.ProvinceName}-统计${values.time && moment(values.time[0]).format('YYYY-MM-DD')}~${values.time && moment(values.time[1]).format('YYYY-MM-DD')}内${title}台账上传情况`)
    setAccountTypeName(title)
    setAccountPageIndex(1)
    accountFinish(1,accountPageSize,{
      ...recordAnalyListQueryPar,
      ProvinceCode: record.ProvinceCode&&record.ProvinceCode,
      CityCode: record.CityCode&&record.CityCode,
      RecordType:id,
      RecordName:title,
      pageIndex: 1,
      pageSize: accountPageSize,
    })
    props.updateState({
      recordAnalyListQueryPar:{
      ...recordAnalyListQueryPar,
      ProvinceCode: record.ProvinceCode,CityCode: record.CityCode,RecordType:id,RecordName:title,
      }
    })
   }
  const accountFinish = async (pageIndexs, pageSizes, par) => {  //台账详情查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();

      props.getOperationRecordAnalyInfoList(par ? par : {
        ...recordAnalyListQueryPar,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
      }, (col) => {
        if (col && Object.keys(col).length) {
          const cols = []
          for (let key in col) {
            cols.push({
              title: col[key],
              dataIndex: key,
              key: key,
              align: 'center',
              ellipsis: true,
              render: (text, record, index) => {
                if (text && text != '-') {
                  if (text instanceof Array) {
                    return <Popover
                      zIndex={800}
                      onOpenChange={(newOpen) => { setOpen(newOpen) }}
                      trigger="click"
                      open={open}
                      overlayClassName={styles.detailPopSty}
                      content={
                        <Table
                          bordered
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
                              render: (text, record, index) => <a onClick={() => { recordFormDetail(record) }}>查看详情</a>
                            }
                          ]}
                          dataSource={text} pagination={false} />
                      }>
                      <a>查看详情</a>
                    </Popover>
                  } else {
                    return text; //运维人员 运维内容 序号 运维日期 或工单类型为-
                  }
                }
              }
            })
          }
          setColumns([...column, ...cols])
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const accountSearchComponents = () => {
    return <Form
      form={accountForm}
      name="advanced_search"
      layout='inline'
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { setAccountPageIndex(1); accountFinish(1, accountPageSize) }}
    >
      <Form.Item name='EntName' >
        <Input placeholder='请输入企业名称' />
      </Form.Item>
      <Form.Item name='PointName' >
        <Input placeholder='请输入监测点名称' />
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>
        <Button icon={<ExportOutlined />} onClick={() => { accountExport() }} loading={accountExportLoading}>
          导出
          </Button>
      </Form.Item>

    </Form>
  }

  const [accountPageSize, setAccountPageSize] = useState(20)
  const [accountPageIndex, setAccountPageIndex] = useState(1)
  const handleTableChange2 = (PageIndex, PageSize) => {
    setAccountPageIndex(PageIndex)
    setAccountPageSize(PageSize)
    accountFinish(PageIndex, PageSize, { ...accountDetailQueryPar, pageIndex: PageIndex, pageSize: PageSize })
  }
  const accountExport = async () => { //详情导出 
    const values = await accountForm.validateFields();
    props.exportOperationRecordAnalyInfoList({
      ...values,
      Btime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      Etime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
    })
  }



  //表单
  const [detailVisible, setDetailVisible] = useState(false)
  const [typeID, setTypeID] = useState(null)
  const [taskID, setTaskID] = useState(1)
  const recordFormDetail = (record) => { //详情
    if (record.RecordType == 1) {
      setTypeID(record.TypeID);
      setTaskID(record.TaskID)
      setDetailVisible(true)
    } else {
      // 获取详情 图片类型表单
      props.getOperationImageList({ FormMainID: record.FormMainID })
    }
  }
  return (
    <div className={styles.operationRecordnalysisSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
          />
        </Card>
        <Modal //省级详情
          visible={regDetailVisible}
          title={regDetailTitle}
          wrapClassName='spreadOverModal'
          footer={null}
          width={'100%'}
          onCancel={() => { setRegDetailVisible(false) }}
          destroyOnClose
        >
          <Card title={searchComponents('regDetail')}>
            <SdlTable
              resizable
              loading={tableLoading2}
              bordered
              dataSource={tableDatas2}
              columns={columns2}
              scroll={{ y: 'calc(100vh - 360px)' }}
              pagination={false}
            />
          </Card>
        </Modal>
        <Modal //台账详情
          visible={accountVisible}
          title={`${accountTitle}台账上传情况`}
          wrapClassName='spreadOverModal'
          footer={null}
          width={'100%'}
          onCancel={() => { setAccountVisible(false) }}
          destroyOnClose
        >
          <Card title={accountSearchComponents()}>
            <SdlTable
              resizable
              loading={accountTableLoading}
              bordered
              dataSource={accountTableDatas}
              columns={columns2}
              scroll={{ y: 'calc(100vh - 360px)' }}
              pagination={{
                total: accountTableTotal,
                pageSize: accountPageSize,
                current: accountPageIndex,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: handleTableChange2,
              }}
            />
          </Card>
        </Modal>
        <Modal //表单详情
          visible={detailVisible}
          title={'详情'}
          wrapClassName='spreadOverModal'
          footer={null}
          width={'100%'}
          onCancel={() => { setDetailVisible(false) }}
          destroyOnClose
        >
          <RecordForm hideBreadcrumb match={{ params: { typeID: typeID, taskID: taskID } }} />
        </Modal>
        {props.imageListVisible && <ViewImagesModal />}
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);