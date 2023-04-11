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
  exportLoading2: operationRecordnalysis.exportLoading2,
  recordAnalyListQueryPar: operationRecordnalysis.recordAnalyListQueryPar,
  accountTableDatas: operationRecordnalysis.accountTableDatas,
  accountTableTotal: operationRecordnalysis.accountTableTotal,
  accountTableLoading: loading.effects[`${namespace}/getOperationRecordAnalyInfoList`],
  accountExportLoading: loading.effects[`${namespace}/exportOperationRecordAnalyInfoList`],
  accountDetailQueryPar: operationRecordnalysis.accountDetailQueryPar,
  accountDetailCol:operationRecordnalysis.accountDetailCol,
  imageListVisible: common.imageListVisible,
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
    getOperationRecordAnalyList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getOperationRecordAnalyList`,
        payload: payload,
        callback: callback
      })
    },
    getOperationRecordAnalyInfoList: (payload) => { //列表 详情台账
      dispatch({
        type: `${namespace}/getOperationRecordAnalyInfoList`,
        payload: payload,
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


  const { taskTypeLoading, taskTypeList, tableDatas, tableTotal, tableLoading, exportLoading, tableDatas2, tableTotal2, tableLoading2, exportLoading2, recordAnalyListQueryPar, accountTableDatas, accountTableTotal, accountTableLoading, accountDetailQueryPar, accountDetailCol,accountExportLoading, } = props;



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
      fixed:'left',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      fixed:'left',
      width:120,
      ellipsis: true,
      render: (text, record, index) => {
       return text == '合计' ? <span style={{color:'rgba(0, 0, 0, 0.85)'}}>{text}</span> :  <a onClick={() => regDetail(record)}>{text}</a>
      }
    },
    {
      title: '运维企业数',
      dataIndex: 'EntCount',
      key: 'EntCount',
      align: 'center',
      fixed:'left',
      width:100,
      ellipsis: true,
    },
    {
      title: '运维监测点数',
      dataIndex: 'PointCount',
      key: 'PointCount',
      align: 'center',
      fixed:'left',
      width:100,
      ellipsis: true,
    },
  ];
  const [columns, setColumns] = useState([]);
  const getChildren = (children, key, firstTitle, par, ) => {
    if (Array.isArray(children)) {
      children.splice(0, 1)
      return children.map((item, childrenIndex) => {
        return {
          title: item,
          dataIndex: key,
          key: key,
          align: 'center',
          ellipsis: true,
          width:children&&children.length>=2&&item&&item.length>5? item.length * 16 :  firstTitle&&firstTitle.length&&firstTitle.length>5? firstTitle.length * 16 :  100,
          render: (text, record, index) => {
            if(text){
            const textArr = text.split(',');
            return item === '上传台账数' ? <a onClick={() => accountDetail(record, textArr[textArr.length - 1], firstTitle, par)}>{textArr[childrenIndex]}</a> : textArr[childrenIndex];
            }
          }
        }
      })

    } else {
      return []
    }
  }
  const [regDetailVisible, setRegDetailVisible] = useState(false)
  const [regDetailTitle, setRegDetailTitle] = useState()
  const [regionCode, setRegionCode] = useState()

  const regDetail = (row) => {
    const values = form.getFieldsValue();
    setRegDetailVisible(true)
    setRegDetailTitle(`${row.ProvinceName}-统计${values.time && moment(values.time[0]).format('YYYY-MM-DD')}~${values.time && moment(values.time[1]).format('YYYY-MM-DD')}内运维记录`)
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
        content:undefined,
        RegionCode: regionCode ? regionCode : undefined
      }, (col, par) => {
        if (col && Object.keys(col).length) {
          const cols = []
          for (let key in col) {
            let titleArr = col[key] && col[key].split(',')
            const dataIndexKey =  key&&key.replaceAll('_','');
            cols.push({
              title: titleArr && titleArr[0],
              dataIndex: 'x',
              align: 'center',
              ellipsis: true,
              children: getChildren(titleArr, dataIndexKey, titleArr[0], par),
            })
          }
          regionCode ? setColumns2([...column2, ...cols]) : setColumns([...column, ...cols])
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
      RegionCode: isRegDetail ? regionCode : undefined,
      content:undefined,
      time: undefined,
    })
  }


  const pollutantTypeChange = (value) => {
    props.getTaskTypeList({ type: 1, PollutantType: value });
    form.setFieldsValue({ content: undefined,TaskType:undefined,type:undefined })
  }
  const onTaskTypeChange = (value,option) =>{
    form.setFieldsValue({ TaskType:option&&option.taskType })
    form.setFieldsValue({ type: option&&option.type })

  }
  const searchComponents = (isRegDetail) => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      initialValues={{
        time: [moment(new Date()).add(-7, 'day'), moment().add(-1, 'day')],
        PollutantType: 2,
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { onFinish() }}
    >
      {!isRegDetail && <><Form.Item label='运维日期' name='time' >
        <RangePicker_
          format='YYYY-MM-DD'
          style={{ width: 240 }}
        />
      </Form.Item>
        <Form.Item label='监测点类型' name='PollutantType'>
          <Select placeholder='请选择'  onChange={pollutantTypeChange} style={{ width: 150 }}>
            <Option key={2} value={2} >废气</Option>
            <Option key={1} value={1} >废水</Option>
          </Select>
        </Form.Item>
        <Spin spinning={taskTypeLoading} size='small'>
          <Form.Item label='运维内容' name='content'>
            <Select placeholder='请选择' allowClear style={{ width: 150 }}  onChange={onTaskTypeChange}>
              {taskTypeList.map(item => <Option key={item.TypeName} value={item.TypeName} taskType={item.ID} type={item.ChildRecordTypeCodes}>{item.TypeName}</Option>)}
            </Select>
          </Form.Item>
        </Spin></>}
        <Form.Item name='TaskType' hidden></Form.Item>
        <Form.Item name='type' hidden></Form.Item>
      <Form.Item>
        {!isRegDetail && <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>}
        <Button icon={<ExportOutlined />} onClick={() => { exports(isRegDetail) }} loading={isRegDetail?exportLoading2:exportLoading}>
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
      fixed:'left',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      fixed:'left',
      width:120,
      ellipsis: true,
      render: (text, record, index) => {
        if (text == '合计') {
          return { children: text, props: { colSpan: 2 }, };
        } else {
          return text
        }
      }
    },

    {
      title: '市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
      fixed:'left',
      ellipsis: true,
      render: (text, record, index) => {
        if (record.ProvinceName == '合计') {
          return { children: '', props: { colSpan: 0 }, };
        } else {
          return text
        }
      }
    },
    {
      title: '运维企业数',
      dataIndex: 'EntCount',
      key: 'EntCount',
      align: 'center',
      fixed:'left',
      width:100,
      ellipsis: true,
    },
    {
      title: '运维监测点数',
      dataIndex: 'PointCount',
      key: 'PointCount',
      align: 'center',
      fixed:'left',
      width:100,
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
      fixed:'left',
      ellipsis: true,
    },

    {
      title: '市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
      fixed:'left',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      fixed:'left',
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      fixed:'left',
      ellipsis: true,
    },
    {
      title: '运维负责人',
      dataIndex: 'OprationName',
      key: 'OprationName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '运维负责人工号',
      dataIndex: 'OprationAccount',
      key: 'OprationAccount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '上传台账数',
      dataIndex: 'RecordNum',
      key: 'RecordNum',
      align: 'center',
      ellipsis: true,
    },
  ];
  const [accountColumns, setAccountColumns] = useState([]);
  const [accountVisible, setAccountVisible] = useState(false);
  const [accountTitle, setAccountTitle] = useState('');
  const [accountTypeName, setAccountTypeName] = useState('');

  const accountDetail = (record, id, title, par) => {
    setAccountVisible(true)
    setAccountTitle(`${record.ProvinceName}-统计${par.Btime&&moment(par.Btime).format('YYYY-MM-DD')}~${par.Etime&&moment(par.Etime).format('YYYY-MM-DD')}内${title}台账上传情况`)
    setAccountTypeName(`${title}台账分布`)
    setAccountPageIndex(1)
    setAccountPageSize(20)
    accountForm.resetFields()
    accountFinish(1, 20, {
      ...par,
      RegionCode:undefined,
      ProvinceCode:record.CityName=='合计'? par.RegionCode : record.ProvinceCode,
      CityCode: record.CityCode,
      RecordType: id,
      RecordName: title,
      pageIndex: 1,
      pageSize:20,
      // pageSize: accountDetailQueryPar.pageSize,
    })
    props.updateState(namespace,{
      recordAnalyListQueryPar: {
        ...par,
        RegionCode:undefined,
        ProvinceCode:record.CityName=='合计'? par.RegionCode : record.ProvinceCode, CityCode: record.CityCode , RecordType: id, RecordName: title,
      }
    })
  }
  const [isPop, setIsPop] = useState(1);
  const [recordFormDetailVisible, setRecordFormDetailVisible] = useState(false)
  const [typeID, setTypeID] = useState(null)
  const [taskID, setTaskID] = useState(1)
  const recordFormDetail = (record,type) => { //详情
    setIsPop(type)
    if (record.RecordType == 1) {
      setTypeID(record.TypeID);
      setTaskID(record.TaskID)
      setRecordFormDetailVisible(true)
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
      placement="top"
      onVisibleChange={(newVisible) => { setPopVisible(newVisible); }}
      visible={keys == popKey && popVisible}
      // overlayClassName={styles.detailPopSty}
      // getPopupContainer={trigger => trigger.parentNode}
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
              render: (text, record, index) => <a onClick={() => { recordFormDetail(record,1) }}>查看</a>
            }
          ]}
          dataSource={dataSource} pagination={false} />
      }>
        <Row onClick={() => { setPopKey(keys) }} align='middle' justify='center' style={{ background: '#bae7ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, }}>
         <a>查看</a>
        </Row>
    </Popover> :
     <Row onClick={() => { setPopKey(keys); recordFormDetail(dataSource[0],2) }} align='middle' justify='center' style={{ background: '#bae7ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
       <a>查看</a>
      </Row>
    }</div>
  }
  const getAccountColumns = () => { //台账分布
    const col = [];
    if (accountDetailCol && accountDetailCol[0]) {
      col.push({
        title: accountTypeName,
        width: 200,
        align: 'center',
        children: accountDetailCol.map((item, index) => {
          return {
            title: `${item.date.split('_')[0]}`,
            width: 70,
            align: 'center',
            ellipsis: false,
            children: [{
              title: `${item.date.split('_')[1]}`,
              dataIndex: `${item.date.split('_')[1]}`,
              key: `${item.date.split('_')[1]}`,
              width: 70,
              align: 'center',
              ellipsis: false,
              render: (text, row, index) => {
                let workNumEle, taskWorkNum1, taskWorkNum2, taskTypeName;
                return row.datePick.map(dateItem => {
                  if (dateItem.IsOpertaion && dateItem.data && dateItem.data[0] && dateItem.date == item.date) { //运营周期内有电子表单
                    let keys = ''
                    keys = `${row.PointName}${item.date}${index}`;  
                    return <RecordFormPopover dataSource={dateItem.data} keys={keys}/>
                  }

                  if (dateItem.IsOpertaion && dateItem.date == item.date) { //运营周期内
                    return <Row align='middle' justify='center' style={{ background: '#bae7ff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></Row>

                  } else if (!dateItem.IsOpertaion && dateItem.date == item.date) {
                    return <Row align='middle' justify='center' style={{ background: '#fff', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}> </Row>
                  }
                })


              }
            }]
          }
        })
      })
    }
    setAccountColumns([...accountColumn, ...col])
  }
  useEffect(()=>{
      getAccountColumns()
   },[accountDetailCol,popVisible,popKey,accountDetailQueryPar])
  const accountFinish = async (pageIndexs, pageSizes, par) => {  //台账详情查询  par参数 分页需要的参数
    try {
      const values = await accountForm.validateFields();
      props.getOperationRecordAnalyInfoList(par ? {...par,...values}: {
        ...recordAnalyListQueryPar,
        ...values,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
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
        <Input placeholder='请输入企业名称' allowClear/>
      </Form.Item>
      <Form.Item name='PointName' >
        <Input placeholder='请输入监测点名称' allowClear/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={accountTableLoading} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>
        <Button icon={<ExportOutlined />} onClick={() => { accountExport() }} loading={accountExportLoading}>
          导出
          </Button>
      </Form.Item>
      <Form.Item style={{position:'absolute',right:8}}>
            <Row align='middle'>
             <div style={{ display: 'inline-block', background: '#bae7ff', width: 24, height: 12, marginRight: 5 }}></div>
             <span>运营周期内</span>
            </Row>
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
      ...recordAnalyListQueryPar,
      ...values,
    })
  }




  return (
    <div className={styles.operationRecordnalysisSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
            className={styles.operationRecordRegTableSty}
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
              loading={tableLoading2}
              bordered
              dataSource={tableDatas2}
              columns={columns2}
              pagination={false}
            />
          </Card>
        </Modal>
        <Modal //台账详情
          visible={accountVisible}
          title={accountTitle}
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
              columns={accountColumns}
              scroll={{ y: 'calc(100vh - 420px)' }}
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
          visible={recordFormDetailVisible}
          title={'详情'}
          wrapClassName='spreadOverModal'
          footer={null}
          width={'100%'}
          onCancel={() => { setRecordFormDetailVisible(false); isPop==1&&setPopVisible(true) }}
          destroyOnClose
        >
          <RecordForm hideBreadcrumb match={{ params: { typeID: typeID, taskID: taskID } }} />
        </Modal>
        {props.imageListVisible&&<ViewImagesModal  onCloseRequest={()=>{
                  props.updateState('common',{ imageListVisible: false})
                  isPop==1&&setPopVisible(true)
        }}/>}
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);