/**
 * 功  能：客户满意度 客户满意度调查
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import moment from 'moment';
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SetUserListBtn from "@/components/SetUserListBtn";
import LargeRegionList from "@/pages/ctDebuggAfterSaleServiceManage/components/largeRegionList";
import DispatchDetails from "./components/DispatchDetails";
import InvestigateModal from "./components/InvestigateModal";

import { API } from '@config/API';
import cuid from 'cuid';
import styles from "./style.less"
const { Option } = Select;
const { Step } = Steps;
const namespace = 'customerSatisfacQuery'

const dvaPropsData = ({ loading, customerSatisfacQuery, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetSatisfactionSurveyList`],
  tableDatas: customerSatisfacQuery.tableDatas,
  tableTotal: customerSatisfacQuery.tableTotal,
  queryPar: customerSatisfacQuery.queryPar,
  installPhotoData: customerSatisfacQuery.installPhotoData,
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  addAuditInfoLoading: loading.effects[`${namespace}/AddAuditInfo`],
  exportLoading: loading.effects[`${namespace}/ExportSatisfactionSurvey`],
  largeRegionListLoading: loading.effects[`ctCommon/GetLargeRegionList`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form] = Form.useForm();




  const {largeRegionListLoading, location:{pathname}, queryPar, tableDatas, tableTotal, tableLoading, auditPhotoLoading, installPhotoData, addAuditInfoLoading,exportLoading} = props;
 

  const [exportIndex, setExportIndex] = useState(-1);
  
  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceList, setProvincelist] = useState([]);
  const [provinceAllList, setProvinceAlllist] = useState([]);



  useEffect(() => {
    props.dispatch({
      type: `ctCommon/GetLargeRegionList`,
      payload: {},
      callback:(res)=>{
        setLargeRegionList(res)
        const data = [];
         res.map(item=>{
          if(item.ChildList?.[0]){
            item.ChildList.map(childListItem=>{
              data.push(childListItem)
            })
          }
         
        })
        setProvinceAlllist(data)
        onFinish(pageIndex, pageSize);
      },
    })
  }, []);
  const columns = [
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
      title: '派单时间',
      dataIndex: 'ProjectCode',
      key: 'ProjectCode',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目编号',
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
      title: '大区名称',
      dataIndex: 'ServiceAreaName',
      key: 'ServiceAreaName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省份',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '行业',
      dataIndex: 'ProvinceName',
      key: 'ProvinceName',
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
      title: '工程师行政区域',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务主要内容',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务完成日期',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '客户姓名',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '客户电话',
      dataIndex: 'EntName',
      key: 'EntName',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '工程师服务态度（1-5分）',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '工程师技术水平（1-5分）',
      dataIndex: 'SystemModelName',
      key: 'SystemModelName',
      align: 'center',
      ellipsis: true,
    },

    {
      title: '客户问题及建议',
      dataIndex: 'LeaveDate',
      key: 'LeaveDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '总得分',
      dataIndex: 'LeaveDate',
      key: 'LeaveDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查人员',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查日期',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查提交时间',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '终止调查原因',
      dataIndex: 'CreateTime',
      key: 'CreateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查状态',
      dataIndex:'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return  <span style={{color: text == '待调查'? '#f5222d' : 'rgba(0, 0, 0, 0.85)'}}>{text}</span> 
      }
    },
    {
      title: '处理状态',
      dataIndex:'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return  <span style={{color: text == '待调查'? '#f5222d' : 'rgba(0, 0, 0, 0.85)'}}>{text}</span> 
      }
    },
    {
      title: '处理办法',
      dataIndex:'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '处理人',
      dataIndex:'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '处理填写时间',
      dataIndex:'StatusName',
      key: 'StatusName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 220,
      ellipsis: true,
      fixed:'right',
      render: (text, record,index) => {
        return <> 
             <a>详细</a>   <Divider type="vertical" />
             <a onClick={()=>investigate(record)}>调查</a> <Divider type="vertical" />
             <a>终止调查</a> <Divider type="vertical" />
             <a>转发</a> 
             </>
               
    }
    }
  ];

  const largeRegionChange = (value)=>{
    form.setFieldsValue({province:undefined})
    const data = value? provinceAllList.filter(item=>item.ID == value ) : provinceAllList
    setProvincelist(data)
  }

  const [viewPhotosVisible, setViewPhotosVisible] = useState(false)
  const viewPhotos = (row) => {
    setViewPhotosVisible(true)
    props.dispatch({
      type: `${namespace}/GetAuditPhoto`,
      payload: {
        systemModelId: row.Col1,
        dispatchId: row.DispatchId,
        pointId: row.PointId,
        equipmentAuditId: row.EquipmentAuditId,
      }
    });
  }
  const [investigateVisible, setInvestigateVisible] = useState(true)
  const [investigateData, setInvestigateData] = useState([1])

  const investigate = (row) => {
    setInvestigateVisible(true)
    setInvestigateData(row)

  }

  const onFinish = async (PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = await form.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
      }
      props.dispatch({
        type: `${namespace}/GetSatisfactionSurveyList`,
        payload: {
          ...par,
        }
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
   const exports = ()=>{
    props.dispatch({
      type: `${namespace}/ExportSatisfactionSurvey`,
      payload: {
        ...queryPar,
      }
    });
   }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { setPageIndex(1); onFinish(1, pageSize) }}
    >
      <Row align='middle'>
      <Col span={8}>
        <Spin size='small' spinning={largeRegionListLoading}   className='formItemSpinSty'>
          <Form.Item name='serviceAreaCode' label='服务大区'>
             <Select placeholder='请选择' onChange={largeRegionChange} allowClear>
             {largeRegionList.map(item=><Option value={item.ID}>{item.LargeRegion}</Option>)}
             </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
          <Spin size='small' spinning={largeRegionListLoading}   className='formItemSpinSty'>
          <Form.Item name='province' className='minWidth4' label='省份' >
             <Select placeholder='请选择' allowClear>
             {provinceList.map(item=><Option value={item.RegionCode}>{item.RegionName}</Option>)}
             </Select>
          </Form.Item>
          </Spin>
        </Col>
       
        <Col span={8} >
          <Form.Item name='projectCode' label='项目编号' >
            <Input placeholder="合同编号、立项号" allowClear />
          </Form.Item>
        </Col>



        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); setPageIndex(1); setPageSize(20); onFinish(1, 20) }}  >
              重置
         </Button>
         <Button  style={{ marginRight: 8}}  icon={<ExportOutlined />} loading={exportLoading} onClick={() => {exports() }}>
              导出
         </Button>
            <SetUserListBtn type={4} text='配置助理清单' />
            <Button type="primary">
              查看所有数据
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }





  return (
    <div className={styles.customerSatisfacQuerySty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            style={{ marginTop: 6 }}
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
          {/* <Modal
            visible={viewPhotosVisible}
            title={'安装照片'}
            onCancel={() => { setViewPhotosVisible(false) }}
            footer={null}
            mask={false}
            destroyOnClose
            wrapClassName={`spreadOverModal ${styles.modalSty}`}
          >

            <DispatchDetails type={1}/>
          </Modal> */}
           <InvestigateModal   visible={investigateVisible}  data={investigateData}  onCancel={() => { setInvestigateVisible(false) }}/>
        </Card>

      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);