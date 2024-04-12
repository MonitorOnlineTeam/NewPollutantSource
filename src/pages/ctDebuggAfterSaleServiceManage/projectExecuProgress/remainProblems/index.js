/**
 * 功  能：项目执行进度 遗留问题
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
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
import {  permissionButton } from '@/utils/utils';
const { Option } = Select;

const namespace = 'remainProblems'




const dvaPropsData = ({ loading, remainProblems, global, }) => ({
  tableLoading:  remainProblems.tableLoading,
  tableDatas: remainProblems.tableDatas,
  tableTotal: remainProblems.tableTotal,
  queryPar: remainProblems.queryPar,
  tableLoading2:  remainProblems.tableLoading2,
  tableDatas2: remainProblems.tableDatas2,
  tableTotal2: remainProblems.tableTotal2,
  queryPar2: remainProblems.queryPar2,
  exportLoading: remainProblems.exportLoading,
  exportLoading2: remainProblems.exportLoading2,
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

  const [form2] = Form.useForm();

  const [formAll] = Form.useForm();

   
  

  const { queryPar, tableDatas, tableTotal, tableLoading,queryPar2, tableDatas2, tableTotal2, tableLoading2,exportLoading,exportLoading2, } = props;


  const [remainProblemsBtn, setRemainProblemsBtn] = useState(true);

  useEffect(() => {
    const buttonList = permissionButton(props.match.path)
    buttonList.map(item => {
      switch (item) {
        case 'remainProblems': setRemainProblemsBtn(true); break;
      }
    })
    onFinish(pageIndex, pageSize);

  }, []);

  const [popVisible, setPopVisible] = useState(false);
 
  let columns2 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex - 1) * pageSize;
      }
    },
    {
      title: '合同编号',
      dataIndex: 'CarNum',
      key: 'CarNum',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '立项号',
      dataIndex: 'VehicleType',
      key: 'VehicleType',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'BuyDate',
      key: 'BuyDate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '问题描述',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '问题附件',
      dataIndex: 'CarClass',
      key: 'CarClass',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '问题状态',
      dataIndex: 'AssetStatus',
      key: 'AssetStatus',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '解决人',
      dataIndex: 'AffiliatedUnit',
      key: 'AffiliatedUnit',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '解决问题时间',
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
      title: '创建人',
      dataIndex: 'CarManager',
      key: 'CarManager',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CarManager',
      key: 'CarManager',
      align: 'center',
      ellipsis: true,
    },
  ];
  let columns = [
    ...columns2,
    {
      title: <span>操作</span>,
      align: 'center',
      fixed: 'right',
      width: 60,
      ellipsis: true,
      render: (text, record) => {
        return (
          <Tooltip title="编辑">
            <Popover visible={popVisible} placement='left' title={'编辑'} trigger="click"
              overlayStyle={{ width: 400 }}
              content={
                <Form
                  name="basic2"
                  form={form2}
                  // onFinish={(values) => terminaInvestiga(values, record)}
                >
                  <Form.Item label="解决人" name="rerminationRemark" rules={[{ required: true, message: '请输入解决人！' }]} >
                    <Input placeholder='请输入' allowClear />
                  </Form.Item>
                  <Form.Item label="解决时间" name="rerminationRemark2" rules={[{ required: true, message: '请选择解决时间！' }]} >
                    <DatePicker />
                  </Form.Item>
                  
                  <Row align='end'>
                    <Button onClick={() => { setPopVisible(false) }} style={{ marginRight: 8 }} >
                      取消
                </Button>
                    <Button type="primary" htmlType='submit' loading={submitRerminaLoading}>
                      提交
                  </Button>
                  </Row>
                </Form>
              }
            >
              <a  onClick={() => { setPopVisible(true); form2.resetFields();}}><EditIcon /></a> 
            </Popover>
          </Tooltip>
        );

      }
    },
  ];
  const [viewAllVisible,setViewAllVisible] = useState(false)

  const viewAllData = ()=>{
    setViewAllVisible(true)
    formAll.resetFields()
    setPopVisible(false)
    setPopVisible2(false)
    onFinish(2,pageIndex2, pageSize2);
  }
  const exports = () => {
    props.dispatch({
      type: `${namespace}/ExportCarList`,
      payload: {
        ...queryPar,
        type:type
      }
    });
  };


  const onFinish = async (type,PageIndex, PageSize, queryPar) => {  //查询

    try {
      const values = type==1? await form.validateFields() : await formAll.validateFields();
      const par = queryPar ? { ...queryPar, PageIndex: PageIndex, PageSize: PageSize, } : {
        ...values,
        bTime: values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00'),
        eTime: values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        pageIndex: PageIndex,
        pageSize: PageSize,
        type:type,
        allData:type==1?2 : 1,
      }
      props.dispatch({
        type: `${namespace}/GetSatisfactionSurveyList`,
        payload: {
          ...par,
        },
        callback:()=>{
            if(type==1){
             setPopVisible(false)
            }
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

  
  const [pageIndex2, setPageIndex2] = useState(1)
  const [pageSize2, setPageSize2] = useState(20)
  const handleTableChange2 =  (PageIndex, PageSize) => { //分页
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    onFinish(1, PageIndex, PageSize, queryPar2)
  }

  const searchComponents = (type) => {

    let dataLoading, exportDataLoading,resetData;
   
    if( type==1){
      dataLoading = tableLoading; exportDataLoading = exportLoading;
      resetData = ()=>{setPageIndex(1); setPageSize(20); onFinish(1,1, 20) }
    }else{
      dataLoading = tableLoading2; exportDataLoading = exportLoading2;
      resetData = ()=>{setPageIndex2(1); setPageSize2(20); onFinish(2,1, 20) }
    }

    return <Form
      form={form}
      name="advanced_search"
      className={'ant-advanced-search-form'}
      onFinish={() => { resetData()}}
    >
      <Row align='middle'>
        <Col span={8}>
          <Form.Item name='carManager' label='派单工号'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='carNum' label='合同编号' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='status' label='立项号'  className='minWidth'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='useDepartment' label='项目名称'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='useDepartment' label='进度状态'>
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='useDepartment' label='创建时间'>
            <RangePicker_ style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col span={8} >
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={dataLoading}>
              查询
         </Button>
            <Button style={{ margin: '0 8px' }} loading={dataLoading} onClick={() => { type==1? form.resetFields() : form.resetFields(); resetData()}}  >
              重置
         </Button>
         {remainProblemsBtn&& <Button style={{ marginRight: 8 }}  type="primary" onClick={viewAllData}>
              全部遗留问题
            </Button>}
            <Button icon={<ExportOutlined />} loading={exportDataLoading} style={{ marginRight: 8 }} onClick={() => { exports() }}>
              导出
         </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  }
  return (
    <div className={`${styles.remainProblemsSty} queryCriterTitleSty`}>
      <BreadcrumbWrapper>
        <Card title={searchComponents(1)}>
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
            visible={viewAllVisible}
            title={'查看满意度调查数据'}
            onCancel={() => { setViewAllVisible(false)}}
            destroyOnClose
            wrapClassName={`spreadOverModal ${styles.detailModalSty}`}
            mask={false}
            footer={null}
          >
          {searchComponents(2)}
          <SdlTable
            style={{ marginTop: 6 }}
            resizable
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
          </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);