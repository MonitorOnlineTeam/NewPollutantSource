/**
 * 功  能：近30日运维工单
 * 创建人：jab
 * 创建时间：2023.10
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Spin, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList';
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import { Resizable, ResizableBox } from 'react-resizable';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RoleList from '@/components/RoleList'
import OperationCompanyList from '@/components/OperationCompanyList'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'operations'





const dvaPropsData = ({ loading, operations }) => ({
  tableDatas: operations.operationPlanTaskTable,
  tableTotal: operations.operationPlanTaskTotal,
  tableLoading: operations.operationPlanTaskTableLoading,
  exportLoading: operations.exportOperationPlanTaskTableLoading,
  tableDatas2: operations.operationPlanTaskTable2,
  tableTotal2: operations.operationPlanTaskTotal2,
  tableLoading2: operations.operationPlanTaskTableLoading2,
  exportLoading2: operations.exportOperationPlanTaskTableLoading2,
  tableDatas3: operations.operationPlanTaskTable3,
  tableTotal3: operations.operationPlanTaskTotal3,
  tableLoading3: operations.operationPlanTaskTableLoading3,
  exportLoading3: operations.exportOperationPlanTaskTableLoading3,
  queryPar: operations.operationPlanTaskQueryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getOperationPlanTaskList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getOperationPlanTaskList`,
        payload: payload,
      })
    },
    exportOperationPlanTaskList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportOperationPlanTaskList`,
        payload: payload,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();








  const {pollutantType, tableDatas, tableTotal, tableLoading, exportLoading, queryPar, tableDatas2, tableTotal2, tableLoading2, exportLoading2, tableDatas3, tableTotal3, tableLoading3, exportLoading3, } = props;
  useEffect(() => {
    onFinish(null, 1);
  }, []);

  let commonCol = [
    {
      title: '完成工单数',
      dataIndex: 'taskCount',
      key: 'taskCount',
      align: 'center',
      sorter: (a, b) => a.taskCount - b.taskCount,
    },
    {
      title: '巡检',
      dataIndex: 'xunjian',
      key: 'xunjian',
      align: 'center',
      sorter: (a, b) => a.xunjian - b.xunjian,
    },
    {
      title: '校准',
      dataIndex: 'jiaozhun',
      key: 'jiaozhun',
      align: 'center',
      sorter: (a, b) => a.jiaozhun - b.jiaozhun,
    },
    {
      title: '维修',
      dataIndex: 'weixiu',
      key: 'weixiu',
      align: 'center',
      sorter: (a, b) => a.weixiu - b.weixiu,
    },
    {
      title: '维护',
      dataIndex: 'weihu',
      key: 'weihu',
      align: 'center',
      sorter: (a, b) => a.weihu - b.weihu,
    },
    {
      title: '备品备件更换',
      dataIndex: 'beipin',
      key: 'beipin',
      align: 'center',
      sorter: (a, b) => a.beipin - b.beipin,
    },
    {
      title: '易耗品更换',
      dataIndex: 'yihaopin',
      key: 'yihaopin',
      align: 'center',
      sorter: (a, b) => a.yihaopin - b.yihaopin,
    },
    {
      title: '标准物质更换',
      dataIndex: 'biaozhunwuzhi',
      key: 'biaozhunwuzhi',
      align: 'center',
      sorter: (a, b) => a.biaozhunwuzhi - b.biaozhunwuzhi,
    },
    
    {
      title: '试剂更换',
      dataIndex: 'shiji',
      key: 'shiji',
      align: 'center',
      sorter: (a, b) => a.shiji - b.shiji,
    },
    {
      title: '校验测试',
      dataIndex: 'jiaoyanceshi',
      key: 'jiaoyanceshi',
      align: 'center',
      sorter: (a, b) => a.jiaoyanceshi - b.jiaoyanceshi,
    },
    {
      title: '配合检查',
      dataIndex: 'peihejiancha',
      key: 'peihejiancha',
      align: 'center',
      sorter: (a, b) => a.peihejiancha - b.peihejiancha,
    },
    {
      title: '配合对比',
      dataIndex: 'peiheduibi',
      key: 'peiheduibi',
      align: 'center',
      sorter: (a, b) => a.peiheduibi - b.peiheduibi,
    },
  ]
  pollutantType==1? commonCol=commonCol.filter(item=>item.title!='标准物质更换') :  commonCol=commonCol.filter(item=>item.title!='试剂更换')
  const [regionCode,setRegionCode] = useState()
  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '行政区',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      render: (text, record) => {
        const regCode = record.RegionCode || queryPar.regionCode;
        return <a onClick={() => { setPointType(2);setRegionCode(regCode); onFinish({...queryPar,regionCode:regCode}, 2) }}>{text}</a>
      }
    },
    {
      title: '运维监测点数',
      dataIndex: 'pointCount',
      key: 'pointCount',
      align: 'center',
      sorter: (a, b) => a.pointCount - b.pointCount,
    },
    ...commonCol,
  ];
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '行政区',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      render: (text, record) => {
        const regCode = record.regionCode?record.regionCode : regionCode
        return <a onClick={() => { setPointType(3);setRegionCode(regCode); onFinish({...queryPar,regionCode:regCode}, 3) }}>{text}</a>
      }
    },
    {
      title: '运维监测点数',
      dataIndex: 'pointCount',
      key: 'pointCount',
      align: 'center',
      sorter: (a, b) => a.pointCount - b.pointCount,
    },
    ...commonCol,
  ];
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex3 - 1) * pageSize3;
      }
    },
    {
      title: '行政区',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
    },
    ...commonCol,
  ];
  const [pointType, setPointType] = useState(1)
  const onFinish = async (queryPar, pointType) => {  //查询
    try {
      const values = await form.validateFields();
      const par = queryPar ? { ...queryPar, pointType: pointType } :
        {
          ...values,
          beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
          time: undefined,
          pointType: pointType,
          pollutantType:pollutantType,
        }
      props.getOperationPlanTaskList({
        ...par,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }


  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //行政区 分页
    setPageIndex(PageIndex)
    setPageSize(PageSize)
  }
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 = async (PageIndex, PageSize) => { //市 分页
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
  }

  const [pageIndex3, setPageIndex3] = useState(1)
  const [pageSize3, setPageSize3] = useState(20)
  const handleTableChange3 = async (PageIndex, PageSize) => { //企业 分页
    setPageIndex3(PageIndex)
    setPageSize3(PageSize)
    onFinish({...queryPar,regionCode: regionCode, pageIndex: PageIndex, pageSize: PageSize },3)
  }

  const exports = (queryPar, pointType) => { //导出
    props.exportOperationPlanTaskList({
      ...queryPar,
      pointType:pointType,
    })
  }
  const [entCode,setEntCode] = useState()
  const searchComponents = () => {
    return pointType == 1 ? <Form
      form={form}
      layout='inline'
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { setPointType(1); onFinish(null, 1) }}
      initialValues={{
        time: [moment().subtract(1, 'month').startOf('day'), moment().endOf('day'),],
      }}
    >
      <Form.Item label="日期查询" name="time">
        <RangePicker_ allowClear style={{ width: 350 }} showTime={{
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }} />
      </Form.Item>
      <Form.Item label="行政区" name="regionCode">
        <RegionList style={{ width: 170 }} placeholder='请输入'/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
          查询
       </Button>
        <Button icon={<ExportOutlined />} onClick={() => { exports(queryPar,1) }} loading={exportLoading} style={{ marginRight: 6 }}>
          导出
            </Button>
      </Form.Item>
    </Form>
      :
      pointType == 2 ?
        <Form layout='inline'>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={() => { exports({...queryPar,regionCode:regionCode},2) }} loading={exportLoading2} style={{ marginRight: 6 }}>
              导出
      </Button>
            <Button icon={<RollbackOutlined />} onClick={() => { setPointType(1) }} style={{ marginRight: 6 }}>
              返回
          </Button>
          </Form.Item>
        </Form>
        :
        <Form layout='inline'>
          <Form.Item >
            <EntAtmoList onChange={(value)=>{onFinish({...queryPar,regionCode: regionCode, entCode: value},3);setEntCode(value);}} style={{ width: 260 }} />
          </Form.Item>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={() => { exports({...queryPar,regionCode:regionCode,entCode:entCode},3) }} loading={exportLoading3} style={{ marginRight: 5 }}>
              导出
          </Button>
            <Button icon={<RollbackOutlined />} onClick={() => { setPointType(2) }} style={{ marginRight: 6 }}>
              返回
          </Button>
          </Form.Item>
        </Form>
  }
  return (
    <div className={styles.equipmentManufacturListSty}>
      <Card title={searchComponents()}>
        {pointType == 1 ? <SdlTable
          loading={tableLoading}
          bordered
          dataSource={tableDatas}
          columns={columns}
          pagination={false}
          // pagination={{
          //   total: tableTotal,
          //   pageSize: pageSize,
          //   current: pageIndex,
          //   showSizeChanger: true,
          //   showQuickJumper: true,
          //   onChange: handleTableChange,
          // }}
        /> :
          pointType == 2 ? <SdlTable
            loading={tableLoading2}
            bordered
            dataSource={tableDatas2}
            columns={columns2}
            pagination={false}
            // pagination={{
            //   total: tableTotal2,
            //   pageSize: pageSize2,
            //   current: pageIndex2,
            //   showSizeChanger: true,
            //   showQuickJumper: true,
            //   onChange: handleTableChange2,
            // }}
          /> :
            <SdlTable
              loading={tableLoading3}
              bordered
              dataSource={tableDatas3}
              columns={columns3}
              pagination={{
                total: tableTotal3,
                pageSize: pageSize3,
                current: pageIndex3,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: handleTableChange3,
              }}
            />
        }
      </Card>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);