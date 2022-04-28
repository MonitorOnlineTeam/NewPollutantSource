
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
  tableDatas: supervisionAnalySumm.inspectorSummaryList,
  tableLoading: loading.effects[`${namespace}/getInspectorSummaryList`],
  inspectorTypeloading: loading.effects[`${namespace}/getInspectorTypeCode`],
  exportLoading: loading.effects[`${namespace}/exportLoading`],
  inspectorCodeList:supervisionAnalySumm.inspectorCodeList,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getInspectorSummaryList: (payload,callback) => { // 列表
      dispatch({
        type: `${namespace}/getInspectorSummaryList`,
        payload: payload,
        callback:callback,
      })
    },
    getInspectorCodeList: (payload) => { // 督查类别
      dispatch({
        type: `${namespace}/getInspectorCodeList`,
        payload: payload,
      })
    },
  }
}
const Index = (props) => {

  const [form] = Form.useForm();

  const { tableDatas,tableLoading,exportLoading,inspectorCodeList, } = props;


  useEffect(() => {
    props.getInspectorCodeList({});
    onFinish();
  }, []);

  const values = form.getFieldsValue();
 
const [tableTitle,setTableTitle] = useState(<span style={{fontWeight:'bold',fontSize:16}}>{moment().format('YYYY年')}督查总结</span>)

  const columns = [
    {
    title: tableTitle,
    align: 'center',
    children:[
    {
      title: '序号',
      align: 'center',
      render:(text,record,index)=>{
        return index + 1
      }
    },
    {
      title: '督查人员',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
      render: (value, record, index) => {
        let obj = {
          children: <div>{value}</div>,
          props: { rowSpan: record.count},
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
      dataIndex: 'dataTime',
      key: 'dataTime',
      align: 'center',
      render: (value, record, index) => {
        let obj = {
          children: <div>{value}</div>,
          props: { rowSpan: record.count},
        };
        return obj;
      }
    },
    {
      title: '督查套数',
      dataIndex: 'pointCount',
      key: 'pointCount',
      align: 'center',
    },
    {
      title: '原则性问题数量',
      dataIndex: 'principleProblemNum',
      key: 'principleProblemNum',
      align: 'center',
    },
    {
      title: '严重问题数量',
      dataIndex: 'importanProblemNum',
      key: 'importanProblemNum',
      align: 'center',
    },
    {
      title: '一般问题数量',
      dataIndex: 'commonlyProblemNum',
      key: 'commonlyProblemNum',
      align: 'center',
    },
    {
      title: '原则及重点问题描述',
      align: 'center',
      children:[
        {
          title: '量程一致性问题数量',
          dataIndex: 'rangeNum',
          key: 'rangeNum',
          align: 'center',
        },
        {
          title: '数据一致性问题数量',
          dataIndex: 'dataNum',
          key: 'dataNum',
          align: 'center',
        },
        {
          title: '参数一致性问题数量',
          dataIndex: 'paramNum',
          key: 'paramNum',
          align: 'center',
        },
      ]

    }
  ]
}]

 


  const onFinish = async () => {  //查询
    try {
      const values = await form.validateFields();
      props.getInspectorSummaryList({
        ...values,
        BeginTime: type==3?  values.time&&moment(values.time[0]).format('YYYY-MM-DD 00:00:00') :   type ==1? values.time&&moment(values.time).format('YYYY') : values.time&&moment(values.time).format('YYYY-MM'),
        EndTime:  type==3? values.time&&moment(values.time[1]).format('YYYY-MM-DD 23:59:59') : undefined,
        time:undefined,
      },()=>{
        if(type==1){
          setTableTitle(<span style={{fontWeight:'bold',fontSize:16}}>{moment(values.time).format('YYYY年')}督查总结</span>)
        }else if(type==2){
          setTableTitle(<span style={{fontWeight:'bold',fontSize:16}}>{moment(values.time).format('YYYY年MM月')}督查总结</span>)
        }else{
          setTableTitle(<span style={{fontWeight:'bold',fontSize:16}}>{moment(values.time[0]).format('YYYY年MM月DD日') } ~ {moment(values.time[1]).format('YYYY年MM月DD日')}督查总结</span>)
        }
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  


  const exports = () =>{

  }
 
  const [type,setType] = useState(1)
  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'DataType') {
        setType(hangedValues.DataType)
        if(hangedValues.DataType==3){
          form.setFieldsValue({ time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day")] })
        }else{
          form.setFieldsValue({ time:  moment() })
        }

    }
  }


  return (
    <div className={styles.analysisSummarySty}>
      <Card
        title={
          <Form
            form={form}
            name="advanced_search"
            onFinish={() => { onFinish() }}
            layout='inline'
            initialValues={{
              DataType:1,
              time: moment(),
            }}
            className={styles.queryForm}
            onValuesChange={onValuesChange}
          >
            <Form.Item label='统计方式' name='DataType'>
              <Select placeholder='请选择' style={{ width: 150}}>
                <Option value={1}>按年统计</Option>
                <Option value={2}>按月统计</Option>
                <Option value={3}>按日统计</Option>
              </Select>
            </Form.Item>
          {type==1?  <Form.Item label='统计年份' name='time' >
              <DatePicker picker="year" style={{ width: 150}} allowClear={false}/>
            </Form.Item>
             :
             type==2 ?
            <Form.Item label='统计月份' name='time' >
              <DatePicker picker="month" style={{ width: 150}}  allowClear={false}/>
            </Form.Item>
            :
            <Form.Item label='统计日期' name='time' >
            <RangePicker_
              allowClear={false}
              style={{ width: 386}}
              format="YYYY-MM-DD HH:mm:ss"
              showTime="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
        }
            <Spin spinning={false  } size='small' style={{ top: -9 }}>
              <Form.Item label='督查类别' name="InspectorType" >
               <Select placeholder='请选择' style={{ width: 150}} allowClear    showSearch optionFilterProp="children">
              {
               inspectorCodeList&&inspectorCodeList[0]&&inspectorCodeList.map(item => {
                  return <Option key={item.ChildID} value={item.ChildID} >{item.Name}</Option>
                })
              }
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
          </Form>}>
        <SdlTable
          loading={tableLoading}
          bordered
          rowClassName={null}
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