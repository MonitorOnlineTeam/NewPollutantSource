/**
 * 功  能：  运维督查KPI
 * 创建人：jab
 * 创建时间：2023.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Spin, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Progress, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RollbackOutlined, FileProtectOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList';
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import { Resizable, ResizableBox } from 'react-resizable';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RoleList from '@/components/RoleList'
import OperationCompanyList from '@/components/OperationCompanyList'
const { TextArea } = Input;
const { Option } = Select;
const namespace = 'operatioSupervisionKpi'





const dvaPropsData = ({ loading, operatioSupervisionKpi }) => ({
  tableDatas: operatioSupervisionKpi.tableDatas,
  tableTotal: operatioSupervisionKpi.tableTotal,
  tableLoading: operatioSupervisionKpi.tableLoading,
  exportLoading: operatioSupervisionKpi.exportLoading,
  tableDatas2: operatioSupervisionKpi.tableDatas2,
  tableTotal2: operatioSupervisionKpi.tableTotal2,
  tableLoading2: operatioSupervisionKpi.tableLoading2,
  exportLoading2: operatioSupervisionKpi.exportLoading2,
  tableDatas3: operatioSupervisionKpi.tableDatas3,
  tableTotal3: operatioSupervisionKpi.tableTotal3,
  tableLoading3: operatioSupervisionKpi.tableLoading3,
  exportLoading3: operatioSupervisionKpi.exportLoading3,
  queryPar: operatioSupervisionKpi.queryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getParamKPIList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getParamKPIList`,
        payload: payload,
      })
    },
    exportParamKPIList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportParamKPIList`,
        payload: payload,
      })
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();


  const {  tableDatas, tableTotal, tableLoading, exportLoading, queryPar, tableDatas2, tableTotal2, tableLoading2, exportLoading2, tableDatas3, tableTotal3, tableLoading3, exportLoading3, } = props;
  useEffect(() => {
    onFinish(null, 1);
  }, []);



  const [largeRegionCode, setLargeRegionCode] = useState()
  const [largeregionName, setLargeRegionName] = useState()

  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '大区',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      width:'auto',
      render: (text, record) => {
        const largeRegCode = record.largeRegionCode;
        return <a onClick={() => { setStaticType(2); setLargeRegionCode(largeRegCode);setLargeRegionName(text); onFinish({ ...queryPar, largeRegionCode: largeRegCode  }, 2) }}>{text}</a>
      }
    },
    {
      title: '运维督查KPI（平均分）',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      width:'auto',
    },

  ];
  const [regionCode, setRegionCode] = useState()
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '省份',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      width:'auto',
      render: (text, record, index) => {
        const regionCode = record.regionCode ? record.regionCode : largeRegionCode
        return <a onClick={() => { setStaticType(3); setRegionCode(regionCode);setEntCode();setPageIndex3(1);onFinish({ ...queryPar, regionCode: regionCode,pageIndex:pageIndex3,pageSize:pageSize3 }, 3) }}>{text}</a>
      }
    },
    {
      title: '运维督查KPI（平均分）',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      width:'auto',
    },
  ];
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        return (index + 1) + (pageIndex3 - 1) * pageSize3;
      }
    },
    {
      title: '省份',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
    },
    {
      title: '点位名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
    },
    {
      title: '排口类型',
      dataIndex: 'outputTypeName',
      key: 'outputTypeName',
      align: 'center',
    },
    {
      title: '运维人员',
      dataIndex: 'operationUserName',
      key: 'operationUserName',
      align: 'center',
    },
    {
      title: '关键参数核查分数',
      dataIndex: 'keyScore',
      key: 'keyScore',
      align: 'center',
    },
    {
      title: '现场督查分数',
      dataIndex: 'dcScore',
      key: 'dcScore',
      align: 'center',
    },
    {
      title: '运维督查KPI（平均分）',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
    },
  ];


  
  const [staticType, setStaticType] = useState(1)
  const onFinish = async (queryPar, staticType) => {  //查询
    try {
      const values = await form.validateFields();
      const par = queryPar ? { ...queryPar, staticType: staticType } :
        {
          ...values,
          beginTime: values.time && moment(values.time).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
          endTime: values.time && moment(values.time).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          time: undefined,
          staticType: staticType,
        }
      props.getParamKPIList({
        ...par,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }



  const [pageIndex3, setPageIndex3] = useState(1)
  const [pageSize3, setPageSize3] = useState(20)
  const handleTableChange3 = (PageIndex, PageSize) => { //企业 分页
    setPageIndex3(PageIndex)
    setPageSize3(PageSize)
    onFinish({...queryPar,regionCode: regionCode,entCode:entCode,pageIndex:PageIndex,pageSize:PageSize},3)
  }



  const exports = (queryPar, staticType) => { //导出
    props.exportParamKPIList({
      ...queryPar,
      staticType: staticType,
    })
  }
  const [entCode, setEntCode] = useState()
  const searchComponents = () => {
    return staticType == 1 ? <Form
      form={form}
      layout='inline'
      name="advanced_search"
      className={styles['ant-advanced-search-form']}
      onFinish={() => { setStaticType(1); onFinish(null, 1) }}
      initialValues={{
        time: moment(),
      }}
    >
      <Form.Item label="日期查询" name="time">
        <DatePicker   picker="month"/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType='submit' loading={tableLoading} style={{ marginRight: 8 }}>
          查询
       </Button>
        <Button icon={<ExportOutlined />} onClick={() => { exports(queryPar, 1) }} loading={exportLoading} style={{ marginRight: 6 }}>
          导出
            </Button>
      </Form.Item>
    </Form>
      :
      staticType == 2 ?
        <Form layout='inline'>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={() => { exports({ ...queryPar, largeRegionCode: largeRegionCode }, 2) }} loading={exportLoading2} style={{ marginRight: 6 }}>
              导出
      </Button>
            <Button icon={<RollbackOutlined />} onClick={() => { setStaticType(1) }} style={{ marginRight: 6 }}>
              返回
          </Button>
          </Form.Item>
        </Form>
        :
        <Form layout='inline'>
          <Form.Item >
            <EntAtmoList onChange={(value) => { onFinish({ ...queryPar, regionCode: regionCode, entCode: value }, 3);setEntCode(value); }} style={{ width: 260 }} />
          </Form.Item>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={() => { exports({ ...queryPar, regionCode: regionCode, entCode: entCode }, 3) }} loading={exportLoading3} style={{ marginRight: 5 }}>
              导出
          </Button>
            <Button icon={<RollbackOutlined />} onClick={() => { setStaticType(2); }} style={{ marginRight: 6 }}>
              返回
          </Button>
          </Form.Item>
        </Form>
  }
  return (
    <BreadcrumbWrapper>
      <div className={styles.equipmentManufacturListSty}>
        <Card title={searchComponents()}>
          {staticType == 1 ? <SdlTable
            loading={tableLoading}
            bordered
            resizable
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
          /> :
            staticType == 2 ? <SdlTable
              loading={tableLoading2}
              bordered
              resizable
              dataSource={tableDatas2}
              columns={columns2}
              pagination={false}
            /> :
              <SdlTable
                loading={tableLoading3}
                bordered
                resizable
                dataSource={tableDatas3}
                columns={columns3}
                pagination={{
                  total: tableTotal3,
                  pageSize: pageSize3,
                  current: pageIndex3,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: handleTableChange3,
                }}
              />
          }
        </Card>
      </div>
    </BreadcrumbWrapper>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);