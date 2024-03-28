/**
 * 功  能：设备安装审核 设备安装规范性
 * 创建人：jab
 * 创建时间：2024.03
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,ProfileOutlined, AmazonCircleFilled,AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import moment from 'moment';

import styles from "./style.less"
// import Detail from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/detail'
const { Option } = Select; 

const namespace = 'installaEquipment'

const dvaPropsData = ({ loading, installaEquipment, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetEquipmentAuditList`],
  tableDatas: installaEquipment.installEquipmentTableDatas,
  tableTotal: installaEquipment.installEquipmentTableTotal,
  queryPar:installaEquipment.installaEquipmentQueryPar,
  installPhotoData: installaEquipment.installPhotoData,
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  addAuditInfoLoading: loading.effects[`${namespace}/AddAuditInfo`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form] = Form.useForm();



  const {queryPar, tableDatas, tableTotal,  tableLoading,installPhotoData,  } = props;



  useEffect(() => {
    onFinish(pageIndex,pageSize)
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
      title: '服务大区',
      dataIndex: 'Region',
      key: 'Region',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目所在省',
      dataIndex: 'Region',
      key: 'Region',
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
      title: '企业名称',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '监测点名称',
      dataIndex: 'OrderDate',
      key: 'OrderDate',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '设备型号',
      dataIndex: 'CommitDate',
      key: 'CommitDate',
      align: 'center',
      ellipsis: true,
    },
    
    {
        title: '离开现场时间',
        dataIndex: 'CommitDate',
        key: 'CommitDate',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '安装照片',
        dataIndex: 'CommitDate',
        key: 'CommitDate',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '照片上传时间',
        dataIndex: 'CommitDate',
        key: 'CommitDate',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '审核状态',
        dataIndex: 'CommitDate',
        key: 'CommitDate',
        align: 'center',
        ellipsis: true,
        render:(text)=>{

        }
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
              <AuditOutlined style={{ fontSize: 16 }} />
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
    props.ExportServiceDispatchForAnalysis({
      ...queryPar,
      PageIndex:undefined,
      PageSize:undefined
    })
  };


  const onFinish = async (PageIndex, PageSize,queryPar) => {  //查询

    try {
      const values =   await form.validateFields();
      const par = queryPar?{...queryPar, PageIndex: PageIndex, PageSize: PageSize,} : {
        ...values,
        pageIndex: PageIndex,
        pageSize: PageSize,
      }
      props.dispatch({
        type: `${namespace}/GetEquipmentAuditList`,
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
    onFinish(PageIndex, PageSize,props.queryPar)
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => {setPageIndex(1); onFinish(1, pageSize) }}
      initialValues={{
      }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='num'  label='派工单号'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='projectCode' label='项目编号' >
            <Input placeholder="合同编号、立项号" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='projectName'  label='项目名称' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
            <Col span={8}>
          <Form.Item name='status' label='审核状态' >
             <Select placeholder='请选择'  allowClear>
                <Option value={1}>待审核</Option>
                <Option value={2}>已审核</Option>
             </Select>
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{margin: '0 8px',}} onClick={() => { form.resetFields(); }}  >
              重置
         </Button>
         <Button type="primary">
              审核人员清单
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={styles.installaEquipmentSty}>
      <BreadcrumbWrapper>
      <Card title={searchComponents()}>
          <SdlTable
            style={{marginTop:6}}
            resizable
            loading={tableLoading}
            bordered
            scroll={{ y:'calc(100vh - 430px)'}}
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
        {/* <Modal
        visible={detailVisible}
        title={detailTitle}
        onCancel={() => { setDetailVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
      >
        <Detail data={detailData ? detailData : {}} id={detailId}/>
      </Modal> */}
      </Card>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);