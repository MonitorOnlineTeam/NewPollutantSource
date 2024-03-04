/**
 * 功  能：项目执行进度/项目执行 派单查询
 * 创建人：jab
 * 创建时间：2023.08.29
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Progress, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "./style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';

const { Option } = Select;

const namespace = 'dispatchCompletionRate'

const dvaPropsData = ({ loading, dispatchCompletionRate, global, }) => ({
  configInfo: global.configInfo,
  tableLoading: dispatchCompletionRate.tableLoading,
  tableDatas: dispatchCompletionRate.tableDatas,
  tableTotal: dispatchCompletionRate.tableTotal,
  queryPar: dispatchCompletionRate.queryPar,
  incompleteLoading:dispatchCompletionRate.incompleteLoading,
  incompleteData: dispatchCompletionRate.incompleteData,
  incompleteTotal: dispatchCompletionRate.incompleteTotal,
  exportLoading:  dispatchCompletionRate.exportLoading,
  exportIncompleteLoading:dispatchCompletionRate.exportIncompleteLoading,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetCTServiceDispatchRateList: (payload,callback) => { //列表
      dispatch({
        type: `${namespace}/GetCTServiceDispatchRateList`,
        payload: payload,
        callback:callback,
      })
    },
    ExportCTServiceDispatchRateList: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportCTServiceDispatchRateList`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();




  const { tableDatas, tableTotal, tableLoading, queryPar,incompleteLoading,incompleteData,incompleteTotal,exportLoading, exportIncompleteLoading,} = props;



  useEffect(() => {
    onFinish(pageIndex, pageSize);

  }, []);

  let columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      width:60,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '项目所在省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '派单总数量',
      dataIndex: 'allCount',
      key: 'allCount',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '应完成数量',
      dataIndex: 'yingwcCount',
      key: 'yingwcCount',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '已完成数量',
      dataIndex: 'yiwcCount',
      key: 'yiwcCount',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '未完成数量',
      dataIndex: 'weiwcCount',
      key: 'weiwcCount',
      align: 'center',
      width:'auto',
      ellipsis: true,
      render: (text, record) => {
        return ( <a  onClick={() => {  incompleteNum(record) }}>{text}</a>
        );

      }
    },
    {
      title: '完成率',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      width:'auto',
      ellipsis: true,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text=='-'? 0 : text}
              size="small"
              style={{width:'85%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
            />
          </div>
        );
      }
    },
  ];
  let incompletecolumns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '派工单号',
      dataIndex: 'Num',
      key: 'Num',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '项目所在省',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },

    {
      title: '服务工程师',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '下单日期',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: 'CIS流程状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      align: 'center',
      width:'auto',
      ellipsis: true,
    },
    {
      title: '任务状态',
      dataIndex: 'TaskStatusName',
      key: 'TaskStatusName',
      align: 'center',
      width:'auto',
      ellipsis: true,
    }
  ];

  const exports =  (pointType) => {
    props.ExportCTServiceDispatchRateList({
      ...queryPar,
      Province:regionCode,
      pointType:pointType
    })
  };


  const onFinish = async () => {  //查询

    try {
      const values = await form.validateFields();
      props.GetCTServiceDispatchRateList({
        ...values,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pointType:1,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }


  const [incompleteVisible, setIncompleteVisible] = useState(false)
  const [incompleteTitle, setIncompleteTitle] = useState('详情')
  const [regionCode, setRegionCode] = useState()

  const incompleteNum = (record) => {
    setIncompleteVisible(true)
    setIncompleteTitle(`${record.ProvinceName}（${queryPar.beginTime&&moment(queryPar.beginTime).format('YYYY-MM-DD')} ~ ${queryPar.endTime&&moment(queryPar.endTime).format('YYYY-MM-DD')}）`)
    setRegionCode(record.ProvinceCode)
    setPageIndex(1)
    setPageSize(20)
    getCTServiceDispatchRateListRequest(1,20,record.ProvinceCode);
  }
  const getCTServiceDispatchRateListRequest = (pageIndex,pageSize,regionCode)=>{
    props.GetCTServiceDispatchRateList({
      ...queryPar,
     Province:regionCode,
     pointType:2,
     pageIndex:pageIndex,
     pageSize:pageSize,
   })
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    getCTServiceDispatchRateListRequest(PageIndex,PageSize,regionCode);
  }


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => {  onFinish() }}
      layout='inline'
      initialValues={{
        time: [moment(new Date()).add(-6, 'month').startOf('month'), moment(new Date()).endOf('month')]
      }}
    >

      <Form.Item name='time' label='下单日期' >
        <RangePicker_ style={{ width: '100%' }}
         allowClear={false}
          showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
         </Button>
        <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
          重置
         </Button>
        <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports(1) }}>
          导出
         </Button>
      </Form.Item>
    </Form>
  }
  return (
    <div className={styles.dispatchCompletionRateSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            scroll={{x:860}}
            pagination={false}
          />
        </Card>
        <Modal
          visible={incompleteVisible}
          title={incompleteTitle}
          onCancel={() => { setIncompleteVisible(false) }}
          footer={null}
          destroyOnClose
          wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
        >
        <Button icon={<ExportOutlined />} style={{marginBottom:8}} loading={exportIncompleteLoading} onClick={() => { exports(2) }}>
          导出
         </Button>
          <SdlTable
            resizable
            loading={incompleteLoading}
            bordered
            scroll={{x:960}}
            dataSource={incompleteData}
            columns={incompletecolumns}
            pagination={{
              total: incompleteTotal,
              pageSize: pageSize,
              current: pageIndex,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange,
            }}
          />
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);