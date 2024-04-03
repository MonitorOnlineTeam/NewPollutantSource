/**
 * 功  能：客户满意度 客户满意度调查
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm,Popover, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
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
import TitleComponents from '@/components/TitleComponents'
import SetUserListBtn from "@/components/SetUserListBtn";
import LargeRegionList from "@/pages/ctDebuggAfterSaleServiceManage/components/largeRegionList";
import DispatchDetails from "./components/DispatchDetails";
import InvestigaContent from "./components/InvestigaContent";
import InvestigateModal from "./components/InvestigateModal";
import HandleModal from "./components/HandleModal";
import UserList from '@/components/UserList'

import { API } from '@config/API';
import cuid from 'cuid';
import styles from "./style.less"
const { Option } = Select;
const { Step } = Steps;
const namespace = 'customerSatisfacQuery'

const dvaPropsData = ({ loading, customerSatisfacQuery, global, }) => ({
  tableLoading:  customerSatisfacQuery.tableLoading,
  tableDatas: customerSatisfacQuery.tableDatas,
  tableTotal: customerSatisfacQuery.tableTotal,
  queryPar: customerSatisfacQuery.queryPar,
  tableLoading2:  customerSatisfacQuery.tableLoading2,
  tableDatas2: customerSatisfacQuery.tableDatas2,
  tableTotal2: customerSatisfacQuery.tableTotal2,
  queryPar2: customerSatisfacQuery.queryPar2,
  exportLoading: customerSatisfacQuery.exportLoading,
  exportLoading2: customerSatisfacQuery.exportLoading2,
  largeRegionListLoading: loading.effects[`ctCommon/GetLargeRegionList`],
  configInfo: global.configInfo,
})

const Index = (props) => {



  const [form] = Form.useForm();
  const [formAll] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();



  const {largeRegionListLoading, location:{pathname}, queryPar, tableDatas, tableTotal, tableLoading,queryPar2, tableDatas2, tableTotal2, tableLoading2, auditPhotoLoading, installPhotoData, addAuditInfoLoading,exportLoading,exportLoading2} = props;
 

  const [exportIndex, setExportIndex] = useState(-1);
  
  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceList, setProvincelist] = useState([]);
  const [provinceList2, setProvincelist2] = useState([]);
  const [provinceAllList, setProvinceAlllist] = useState([]);
  const [popVisible, setPopVisible] = useState(false);
  const [popVisible2, setPopVisible2] = useState(false);

  

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
        onFinish(1,pageIndex, pageSize);
      },
    })
  }, []);

  const [viewAllFlag,setViewAllFlag] = useState(false)
  const [viewAllVisible,setViewAllVisible] = useState(false)

  const viewAllData = ()=>{
    setViewAllVisible(true)
    setViewAllFlag(true)
    formAll.resetFields()
    onFinish(2,pageIndex2, pageSize2)
  }

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
      dataIndex: 'Industry',
      key: 'Industry',
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
      dataIndex: 'ServiceAreaName',
      key: 'ServiceAreaName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务主要内容',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '服务完成日期',
      dataIndex: 'LeaveDate',
      key: 'LeaveDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '客户姓名',
      dataIndex: 'ContactsName',
      key: 'ContactsName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '客户电话',
      dataIndex: 'Phone',
      key: 'Phone',
      align: 'center',
      ellipsis: true,

    },
    {
      title: '工程师服务态度（1-5分）',
      dataIndex: 'ServiceAttitude',
      key: 'ServiceAttitude',
      align: 'center',
      ellipsis: true,
      width:170,

    },
    {
      title: '工程师技术水平（1-5分）',
      dataIndex: 'TechnicalLevel',
      key: 'TechnicalLevel',
      align: 'center',
      ellipsis: true,
      width:170,
    },

    {
      title: '客户问题及建议',
      dataIndex: 'Problem',
      key: 'Problem',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '总得分',
      dataIndex: 'TotalScore',
      key: 'TotalScore',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查人员',
      dataIndex: 'InvestigatorName',
      key: 'InvestigatorName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查日期',
      dataIndex: 'InvestigationTime',
      key: 'InvestigationTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查提交时间',
      dataIndex: 'InvestigationSubTime',
      key: 'InvestigationSubTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '终止调查原因',
      dataIndex: 'RerminationRemark',
      key: 'RerminationRemark',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '调查状态',
      dataIndex:'InvestigationStatusName',
      key: 'InvestigationStatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return  <span style={{color: text == '待调查'? '#f5222d' : 'rgba(0, 0, 0, 0.85)'}}>{text}</span> 
      }
    },
    {
      title: '处理状态',
      dataIndex:'ProcessingStatusName',
      key: 'ProcessingStatusName',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        return  <span style={{color: text == '待调查'? '#f5222d' : 'rgba(0, 0, 0, 0.85)'}}>{text}</span> 
      }
    },
    {
      title: '处理办法',
      dataIndex:'ProcessedMethod',
      key: 'ProcessedMethod',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '处理人',
      dataIndex:'ProcessedByName',
      key: 'ProcessedByName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '处理填写时间',
      dataIndex:'ProcessedTime',
      key: 'ProcessedTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 280,
      ellipsis: true,
      fixed:'right',
      render: (text, record,index) => {
        return <> 
             <a onClick={()=>detail(record)}>详细</a>  
             {record.IsInvestigator&&<> <Divider type="vertical" /><a onClick={()=>handle(record)}>处理</a></>}
             {record.IsProcessedBy&&<> <Divider type="vertical" /><a onClick={()=>investigate(record)}>调查</a>
        <Popover visible={popVisible} placement='left' title={'终止调查'} trigger="click"
          overlayStyle={{ width: 400 }}
          content={
            <Form
              name="basic2"
              form={form2}
              onFinish={(values)=>terminaInvestiga(values,record)}
            >
              <Form.Item label="终止调查原因" name="categoryNum" rules={[{ required: true, message: '请输入终止调查原因！' }]} >
                <Input.TextArea  rows={2}  placeholder='请输入' allowClear />
              </Form.Item>
              <Row align='end'>
                <Button onClick={() => { setPopVisible(false) }} style={{ marginRight: 8 }} >
                  取消
                </Button>
                <Button type="primary" htmlType='submit' loading={false}>
                  保存
                  </Button>
              </Row>
            </Form>
          }
          > 
          <Divider type="vertical" /><a onClick={()=>{setPopVisible(true);setPopVisible2(false)}}>终止调查</a>
        </Popover>
        <Popover visible={popVisible2} placement='left' title={'任务转发'} trigger="click"
          overlayStyle={{ width: 400 }}
          content={
            <Form
              name="basic3"
              form={form3}
              onFinish={(values)=>forward(values,record)}
            >
              <Form.Item label="转发人" name="categoryNum" rules={[{ required: true, message: '请选择转发人！' }]} >
                <UserList />
              </Form.Item>
              <Row align='end'>
                <Button onClick={() => { setPopVisible2(false)}} style={{ marginRight: 8 }} >
                  取消
                </Button>
                <Button type="primary" htmlType='submit' loading={false}>
                  保存
                  </Button>
              </Row>
            </Form>
          }>
            <Divider type="vertical" /> <a  onClick={()=>{setPopVisible2(true);setPopVisible(false) }}>转发</a>
        </Popover>
        </>}
             </>
               
    }
    }
  ];

  const largeRegionChange = (value)=>{
    form.setFieldsValue({province:undefined})
    const data = value? provinceAllList.filter(item=>item.ID == value ) : provinceAllList
    setProvincelist(data)
  }
  const largeRegionChange2 = (value)=>{
    formAll.setFieldsValue({province:undefined})
    const data = value? provinceAllList.filter(item=>item.ID == value ) : provinceAllList
    setProvincelist2(data)
  }
  
  const terminaInvestiga = (value,row) => {
    console.log(value,row)

  }
  const forward = (value,row)=>{
   console.log(value,row)
  }
  const [data, setData] = useState([1])

  const [investigateVisible, setInvestigateVisible] = useState(false)
  const investigate = (row) => {
    setInvestigateVisible(true)
    setData(row)

  }
  const [handleVisible, setHandleVisible] = useState(false)
  const [handleData, setHandleData] = useState([1])
  const handle = (row) =>{
    setHandleVisible(true)
    setData(row)
  }
  const [detailVisible, setDetailVisible] = useState(false)

  const detail = (row)=>{
    setDetailVisible(true)
    setData(row)
  }
  const onFinish = async (type,PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = type==1? await form.validateFields() : await formAll.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
        type:type,
        allData:type==2? 1 : undefined
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
  const handleTableChange =  (PageIndex, PageSize) => { //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(1, PageIndex, PageSize, queryPar)
  }

  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 =  (PageIndex, PageSize) => { //分页
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    onFinish(1, PageIndex, PageSize, queryPar2)
  }
   const exports = (type)=>{
    props.dispatch({
      type: `${namespace}/ExportSatisfactionSurvey`,
      payload: {
        ...queryPar,
        type:type
      }
    });
   }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { setPageIndex(1);setPageSize(20); onFinish(1,1, 20) }}
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
            <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); setPageIndex(1); setPageSize(20); onFinish(1,1, 20) }}  >
              重置
         </Button>
         <Button  style={{ marginRight: 8}}  icon={<ExportOutlined />} loading={exportLoading} onClick={() => {exports(1) }}>
              导出
         </Button>
           <SetUserListBtn type={4} text='配置助理清单' />
            <Button type="primary" onClick={viewAllData}>
              查看所有数据
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  const searchComponents2 = () => {
    return <Form
      form={formAll}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { setPageIndex2(1);setPageSize2(20); onFinish(2,1, 20) }}
    >
      <Row align='middle'>
      <Col span={8}>
        <Spin size='small' spinning={largeRegionListLoading}   className='formItemSpinSty'>
          <Form.Item name='serviceAreaCode' label='服务大区'>
             <Select placeholder='请选择' onChange={largeRegionChange2} allowClear>
             {largeRegionList.map(item=><Option value={item.ID}>{item.LargeRegion}</Option>)}
             </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
          <Spin size='small' spinning={largeRegionListLoading}   className='formItemSpinSty'>
          <Form.Item name='province' className='minWidth' label='省份' >
             <Select placeholder='请选择' allowClear>
              {provinceList2.map(item=><Option value={item.RegionCode}>{item.RegionName}</Option>)}
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
          <Form.Item name='investigator' className='minWidth'  label='调查人' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='investigation' label='调查状态' >
            <Select placeholder='请选择' allowClear>
               <Option value={1}>待调查</Option>
               <Option value={2}>调查结束</Option>
               <Option value={3}>调查终止</Option>
             </Select>
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='processingStatus' label='处理状态' >
            <Select placeholder='请选择' allowClear>
               <Option value={1}>待处理</Option>
               <Option value={2}>已处理</Option>
             </Select>
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='time' label='调查日期' >
          <RangePicker 
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={tableLoading}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} onClick={() => { formAll.resetFields(); setPageIndex2(1); setPageSize2(20); onFinish(2,1, 20) }}  >
              重置
         </Button>
         <Button  style={{ marginRight: 8}}  icon={<ExportOutlined />} loading={exportLoading2} onClick={() => {exports(2) }}>
              导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }


  const ProcessResultsComponents = ({data}) => {
    return <Form className='detailForm'>
     <TitleComponents simpleSty text='处理结果' key='1' height={16} style={{ fontSize:16 }} />
      <div>
              <Row>
                <Col span={24}>
                    <Form.Item label='处理办法'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='处理人'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='处理填写时间'>
                   </Form.Item> 
                </Col>
              </Row>
      </div>
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
            onRow={(record, index) => ({
              onClick: event => {
                console.log(11111)
              },
            })}
          />
        </Card>
        <HandleModal visible={handleVisible}  data={data}  onCancel={() => { setHandleVisible(false) }}/>
           <InvestigateModal   visible={investigateVisible}  data={data}  onCancel={() => { setInvestigateVisible(false) }}/>
        <Modal
            visible={detailVisible}
            title={'调查'}
            onCancel={() => { setDetailVisible(false)}}
            destroyOnClose
            wrapClassName={`spreadOverModal ${styles.modalSty}`}
            mask={false}
          >
          <DispatchDetails data={data}/>
          <InvestigaContent data={data}/> 
          <ProcessResultsComponents data={data}/>
          </Modal>
          <Modal
            visible={viewAllVisible}
            title={'查看满意度调查数据'}
            onCancel={() => { setViewAllVisible(false)}}
            destroyOnClose
            wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
            mask={false}
            footer={null}
          >
          {searchComponents2()}
          <SdlTable
            style={{ marginTop: 6 }}
            resizable
            loading={tableLoading2}
            bordered
            dataSource={tableDatas2}
            columns={columns}
            pagination={{
              total: tableTotal2,
              pageSize: pageSize2,
              current: pageIndex2,
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: handleTableChange2,
            }}
            onRow={(record, index) => ({
              onClick: event => {
                console.log(record)
              },
            })}
          />
          </Modal>
          
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);