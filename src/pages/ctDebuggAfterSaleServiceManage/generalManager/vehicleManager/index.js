/**
 * 功  能：通用管理 车辆管理
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm,Spin, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
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
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import Detail from './detail'
const { Option } = Select; 

const namespace = 'generalManager'


const dvaPropsData = ({ loading, generalManager, global, }) => ({
  tableDatas: generalManager.carTableDatas,
  tableTotal: generalManager.carTableTotal,
  tableLoading: generalManager.carTableLoading,
  queryPar:generalManager.carQueryPar,
  configInfo: global.configInfo,
  exportLoading: loading.effects[`${namespace}/ExportCarList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetCarList: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetCarList`,
        payload: payload,
      })
    },
    ExportCarList: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportCarList`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();





  const { queryPar, tableDatas, tableTotal,  tableLoading, exportLoading,isModal,  } = props;



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
      title: '车牌号',
      dataIndex: 'CarNum',
      key: 'CarNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '车型',
      dataIndex: 'VehicleType',
      key: 'VehicleType',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '购入日期',
      dataIndex: 'BuyDate',
      key: 'BuyDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '使用状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '车辆分类',
      dataIndex: 'CarClass',
      key: 'CarClass',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '资产状态',
      dataIndex: 'AssetStatus',
      key: 'AssetStatus',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '管理单位',
      dataIndex: 'AffiliatedUnit',
      key: 'AffiliatedUnit',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '所属部门',
      dataIndex: 'Department',
      key: 'Department',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '使用部门',
      dataIndex: 'UseDepartment',
      key: 'UseDepartment',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '车辆管理人',
      dataIndex: 'CarManager',
      key: 'CarManager',
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
  const [detailId, setDetailId] = useState()

  const detail = (record) => {
    setDetailVisible(true)
    setDetailTitle(`${record.CarNum} - 详情`)
    setDetailId(record.ID)
  }
  const exports =  () => {
    props.ExportCarList({
      ...queryPar,
      pageIndex:undefined,
      pageSize:undefined,
    })
  };


  const onFinish = async (PageIndex, PageSize,queryPar) => {  //查询

    try {
      const values = await form.validateFields();
      props.GetCarList(queryPar?{...queryPar, pageIndex: PageIndex, pageSize: PageSize} : {
        ...values,
        pageIndex: PageIndex,
        pageSize: PageSize,
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
    onFinish(PageIndex, PageSize, queryPar)
  }


  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => {setPageIndex(1);setPageSize(20); onFinish(1, 20) }}
    >
      <Row align='middle'>
        <Col span={8}>
            <Form.Item name='carManager' label='车辆管理人'>
            <Input placeholder="请输入" allowClear />
            </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='carNum' label='车牌号' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='status' label='使用状态' >
           <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='useDepartment' label='使用部门'  className='minWidth'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{margin: '0 8px'}} loading={tableLoading} onClick={() => { form.resetFields();setPageIndex(1);setPageSize(20); onFinish(1, 20)}}  >
              重置
         </Button>
         <Button icon={<ExportOutlined />} loading={exportLoading} style={{ marginRight: 8 }} onClick={() => { exports() }}>
          导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={`${styles.vehicleManagerSty} queryCriterTitleSty`}>
      <BreadcrumbWrapper  hideBreadcrumb={isModal}>
        <Card  title={searchComponents()} bordered={isModal && false} style={isModal&&{paddingTop:8}}>
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
        <Modal
        visible={detailVisible}
        title={detailTitle}
        onCancel={() => { setDetailVisible(false) }}
        footer={null}
        destroyOnClose
        wrapClassName={`spreadOverModal detailModalFormTextSty ${styles.detailModalSty}`}
        mask={false}
      >
        <Detail id={detailId}/>
      </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);