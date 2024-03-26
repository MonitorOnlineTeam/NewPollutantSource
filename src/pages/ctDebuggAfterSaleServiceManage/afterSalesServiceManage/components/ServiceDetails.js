/**
 * 功  能：服务详情
 * 创建人：jab
 * 创建时间：2024.03
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin } from 'antd';
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
import styles from "@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/style.less"
import Cookie from 'js-cookie';
import Detail from '@/pages/ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery/detail'
const { Option } = Select; 

const namespace = 'ctAfterSalesServiceManagement'


const dvaPropsData = ({ loading, ctAfterSalesServiceManagement, global, }) => ({
  tableLoading: loading.effects[`${namespace}/GetServiceDispatchForAnalysis`],
  tableDatas: ctAfterSalesServiceManagement.serviceDispatchForAnalysisList,
  tableTotal: ctAfterSalesServiceManagement.serviceDispatchForAnalysisTotal,
  queryPar:ctAfterSalesServiceManagement.serviceDispatchForAnalysisQueryPar,
  configInfo: global.configInfo,
  exportLoading: loading.effects[`${namespace}/ExportServiceDispatchForAnalysis`],
  largeRegionListLoading: loading.effects[`${namespace}/GetLargeRegionList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetLargeRegionList: (payload,callback) => { //服务大区
        dispatch({
          type: `${namespace}/GetLargeRegionList`,
          payload: payload,
          callback:callback,
        })
      },
    GetServiceDispatchForAnalysis: (payload) => { //派单信息列表
      dispatch({
        type: `${namespace}/GetServiceDispatchForAnalysis`,
        payload: payload,
      })
    },
    ExportServiceDispatchForAnalysis: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportServiceDispatchForAnalysis`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();

  const [expand, setExpand] = useState(true);




  const {serviceQueryPar,queryPar, tableDatas, tableTotal,  tableLoading, exportLoading,type,  } = props;

  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceList, setProvincelist] = useState([]);
  const [provinceAllList, setProvinceAlllist] = useState([]);

  useEffect(() => {
    props.GetLargeRegionList({},(res)=>{
        setLargeRegionList(res)
        const data = [];
         res.map(item=>{
          if(item.ChildList?.[0]){
            item.ChildList.map(childListItem=>{
              data.push(childListItem)
            })
          }
         
        })
        const currentProvinceData = data.filter(item=>item.ID == serviceQueryPar.serviceAreaCode)
        setProvincelist(currentProvinceData)
        setProvinceAlllist(data)
        form.setFieldsValue({...serviceQueryPar})
        onFinish(pageIndex, pageSize);

    })

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
      title: '合同类型',
      dataIndex: 'ProjectType',
      key: 'ProjectType',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '最终用户',
      dataIndex: 'CustomEnt',
      key: 'CustomEnt',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目所在省',
      dataIndex: 'Province',
      key: 'Province',
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
      title: '服务工程师',
      dataIndex: 'WorkerName',
      key: 'WorkerName',
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
      title: '离开现场时间',
      dataIndex: 'CommitDate',
      key: 'CommitDate',
      align: 'center',
      ellipsis: true,
    },
    
    {
        title: '工作时长（小时）',
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
    props.ExportServiceDispatchForAnalysis({
      ...queryPar,
      PageIndex:undefined,
      PageSize:undefined
    })
  };


  const onFinish = async (PageIndex, PageSize,queryPar) => {  //查询

    try {
      const values =   await form.validateFields();
      props.GetServiceDispatchForAnalysis(queryPar?{...queryPar, PageIndex: PageIndex, PageSize: PageSize,} : {
        ...values,
        bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
        analysisType: type,
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


  const largeRegionChange = (value)=>{
    form.setFieldsValue({province:undefined})
    const data = value? provinceAllList.filter(item=>item.ID == value ) : provinceAllList
    setProvincelist(data)
  }
  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => {setPageIndex(1); onFinish(1, pageSize) }}
      initialValues={{
        time:[moment().add(-6, 'months').startOf('day'), moment().endOf('day')]
      }}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='num' className='minWidth3' label='派工单号'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='projectCode' label='合同编号' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item name='itemCode'  label='立项号' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='customEnt' className='minWidth3'  label='最终用户' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        {expand && <> 
            <Col span={8}>
          <Form.Item name='serviceAreaCode' label='服务大区' >
            {props.largeRegionListLoading?
            <Spin size='small'/>
             :
             <Select placeholder='请选择' onChange={largeRegionChange} allowClear>
             {largeRegionList.map(item=><Option value={item.ID}>{item.LargeRegion}</Option>)}
             </Select>
            }
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='province' className='minWidth4' label='省份' >
          {props.largeRegionListLoading?
            <Spin size='small'/>
             :
             <Select placeholder='请选择' allowClear>
             {provinceList.map(item=><Option value={item.RegionCode}>{item.RegionName}</Option>)}
             </Select>
            }
          </Form.Item>
        </Col>
          <Col span={8}>
            <Form.Item name='time' label='离开现场时间' >
              <RangePicker style={{ width: '100%' }}
                // showTime={{ format: 'YYYY-MM-DD HH:mm:ss', defaultValue: [moment(' 00:00:00', ' HH:mm:ss'), moment(' 23:59:59', ' HH:mm:ss')] }}
              />
            </Form.Item>
          </Col>
          </>}
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
            {/* <a onClick={() => { setExpand(!expand); }} >
              {expand ? <>收起 <UpOutlined /></> : <>展开 <DownOutlined /></>}
            </a> */}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={styles.dispatchQuerySty}>
        {searchComponents()}
          <SdlTable
            style={{marginTop:6}}
            resizable
            loading={tableLoading}
            bordered
            scroll={{ y: expand ? 'calc(100vh - 430px)' : 'calc(100vh - 350px)' }}
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
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);