/**
 * 功  能：运维绩效  绩效信息
 * 创建人：jab
 * 创建时间：2022.05.18
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Tabs, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "../style.less"

import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

import PersonalShare from './components/PersonalShare'
import PersonalWorkInfo from './components/PersonalWorkInfo'

const namespace = 'operaAchiev'
const dvaPropsData = ({ loading, operaAchiev, global }) => ({
  tableTotal: operaAchiev.personalPerformanceRateTotal,
  tableDatas: operaAchiev.personalPerformanceRateList,
  tableLoading: loading.effects[`${namespace}/getPersonalPerformanceRateList`],
  exportLoading: loading.effects[`${namespace}/exportPersonalPerformanceRate`],
  historyOperationInfo: operaAchiev.historyOperationInfo,
  historyOperationInfoLoading: operaAchiev.historyProjectRelationLoading,
  tableTotal2: operaAchiev.personalPerformanceRateInfoTotal,
  tableDatas2: operaAchiev.personalPerformanceRateInfoList,
  tableLoading2: loading.effects[`${namespace}/getPersonalPerformanceRateInfoList`],
  exportLoading2: loading.effects[`${namespace}/exportPersonalPerformanceRateInfo`],

})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getPersonalPerformanceRateList: (payload) => { //绩效汇总 列表
      dispatch({
        type: `${namespace}/getPersonalPerformanceRateList`,
        payload: payload,
      })
    },
    exportPersonalPerformanceRate: (payload) => { //绩效汇总 导出
      dispatch({
        type: `${namespace}/exportPersonalPerformanceRate`,
        payload: payload
      })
    },
    getPersonalPerformanceRateInfoList: (payload) => { //绩效明细 列表
      dispatch({
        type: `${namespace}/getPersonalPerformanceRateInfoList`,
        payload: payload,
      })
    },
    exportPersonalPerformanceRateInfo: (payload) => { //绩效明细 导出
      dispatch({
        type: `${namespace}/exportPersonalPerformanceRateInfo`,
        payload: payload
      })
    },
  }
}


const Index = (props) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const { tableTotal, tableDatas, tableLoading, exportLoading, tableTotal2, tableDatas2, tableLoading2, exportLoading2, } = props;

  useEffect(() => {
    onFinish(pageIndex, pageSize)
    onFinish2(pageIndex2, pageSize2,'initData')

  }, [])

  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '员工编号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
    },
    {
      title: '非驻场',
      align: 'center',
      children: [
        {
          title: '污染源气绩效套数',
          dataIndex: 'GasPerformance',
          key: 'GasPerformance',
          align: 'center'
        },
        {
          title: '污染源水绩效套数',
          dataIndex: 'WaterPerformance',
          key: 'WaterPerformance',
          align: 'center'
        },
      ]
    },
    {
      title: '驻场',
      align: 'center',
      children: [
        {
          title: '污染源气绩效套数',
          dataIndex: 'GasPerformanceZ',
          key: 'GasPerformanceZ',
          align: 'center'
        },
        {
          title: '污染源水绩效套数',
          dataIndex: 'WaterPerformanceZ',
          key: 'WaterPerformanceZ',
          align: 'center'
        },
      ]
    },

    {
      title: <span>操作</span>,
      align: 'center',
      render: (text, record) => {
        return <span>
          <Fragment>
            <Tooltip title="详情">
              <a onClick={() => { detail(record) }}>  <ProfileOutlined style={{ fontSize: 16 }} /></a>
            </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];

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
      title: '省份',
      dataIndex: 'RegionName',
      key: 'RegionName',
      align: 'center',
    },
    {
      title: '地级市',
      dataIndex: 'CityName',
      key: 'CityName',
      align: 'center',
    },
    {
      title: '运维项目号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center'
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center'
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center'
    },
    {
      title: '站点名称',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center'
    },
    {
      title: 'MN号',
      dataIndex: 'DGIMN',
      key: 'DGIMN',
      align: 'center'
    },
    {
      title: '分类',
      dataIndex: 'PollutantTypeName',
      key: 'PollutantTypeName',
      align: 'center'
    },
    {
      title: '设备类别系数',
      dataIndex: 'PointCoefficient',
      key: 'PointCoefficient',
      align: 'center'
    },
    {
      title: '巡检周期',
      dataIndex: 'InspectionTypeName',
      key: 'InspectionTypeName',
      align: 'center'
    },
    {
      title: '巡检周期系数',
      dataIndex: 'RecordCoefficient',
      key: 'RecordCoefficientx',
      align: 'center'
    },
    {
      title: '实际运维人员',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center'
    },
    {
      title: '工号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center'
    },
    {
      title: '工单完成比例',
      dataIndex: 'OrderExecutionRatio',
      key: 'OrderExecutionRatio',
      align: 'center'
    },
    {
      title: '执行比例',
      dataIndex: 'ExecutionRatio',
      key: 'ExecutionRatio',
      align: 'center'
    },
    {
      title: '绩效套数',
      dataIndex: 'UserCoefficient',
      key: 'UserCoefficient',
      align: 'center'
    },
    {
      title: <span>操作</span>,
      align: 'center',
      render: (text, record) => {
        return <span>
          <Fragment>
            <Tooltip title="详情">
              <a onClick={() => { detail(record,'isDetailed') }}>  <ProfileOutlined style={{ fontSize: 16 }} /></a>
            </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];
  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();
      setPageIndex(pageIndexs)
      const par = {
        ...values,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
        Month: values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
      }
      props.getPersonalPerformanceRateList({ ...par })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onFinish2 = async (pageIndexs,pageSizes,initData) => {  //查询 绩效明细
    try {
      const values = await form2.validateFields();
      const par = {
        ...values,
        pageIndex: pageIndexs,
        pageSize: pageSizes,
        Month:initData?  moment().add(-1, 'M').format("YYYY-MM-01 00:00:00") : values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
      }
      props.getPersonalPerformanceRateInfoList({ ...par })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const [pageSize, setPageSize] = useState(20)
  const [pageIndex, setPageIndex] = useState(1)
  const handleTableChange = (PageIndex, PageSize) => { //绩效汇总 分页
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)

  }

  const [pageSize2, setPageSize2] = useState(20)
  const [pageIndex2, setPageIndex2] = useState(1)
  const handleTableChange2 = (PageIndex, PageSize) => { //绩效明细 分页
    setPageIndex2(PageIndex)
    setPageSize2(PageSize)
    onFinish2(PageIndex, PageSize)

  }

  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState(null)
  const [detailPar, setDetailPar] = useState(null)

  const detail = (record,type) => {
    setVisible(true)
    if(type === 'isDetailed'){
      setDetailPar({
        ID: record.ID,
      })
    }else{
      setDetailPar({
        Month: form.getFieldValue('Month').format("YYYY-MM-01 00:00:00"),
        UserAccount: record.UserAccount,
        UserName: record.UserName,
        UserId: record.UserId,
      })
    }

    setTitle(`${record.UserName}`)
  }


  const exports = async () => {
    const values = await form.getFieldsValue();
    const par = {
      ...values,
      Month: values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
    }
    props.exportPersonalPerformanceRate({ ...par })
  };
  const exports2 = () => {
    const values = form.getFieldsValue();
    const par = {
      ...values,
      Month: values.Month && moment(values.Month).format("YYYY-MM-01 00:00:00"),
    }
    props.exportPersonalPerformanceRateInfo({ ...par })
  };


  const searchComponents = () => {
    return <Form
      name="advanced_search"
      form={form}
      layout='inline'
      onFinish={() => { onFinish(1, pageSize) }}
      initialValues={{
        Month: moment().add(-1, 'M'),
      }}
    >


      <Form.Item label='统计月份' name='Month'>
        <DatePicker picker="month" allowClear={false} />
      </Form.Item>
      <Form.Item label='员工编号' name='UserAccount'>
        <Input placeholder='请输入' allowClear />
      </Form.Item>
      <Form.Item label='姓名' name='UserName'>
        <Input placeholder='请输入' allowClear />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={tableLoading}>
          查询
      </Button>
        <Button style={{ margin: '0 8px', }} onClick={() => { form.resetFields(); }}  >
          重置
      </Button>
      <Button icon={<ExportOutlined />} loading={exportLoading2} onClick={() => { exports() }}>
            导出
      </Button>
      </Form.Item>

    </Form>
  }

  const searchComponents2 = () => {
    return <Form
      name="advanced_search2"
      form={form2}
      onFinish={() => { onFinish2(1, pageSize2) }}
      initialValues={{
        Month: moment().add(-1, 'M'),
      }}
    >

      <Row>
        <Form.Item label='统计月份' name='Month' className='form2ItemWidth'>
          <DatePicker picker="month" allowClear={false} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label='员工编号' name='UserAccount'>
          <Input placeholder='请输入' allowClear={true} />
        </Form.Item>
        <Form.Item label='姓名' name='UserName' className='form2ItemWidth'>
          <Input placeholder='请输入' allowClear={true} />
        </Form.Item>
      </Row>
      <Row style={{ marginTop: 6 }}>
        <Form.Item label='运维项目号' name='ProjectNum'  className='form2ItemWidth'>
          <Input placeholder='请输入' allowClear={true}/>
        </Form.Item>
        <Form.Item label='企业名称' name='EntName'>
          <Input placeholder='请输入' allowClear={true} />
        </Form.Item>
        <Form.Item label='监测点名称' name='PointName' className='form2ItemWidth'>
          <Input placeholder='请输入' allowClear={true} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={tableLoading2}>
            查询
      </Button>
          <Button style={{ margin: '0 8px', }} onClick={() => { form2.resetFields(); }}  >
            重置
         </Button>
          <Button icon={<ExportOutlined />} loading={exportLoading2} onClick={() => { exports2() }}>
            导出
         </Button>
        </Form.Item>
      </Row>
    </Form>
  }

  return (
    <div className={styles.achievQuerySty}>
      <BreadcrumbWrapper>
       <Tabs tabPosition='left' style={{ marginTop: 16 }}>
          <TabPane tab="绩效汇总" key="1">
            <Card title={searchComponents()}>

              <SdlTable
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
          </TabPane>
          <TabPane tab='绩效明细' key="2">
            <Card title={searchComponents2()}>

              <SdlTable
                loading={tableLoading2}
                bordered
                dataSource={tableDatas2}
                columns={columns2}
                pagination={{
                  total: tableTotal2,
                  pageSize: pageSize2,
                  current: pageIndex2,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange2,
                }}
              />
            </Card>
          </TabPane>
        </Tabs>
        <Modal
          title={title}
          visible={visible}
          footer={null}
          onCancel={() => { setVisible(false) }}
          destroyOnClose
          width='95%'
        // centered
        >
         {detailPar&&detailPar.ID?  //绩效明细
           <PersonalWorkInfo props detailPar={detailPar} />
           :
           <Tabs tabPosition='left'>
            <TabPane tab="个人分摊套数" key="1">
              <PersonalShare props detailPar={detailPar} />
            </TabPane>
            <TabPane tab='个人工单信息' key="2">
              <PersonalWorkInfo props detailPar={detailPar} />
            </TabPane>
          </Tabs>}
        </Modal>
      </BreadcrumbWrapper>


    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);