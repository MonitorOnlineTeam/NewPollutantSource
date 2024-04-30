/**
 * 功  能：项目执行进度 遗留问题
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space } from 'antd';
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
import CheckPhoto from '@/components/CheckPhoto';
import { permissionButton } from '@/utils/utils';

const { Option } = Select;

const namespace = 'componentReplaceQuery'




const dvaPropsData = ({ loading, componentReplaceQuery, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  tableDatas: componentReplaceQuery.tableDatas,
  tableTotal: componentReplaceQuery.tableTotal,
  queryPar: componentReplaceQuery.queryPar,
  exportLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form] = Form.useForm();

  const [form2] = Form.useForm();

  const [formAll] = Form.useForm();




  const { queryPar, tableDatas, tableTotal, tableLoading, exportLoading, hideBreadcrumb } = props;





  useEffect(() => {
    onFinish(pageIndex, pageSize);

  }, []);



  const columns = [
    {
      title: '序号',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '合同编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      ellipsis: true,
    },
    {
      title: '点位情况',
      dataIndex: 'dd',
      key: 'dd',
      width: 90,
      ellipsis: true,
    },
    {
      title: '点位名称',
      dataIndex: 'problemStatusName',
      key: 'problemStatusName',
      ellipsis: true,
    },
    {
      title: '系统型号',
      dataIndex: 'solveUserName',
      key: 'solveUserName',
      ellipsis: true,
    },
    {
      title: '申请人',
      dataIndex: 'problemTime',
      key: 'problemTime',
      ellipsis: true,
    },
    {
      title: 'CIS申请时间',
      dataIndex: 'problemTime',
      key: 'problemTime',
      ellipsis: true,
    },
    {
      title: '物料编码',
      dataIndex: 'dd',
      key: 'dd',
      ellipsis: true,
    },
    {
      title: '部件名称',
      dataIndex: 'problemTime',
      key: 'problemTime',
      ellipsis: true,
    },
    {
      title: '规格型号',
      dataIndex: 'problemTime',
      key: 'problemTime',
      ellipsis: true,
    },
    {
      title: 'CIS更换数量',
      dataIndex: 'dd',
      key: 'dd',
      ellipsis: true,
    },
    {
      title: '更换数量',
      dataIndex: 'problemTime',
      key: 'problemTime',
      ellipsis: true,
    },
    {
      title: '故障原因',
      dataIndex: 'problemTime',
      key: 'problemTime',
      ellipsis: true,
    },
    {
      title: '更换人',
      dataIndex: 'dd',
      key: 'dd',
      ellipsis: true,
    },
    {
      title: '更换人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      ellipsis: true,
    },
    {
      title: '更换时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
    },
    {
      title: '提交人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 60,
      ellipsis: true,
      render: (text, record, index) => {
        return (
          <Tooltip title="详情">
            <a onClick={() => { detail(record) }}><DetailIcon /></a>
          </Tooltip>
        );

      }
    },
  ];



  const [detailVisible, setDetailVisible] = useState(false)
  const [detailData, setDetailData] = useState({})

  const detail = (record) => {
    setDetailVisible(true)
    setDetailData(record)
  }
  const exportData = () => {
    props.dispatch({
      type: `${namespace}/ExportQuestionList`,
      payload: queryPar,
    });
  };


  const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = await form.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        beginTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        endTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
      }
      props.dispatch({
        type: `${namespace}/GetQuestionList`,
        payload: {
          ...par,
        },

      });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const handleTableChange = async (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex, PageSize, queryPar)
  }




  const searchComponents = () => {

    const resetData = () => { setPageIndex(1); setPageSize(20); onFinish(1, 20) }
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { resetData() }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='projectCode' label='合同编号' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='projectName' label='项目名称'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='itemCode' label='物料编码' className='minWidth'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='itemCode' label='部件名称' className='minWidth'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='time' label='更换时间'>
            <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='problemStatus' label='故障分类'>
            <Select placeholder='请选择' allowClear>
              <Option value={1}>人为原因</Option>
              <Option value={2}>产品质量</Option>
              <Option value={2}>其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='problemStatus' label='原因分析'>
            <Select placeholder='请选择' allowClear>
              <Option value={1}>人为原因</Option>
              <Option value={2}>产品质量</Option>
              <Option value={2}>其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={tableLoading}>
                查询
           </Button>
              <Button loading={tableLoading} onClick={() => { form.resetFields(); resetData() }}  >
                重置
         </Button>
              <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exportData() }}>
                导出
         </Button>
            </Space>
          </Form.Item>

        </Col>
      </Row>
    </Form>
  }

  return (
    <div className={`queryCriterTitleSty`}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            align='center'
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
          title={'部件更换详情'}
          onCancel={() => { setDetailVisible(false) }}
          destroyOnClose
          wrapClassName={`spreadOverModal detailModalFormTextSty ${styles.detailModalSty}`}
          mask={false}
          footer={null}
        >
          <Row>
            {columns.filter(item => (item.title != '序号' && item.title != '操作')).map(item => (<Col span={8}><Form.Item label={item.title} >  {detailData?.[`${item.dataIndex}`]}  </Form.Item> </Col>))}
          </Row>
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);