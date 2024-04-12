/**
 * 功  能：通用管理 人员档案
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
const { Option } = Select; 

const namespace = 'personnelFiles'




const dvaPropsData = ({ loading, personnelFiles, global, }) => ({
  configInfo: global.configInfo,
  tableLoading:  loading.effects[`${namespace}/GetUserList`],
  tableDatas: personnelFiles.tableDatas,
  tableTotal: personnelFiles.tableTotal,
  queryPar:personnelFiles.queryPar,
  exportLoading: loading.effects[`${namespace}/ExportUserList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    GetUserList: (payload) => { //列表
      dispatch({
        type: `${namespace}/GetUserList`,
        payload: payload,
      })
    },
    ExportUserList: (payload) => { //导出
      dispatch({
        type: `${namespace}/ExportUserList`,
        payload: payload,
      })
    },
    GetCodList: (payload,callback) => { //岗位类别和行业属性
      dispatch({
        type: `ctCommon/GetCodList`,
        payload: payload,
        callback:callback,
      })
    },
  }
}
const Index = (props) => {



  const [form] = Form.useForm();





  const {queryPar, tableDatas, tableTotal,  tableLoading, exportLoading,  } = props;

  const [codList,setCodList] = useState([]) //岗位类别
  const [codLoading,setCodLoading] = useState(true) 

  const [codList2,setCodList2] = useState([])//行业属性
  const [codLoading2,setCodLoading2] = useState(true) 

  useEffect(() => {
    onFinish(pageIndex, pageSize);
    props.GetCodList({CodID:55},(res)=>{ 
      setCodList(res)
      setCodLoading(false)
    })
    props.GetCodList({CodID:56},(res)=>{
      setCodList2(res)
      setCodLoading2(false)
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
      title: '员工编号',
      dataIndex: 'UserAccount',
      key: 'UserAccount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'UserName',
      key: 'UserName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '部门名称',
      dataIndex: 'Department',
      key: 'Department',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '岗位类别',
      dataIndex: 'JobCategory',
      key: 'JobCategory',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '岗位名称',
      dataIndex: 'JobCategoryName',
      key: 'JobCategoryName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '行业属性',
      dataIndex: 'Attribute',
      key: 'Attribute',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '入职日期',
      dataIndex: 'DateTime',
      key: 'DateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '司龄',
      dataIndex: 'Year',
      key: 'Year',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '在职状态',
      dataIndex: 'Status',
      key: 'Status',
      align: 'center',
      ellipsis: true,
      render:(text)=>{
       return text=='离职'? <span className='red'>{text}</span> : text
      }
    },
  ];
  const exports =  () => {
    props.ExportUserList({
      ...queryPar,
      pageIndex:undefined,
      pageSize:undefined,
    })
  };


  const onFinish = async (PageIndex, PageSize,queryPar) => {  //查询

    try {
      const values =   await form.validateFields();
      props.GetUserList(queryPar?{...queryPar, pageIndex: PageIndex, pageSize: PageSize} : {
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
    onFinish(PageIndex, PageSize,props.queryPar)
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
            <Form.Item name='userAccount' label='员工编号'>
            <Input placeholder="请输入" allowClear />
            </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name='userName' label='姓名' >
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
         <Spin spinning={codLoading} size='small' className='formItemSpinSty'>
            <Form.Item name='jobCategory' label='岗位类别'>
             <Select placeholder='请选择' allowClear showSearch  optionFilterProp="children">
                {codList.map(item => <Option key={item.BaseCnName} value={item.BaseCnName}>{item.BaseCnName}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={8}>
        <Spin spinning={codLoading2} size='small' className='formItemSpinSty'>
            <Form.Item name='attribute' label='行业属性'>
            <Select placeholder='请选择' allowClear showSearch  optionFilterProp="children">
                {codList2.map(item => <Option key={item.BaseCnName} value={item.BaseCnName}>{item.BaseCnName}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
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
    <div className={`${styles.personnelFilesSty} queryCriterTitleSty`}>
      <BreadcrumbWrapper>
        <Card  title={searchComponents()}>
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
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);