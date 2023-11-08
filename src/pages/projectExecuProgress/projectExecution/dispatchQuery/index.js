/**
 * 功  能：项目执行进度/项目执行 派单查询
 * 创建人：jab
 * 创建时间：2023.08.29
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
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

import Detail from './Detail'
const { Option } = Select; 

const namespace = 'dispatchQuery'




const dvaPropsData = ({ loading, dispatchQuery, global, }) => ({
  tableLoading: loading.effects[`${namespace}/getServiceDispatch`],
  tableDatas: dispatchQuery.tableDatas,
  tableTotal: dispatchQuery.tableTotal,
  queryPar:dispatchQuery.queryPar,
  configInfo: global.configInfo,
  exportLoading: loading.effects[`${namespace}/exportServiceDispatch`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getServiceDispatch: (payload) => { //派单信息列表
      dispatch({
        type: `${namespace}/getServiceDispatch`,
        payload: payload,
      })
    },
    exportServiceDispatch: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportServiceDispatch`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  const [expand, setExpand] = useState(false);




  const { tableDatas, tableTotal,  tableLoading, exportLoading,  } = props;



  useEffect(() => {
    onFinish(pageIndex, pageSize);

  }, []);

  let columns = [
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
      ellipsis: true,
    },
    {
      title: '合同编号',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '立项号',
      dataIndex: 'ItemCode',
      key: 'ItemCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '工程助理',
      dataIndex: 'AssistantName',
      key: 'AssistantName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务工程师',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务申请人',
      dataIndex: 'ApplicantUserName',
      key: 'ApplicantUserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '下单日期',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '项目所属行业',
      dataIndex: 'Industry',
      key: 'Industry',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '流程状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '任务状态',
      dataIndex: 'TaskStatusName',
      key: 'TaskStatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '提交人',
      dataIndex: 'CommitUserName',
      key: 'CommitUserName',
      align: 'center',
      defaultSortOrder: 'descend',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'CommitDate',
      key: 'CommitDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 60,
      ellipsis: true,
      render: (text, record) => {
        return (
          <Tooltip title="详情">
            <a
              onClick={() => {
                detail(record)
              }}
            >
              <ProfileOutlined style={{ fontSize: 16 }} />
            </a>
          </Tooltip>
        );

      }
    },
  ];
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailTitle, setDetailTitle] = useState('详情')
  const [detailData, setDetailData] = useState()
  const [detailId, setDetailId] = useState()

  const detail = (record) => {
    setDetailVisible(true)
    setDetailTitle(`${record.Num}${record.ProjectCode? ` - ${record.ProjectCode}` : record.ItemCode ? ` - ${record.ItemCode}` : ''}`)
    setDetailData(record)
    setDetailId(record.ID)
  }
  const exports = async () => {
    const values = await form.validateFields();
    props.exportServiceDispatch({
      ...values,
      beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
    })
  };


  const onFinish = async (PageIndex, PageSize,queryPar) => {  //查询

    try {
      const values =   await form.validateFields();
      props.getServiceDispatch(queryPar?{...queryPar, PageIndex: PageIndex, PageSize: PageSize,} : {
        ...values,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        PageIndex: PageIndex,
        PageSize: PageSize,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize,props.queryPar)
  }


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { onFinish(pageIndex, pageSize) }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='num' label='派工单号'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} className='minWidth'>
          <Form.Item name='projectCode' label='合同编号' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='itemCode' label='立项号' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='projectName' label='项目名称' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        {expand && <> <Col span={8}>
          <Form.Item name='serviceUserName' label='服务工程师' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
          <Col span={8}>
            <Form.Item name='time' label='下单日期' >
              <RangePicker style={{ width: '100%' }}
                showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='status' label='流程状态' >
              <Select allowClear placeholder="请选择" >
                <Option value="1">待发</Option>
                <Option value="2">已发</Option>
                <Option value="3">待办</Option>
                <Option value="4">已办</Option>
                <Option value="5">取消</Option>
                <Option value="6">回退</Option>
                <Option value="7">取回</Option>
                <Option value="8">竞争执行</Option>
                <Option value="15">终止</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} className='minWidth'>
            <Form.Item name='taskStatus' label='任务状态' >
              <Select allowClear placeholder="请选择" >
                <Option value="1">待完成</Option>
                <Option value="2">进行中</Option>
                <Option value="3">已完成</Option>
              </Select>
            </Form.Item>
          </Col></>}
        <Col span={8} >
          <Form.Item style={{ marginLeft:expand ? 4 : 16 }}>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{margin: '0 8px',}} onClick={() => { form.resetFields(); }}  >
              重置
         </Button>
         <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8, }} onClick={() => { exports() }}>
          导出
         </Button>
            <a onClick={() => { setExpand(!expand); }} >
              {expand ? <>收起 <UpOutlined /></> : <>展开 <DownOutlined /></>}
            </a>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={styles.dispatchQuerySty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            scroll={{ y: expand ? 'calc(100vh - 390px)' : 'calc(100vh - 350px)' }}
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
        <Modal
        visible={detailVisible}
        title={detailTitle}
        onCancel={() => { setDetailVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
      >
        <Detail data={detailData ? detailData : {}} id={detailId}/>
      </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);