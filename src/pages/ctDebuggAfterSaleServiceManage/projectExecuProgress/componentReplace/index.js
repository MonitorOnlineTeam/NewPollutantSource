/**
 * 功  能：项目执行进度 部件更换
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Popover, Typography,Descriptions, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Space } from 'antd';
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

const namespace = 'componentReplace'




const dvaPropsData = ({ loading, componentReplace, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetSpareReplacementRecordList`],
  tableDatas: componentReplace.tableDatas,
  tableTotal: componentReplace.tableTotal,
  queryPar: componentReplace.queryPar,
  exportLoading: loading.effects[`${namespace}/ExportpareReplacementRecordList`],
  cisPartsListLoading: loading.effects[`${namespace}/GetCisPartsList`],
  cisPartsList: componentReplace.cisPartsList,
})

const Index = (props) => {



  const [form] = Form.useForm();

  const [form2] = Form.useForm();

  const [formAll] = Form.useForm();




  const { queryPar, tableDatas, tableTotal, tableLoading, exportLoading, cisPartsList, reportContent,projectCode } = props;





  useEffect(() => {
    if(reportContent){ //派单查询 - 服务填报内容
      onFinish(pageIndex, pageSize,{projectCode:projectCode});
    }else{
      onFinish(pageIndex, pageSize);
      props.dispatch({
        type: `${namespace}/GetCisPartsList`,
        payload: {},
      });
    }

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
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'ProjectName',
      key: 'ProjectName',
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'EntName',
      key: 'EntName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '点位情况',
      dataIndex: 'IsPoint',
      key: 'IsPoint',
      width: 90,
      ellipsis: true,
      render: (text, record, index) => {
        return text? '有监测点' : '设备未安装';
      }
    },
    {
      title: '点位名称',
      dataIndex: 'PointName',
      key: 'PointName',
      ellipsis: true,
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModelName',
      key: 'SystemModelName',
      ellipsis: true,
    },
    {
      title: '申请人',
      dataIndex: 'ApplicationUser',
      key: 'ApplicationUser',
      ellipsis: true,
    },
    {
      title: 'CIS申请时间',
      dataIndex: 'ApplicationDate',
      key: 'ApplicationDate',
      ellipsis: true,
    },
    {
      title: '物料编码',
      dataIndex: 'U8Code',
      key: 'U8Code',
      ellipsis: true,
    },
    {
      title: '部件名称',
      dataIndex: 'PartsName',
      key: 'PartsName',
      ellipsis: true,
    },
    {
      title: '规格型号',
      dataIndex: 'ModelType',
      key: 'ModelType',
      ellipsis: true,
    },
    {
      title: 'CIS更换数量',
      dataIndex: 'CisChangeCount',
      key: 'CisChangeCount',
      ellipsis: true,
    },
    {
      title: '更换数量',
      dataIndex: 'ReplacementNum',
      key: 'ReplacementNum',
      ellipsis: true,
    },
    {
      title: '故障原因',
      dataIndex: 'FailureCauseName',
      key: 'FailureCauseName',
      ellipsis: true,
    },
    {
      title: '更换人',
      dataIndex: 'ReplacementUser',
      key: 'ReplacementUser',
      ellipsis: true,
    },
    {
      title: '更换时间',
      dataIndex: 'ReplacementTime',
      key: 'ReplacementTime',
      ellipsis: true,
    },
    {
      title: '提交人',
      dataIndex: 'CreateUserName',
      key: 'CreateUserName',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
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
      type: `${namespace}/ExportpareReplacementRecordList`,
      payload: {...queryPar,pageIndex:undefined,pageSize:undefined},
    });
  };


  const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = await form.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        btime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        etime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
      }
      props.dispatch({
        type: `${namespace}/GetSpareReplacementRecordList`,
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
          <Form.Item name='u8Code' label='物料编码'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='partsName' label='部件名称'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='time' label='更换时间'>
            <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='failureCause' label='故障原因'>
            {props.cisPartsListLoading?  <Spin size='small'><Select placeholder='请选择' /></Spin> : <Select placeholder='请选择' allowClear options={cisPartsList} fieldNames={{ label: 'Name', value: 'ChildID' }}/>}
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
      <BreadcrumbWrapper hideBreadcrumb={props.hideBreadcrumb}>
        <Card title={reportContent? null : searchComponents()} bodyStyle={reportContent&&{padding:0}} bordered={!reportContent}>
          <SdlTable
            resizable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={reportContent ? columns.filter(item=>item.title!='合同编号' && item.title!='项目名称') :  columns}
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
          <Descriptions
          className={'detailsWrapper'}
          labelStyle={{ fontWeight: 500 }}
        >
          {columns.filter(item => (item.title != '序号' && item.title != '操作')).map(item => (<Descriptions.Item label={item.title}>{item.dataIndex=='IsPoint'? detailData?.[`${item.dataIndex}`]? '有监测点' : '设备未安装'  : detailData?.[`${item.dataIndex}`]}</Descriptions.Item>))}
          </Descriptions>
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);