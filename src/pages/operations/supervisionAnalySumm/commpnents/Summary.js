
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Tag, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
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
import SupervisionManager from '@/pages/operations/supervisionManager';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'supervisionAnalySumm'




const dvaPropsData = ({ loading, supervisionAnalySumm, global, common }) => ({
  tableDatas: supervisionAnalySumm.inspectorSummaryList,
  tableLoading: loading.effects[`${namespace}/getInspectorSummaryList`],
  inspectorTypeloading: loading.effects[`${namespace}/getInspectorTypeCode`],
  exportLoading: loading.effects[`${namespace}/exportInspectorSummaryList`],
  inspectorCodeList: supervisionAnalySumm.inspectorCodeList,
  tableLoading2: loading.effects[`${namespace}/getInspectorSummaryForRegionList`],
  exportLoading2: loading.effects[`${namespace}/exportInspectorSummaryForRegion`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },

    getInspectorCodeList: (payload) => { // 督查类别
      dispatch({
        type: `${namespace}/getInspectorCodeList`,
        payload: payload,
      })
    },
    getInspectorSummaryList: (payload, callback) => { // 列表
      dispatch({
        type: `${namespace}/getInspectorSummaryList`,
        payload: payload,
        callback: callback,
      })
    },
    exportInspectorSummaryList: (payload, callback) => { // 导出
      dispatch({
        type: `${namespace}/exportInspectorSummaryList`,
        payload: payload,
        callback: callback,
      })
    },
    getInspectorSummaryForRegionList: (payload, callback) => { // 列表 按行政区
      dispatch({
        type: `${namespace}/getInspectorSummaryForRegionList`,
        payload: payload,
        callback: callback,
      })
    },
    exportInspectorSummaryForRegion: (payload, callback) => { // 导出 按行政区
      dispatch({
        type: `${namespace}/exportInspectorSummaryForRegion`,
        payload: payload,
        callback: callback,
      })
    },
  }
}
const Index = (props) => {

  const [form] = Form.useForm();

  const { tableDatas, tableLoading, exportLoading, inspectorCodeList, tableLoading2, exportLoading2,} = props;


  useEffect(() => {
    props.getInspectorCodeList({});
  }, []);
  
  const values = form.getFieldsValue();

  const [tableTitle, setTableTitle] = useState(<span style={{ fontWeight: 'bold', fontSize: 16 }}>{moment().format('YYYY年')}督查总结</span>)

  const columns = [
    {
      title: tableTitle,
      align: 'center',
      children: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '督查人员',
          dataIndex: 'userName',
          key: 'userName',
          align: 'center',
          width: 100,
          render: (value, record, index) => {
            let obj = {
              children: <div>{value}</div>,
              props: { rowSpan: record.count },
            };
            return obj;
          }
        },
        {
          title: '督查类别',
          dataIndex: 'dataType',
          key: 'dataType',
          width: 100,
          align: 'center',
        },
        {
          title: '督查日期',
          dataIndex: 'dataTime',
          key: 'dataTime',
          align: 'center',
          width: 100,
          render: (value, record, index) => {
            let obj = {
              children: <div>{value}</div>,
              props: { rowSpan: record.count },
            };
            return obj;
          }
        },
        {
          title: '督查套数',
          dataIndex: 'pointCount',
          key: 'pointCount',
          align: 'center',
          width: 100,
        },
        {
          title: '原则性问题数量',
          dataIndex: 'principleProblemNum',
          key: 'principleProblemNum',
          align: 'center',
          width: 120,
        },
        {
          title: '严重问题数量',
          dataIndex: 'importanProblemNum',
          key: 'importanProblemNum',
          align: 'center',
          width: 100,
        },
        {
          title: '一般问题数量',
          dataIndex: 'commonlyProblemNum',
          key: 'commonlyProblemNum',
          align: 'center',
          width: 100,
        },
        {
          title: '原则及重点问题描述',
          align: 'center',
          children: [
            {
              title: '量程一致性问题数量',
              dataIndex: 'rangeNum',
              key: 'rangeNum',
              align: 'center',
              width: 140,
            },
            {
              title: '数据一致性问题数量',
              dataIndex: 'dataNum',
              key: 'dataNum',
              align: 'center',
              width: 140,
            },
            {
              title: '参数一致性问题数量',
              dataIndex: 'paramNum',
              key: 'paramNum',
              align: 'center',
              width: 140,
            },
          ]

        }
      ]
    }]


  const columns2 = [
    {
      title: tableTitle,
      align: 'center',
      children: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '省份',
          dataIndex: 'RegionName',
          key: 'RegionName',
          align: 'center',
          width: 100,
          render: (text, record, index) => {
           return <a onClick={()=>{ regDetail(record)}}>{text}</a>
          }
        },
        {
          title: '督查套数',
          dataIndex: 'InspectorNum',
          key: 'InspectorNum',
          align: 'center',
          width: 100,
        },
        {
          title: '原则性问题',
          dataIndex: 'PrincipleProblemNum',
          key: 'PrincipleProblemNum',
          align: 'center',
          width: 120,
        },
        {
          title: '重点问题',
          dataIndex: 'ImportanProblemNum',
          key: 'ImportanProblemNum',
          align: 'center',
          width: 100,
        },
        {
          title: '整改完成数量',
          dataIndex: 'ImportanProblemCompleteNum',
          key: 'ImportanProblemCompleteNum',
          align: 'center',
          width: 100,
        },
        {
          title: '重点问题整改率',
          dataIndex: 'ImportanProblemCompleteRate',
          key: 'ImportanProblemCompleteRate',
          align: 'center',
          width: 140,
          render: (text, record, index) => {
            return text? text + '%' : ''
           }
        },
        {
          title: '一般问题',
          dataIndex: 'CommonlyProblemNum',
          key: 'CommonlyProblemNum',
          align: 'center',
          width: 140,
        },
        {
          title: '整改完成数量',
          dataIndex: 'CommonlyProblemCompleteNum',
          key: 'CommonlyProblemCompleteNum',
          align: 'center',
          width: 140,
        },
        {
          title: '一般问题整改率',
          dataIndex: 'CommonlyProblemCompleteRate',
          key: 'CommonlyProblemCompleteRate',
          align: 'center',
          width: 140,
          render: (text, record, index) => {
            return text? text + '%' : ''
           }
        },
        {
          title: '平均分',
          dataIndex: 'Average',
          key: 'Average',
          align: 'center',
          width: 140,
        },
      ]
    }]
  
  const [dateTitle, setDateTitle] = useState()
  const [dateTime, setDateTime] = useState([])
  const [regDetailPar,setRegDetailPar] = useState()
  const [regDetailVisible,setRegDetailVisible] = useState(false)
  const [regDetailTitle,setRegDetailTitle] = useState(false)

  const regDetail = (record) =>{
    setRegDetailVisible(true)
    setRegDetailTitle(`${record.RegionName}系统设施核查（${dateTitle}）`)
    setRegDetailPar({regionCode:record.RegionCode,time:dateTime})
  }
  const onFinish = async () => {  //查询
    try {
      const values = await form.validateFields();

      const par = { 
        ...values,
        BeginTime: type == 3 ? values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00') : type == 1 ? values.time && moment(values.time).format('YYYY-01-01 00:00:00') : values.time && moment(values.time).format('YYYY-MM-01 00:00:00'),
        EndTime: type == 3 ? values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59') : undefined,
        time: undefined,
      }
      if(radioType==1){ //按人员统计
       props.getInspectorSummaryList({
        ...par
       }, () => {
        if (type == 1) {
          setTableTitle(<span style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(values.time).format('YYYY年')}督查总结</span>)
        } else if (type == 2) {
          setTableTitle(<span style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(values.time).format('YYYY年MM月')}督查总结</span>)
        } else {
          setTableTitle(<span style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(values.time[0]).format('YYYY年MM月DD日')} ~ {moment(values.time[1]).format('YYYY年MM月DD日')}督查总结</span>)
        }
       })
     }else{ //按省统计
      props.getInspectorSummaryForRegionList({
        ...par
      }, () => {
        if (type == 1) {
          setTableTitle(<span style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(values.time).format('YYYY年')}督查总结</span>)
          setDateTitle(moment(values.time).format('YYYY年'))
          setDateTime(values.time&&[moment(moment(values.time).startOf('year')).startOf('d'),moment(moment(values.time).endOf('year')).endOf('d')])
        } else if (type == 2) {
          setTableTitle(<span style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(values.time).format('YYYY年MM月')}督查总结</span>)
          setDateTitle(moment(values.time).format('YYYY-MM'))
          setDateTime(values.time&&[moment(moment(values.time).startOf('month')).startOf('d'),moment(moment(values.time).endOf('month')).endOf('d')])
        } else {
          setTableTitle(<span style={{ fontWeight: 'bold', fontSize: 16 }}>{moment(values.time[0]).format('YYYY年MM月DD日')} ~ {moment(values.time[1]).format('YYYY年MM月DD日')}督查总结</span>)
          setDateTitle(moment(values.time[0]).format('YYYY-MM-DD')+'至'+moment(values.time[1]).format('YYYY-MM-DD'))
          setDateTime(values.time[0]&&values.time[1]&&[values.time[0].startOf('d'),values.time[1].endOf('d')])
        }
      })
    }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }



  const exports = async () => {
    const values = await form.validateFields();
    const par = {
      ...values,
      BeginTime: type == 3 ? values.time && moment(values.time[0]).format('YYYY-MM-DD 00:00:00') : type == 1 ? values.time && moment(values.time).format('YYYY-01-01 00:00:00') : values.time && moment(values.time).format('YYYY-MM-01 00:00:00'),
      EndTime: type == 3 ? values.time && moment(values.time[1]).format('YYYY-MM-DD 23:59:59') : undefined,
      time: undefined,
      }
    if(radioType==1){ //按人员统计
      props.exportInspectorSummaryList(par)
     }else{ //按省统计
      props.exportInspectorSummaryForRegion(par)
    }
  };

  

  const [type, setType] = useState(1)
  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'DateType') {
      setType(hangedValues.DateType)
      if (hangedValues.DateType == 3) {
        form.setFieldsValue({ time: [moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day")] })
      } else {
        form.setFieldsValue({ time: moment() })
      }

    }
  }
  const [radioType, setRadioType] = useState(1);
  const onRadioChange = (e) => {
    setRadioType(e.target.value);
  }
  useEffect(()=>{
    onFinish()
  },[radioType])

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
              DateType: 1,
              time: moment(),
            }}
            className={styles.queryForm}
            onValuesChange={onValuesChange}
          >
            <Form.Item label='统计方式' name='DateType'>
              <Select placeholder='请选择' style={{ width: 150 }}>
                <Option value={1}>按年统计</Option>
                <Option value={2}>按月统计</Option>
                <Option value={3}>按日统计</Option>
              </Select>
            </Form.Item>
            {type == 1 ? <Form.Item label='统计年份' name='time' >
              <DatePicker picker="year" style={{ width: 150 }} allowClear={false} />
            </Form.Item>
              :
              type == 2 ?
                <Form.Item label='统计月份' name='time' >
                  <DatePicker picker="month" style={{ width: 150 }} allowClear={false} />
                </Form.Item>
                :
                <Form.Item label='统计日期' name='time' >
                  <RangePicker_
                    allowClear={false}
                    style={{ width: 386 }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
            }
            {radioType == 1 && <Spin spinning={false} size='small' style={{ top: -9 }}>
              <Form.Item label='督查类别' name="InspectorType" >
                <Select placeholder='请选择' style={{ width: 150 }} allowClear showSearch optionFilterProp="children">
                  {
                    inspectorCodeList && inspectorCodeList[0] && inspectorCodeList.map(item => {
                      return <Option key={item.ChildID} value={item.ChildID} >{item.Name}</Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Spin>}
            <Form.Item>

              <Button type="primary" style={{ marginRight:8 }} loading={tableLoading} htmlType="submit">
                查询
          </Button>
              {/* <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                重置
          </Button> */}
              <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={ radioType == 1 ? exportLoading : exportLoading2}>
                导出
            </Button>
            </Form.Item>
            <Radio.Group defaultValue={1} buttonStyle="solid" onChange={onRadioChange}>
              <Radio.Button value={1}>按人统计</Radio.Button>
              <Radio.Button value={2}>按省统计</Radio.Button>
            </Radio.Group>
          </Form>

        }

      >

        <SdlTable
          loading={radioType == 1 ? tableLoading : tableLoading2}
          bordered
          rowClassName={null}
          dataSource={tableDatas}
          columns={radioType == 1 ?  columns : columns2}
          pagination={false}
        />
      </Card>
  
       <Modal wrapClassName={styles.regDetailModalSty} visible={regDetailVisible} title={regDetailTitle} onCancel={()=>{setRegDetailVisible(false)}}   width={'100%'} destroyOnClose>
          <SupervisionManager isDetailModal regDetailPar={regDetailPar} match = { { path:''  } }/>
      </Modal> 
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);