
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography,Tag, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';


const { TextArea } = Input;
const { Option } = Select;

const namespace = 'supervisionAnalySumm'




const dvaPropsData = ({ loading, supervisionAnalySumm, global, common }) => ({
  tableDatas: supervisionAnalySumm.inspectorTypeItemList,
  tableTotal: supervisionAnalySumm.inspectorTypeItemListTotal,
  tableLoading: loading.effects[`${namespace}/getInspectorTypeItemList`],
  saveLoading: loading.effects[`${namespace}/addOrEditInspectorTypeItem`],
  inspectorTypeloading: loading.effects[`${namespace}/getInspectorTypeCode`],
  exportLoading: loading.effects[`${namespace}/exportLoading`],
  assessmentMethodList:supervisionAnalySumm.assessmentMethodList,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getInspectorTypeItemList: (payload) => { // 列表
      dispatch({
        type: `${namespace}/getInspectorTypeItemList`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {

  const [form] = Form.useForm();

  const { tableDatas, tableTotal,tableLoading,exportLoading, } = props;


  useEffect(() => {
    onFinish();
  }, []);






  const columns = [
   {
    title: <span style={{fontWeight:'bold',fontSize:14}}>111</span>,
    align: 'center',
    children:[
    {
      title: '序号',
      dataIndex: 'TypeNum',
      key: 'TypeNum',
      align: 'center',
      render:(text,record,index)=>{
        return index + 1
      }
    },
    {
      title: '督查人员',
      dataIndex: 'PollutantTypeName',
      key: 'PollutantTypeName',
      align: 'center',
      render: (value, record, index) => {
        let obj = {
          children: <div>{value}</div>,
          props: { rowSpan: record.col},
        };
        return obj;
      }
    },
    {
      title: '督查类别',
      dataIndex: 'InspectorTypeName',
      key: 'InspectorTypeName',
      align: 'center',
    },
    {
      title: '督查日期',
      dataIndex: 'AssessmentMethodName',
      key: 'AssessmentMethodName',
      align: 'center',
      render: (value, record, index) => {
        let obj = {
          children: <div>{value}</div>,
          props: { rowSpan: record.col},
        };
        return obj;
      }
    },
    {
      title: '督查套数',
      dataIndex: 'Fraction',
      key: 'Fraction',
      align: 'center',
    },
    {
      title: '原则性问题数量',
      dataIndex: 'Fraction',
      key: 'Fraction',
      align: 'center',
    },
    {
      title: '严重问题数量',
      dataIndex: 'Fraction',
      key: 'Fraction',
      align: 'center',
    },
    {
      title: '一般问题数量',
      dataIndex: 'Fraction',
      key: 'Fraction',
      align: 'center',
    },
    {
      title: '原则及重点问题描述',
      align: 'center',
      children:[
        {
          title: '量程一致性问题数量',
          dataIndex: 'Fraction',
          key: 'Fraction',
          align: 'center',
        },
        {
          title: '数据一致性问题数量',
          dataIndex: 'Fraction',
          key: 'Fraction',
          align: 'center',
        },
        {
          title: '参数一致性问题数量',
          dataIndex: 'Fraction',
          key: 'Fraction',
          align: 'center',
        },
      ]

    }
  ]
}

  ]


  const onFinish = async () => {  //查询
    try {
      const values = await form.validateFields();
      props.getInspectorTypeItemList({
        ...values,
      })


    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  


  const exports = () =>{

  }





  return (
    <div className={styles.analysisSummarySty}>
      <Card
        title={
          <Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish(pageIndex,pageSize) }}
            initialValues={{
            }}
            className={styles.queryForm}
          >
            <Row>
            <Form.Item label='统计方式' name='PollutantType'>
              <Select placeholder='请选择' allowClear style={{ width: 150}}>
                <Option value={2}>废气</Option>
                <Option value={1}>废水</Option>
              </Select>
            </Form.Item>
            <Form.Item label='统计年份' name='Status' style={{margin:'0 16px'}} >
              <DatePicker picker="year" style={{ width: 150}}/>
            </Form.Item>
            <Form.Item label='统计月份' name='Status' >
              <DatePicker picker="month" style={{ width: 150}}/>
            </Form.Item>
              </Row>

            <Row>
            <Form.Item label='统计日期' name='Status' >
            <RangePicker_
              style={{ width: 386}}
              allowClear={true}
              format="YYYY-MM-DD HH:mm:ss"
              showTime="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Spin spinning={false  } size='small' style={{ top: -9 }}>
              <Form.Item label='督查类别' name="InspectorType" style={{margin:'0 16px'}} >
               <Select placeholder='请选择' style={{ width: 150}} >
               {/* {
               operationInfoList.InspectorTypeList&&operationInfoList.InspectorTypeList.map(item => {
                  return <Option key={item.ChildID} value={item.ChildID} >{item.Name}</Option>
                })
              } */}
                 </Select>
              </Form.Item>
              </Spin>
            <Form.Item>
         
              <Button type="primary" loading={tableLoading} htmlType="submit">
                查询
          </Button>
              <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                重置
          </Button>
          <Button  icon={<ExportOutlined />} onClick={()=>{exports()}} loading={exportLoading}>
              导出
            </Button>
            </Form.Item>
            </Row>
          </Form>}>
        <SdlTable
          loading={tableLoading}
          bordered
          dataSource={tableDatas}
          columns={columns}
          scroll={{ y: 'calc(100vh - 500px)' }}
          pagination={false}
        />
      </Card>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);