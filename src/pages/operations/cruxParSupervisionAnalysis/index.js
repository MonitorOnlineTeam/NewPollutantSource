/**
 * 功  能：关键参数核查分析 关键参数核查统计
 * 创建人：jab
 * 创建时间：2022.04.20 2023.10.13
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Progress, Upload, Tag, Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin, Statistic } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, IssuesCloseOutlined, AuditOutlined, DownOutlined, ProfileOutlined, UploadOutlined, EditOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled, UnlockFilled, ToTopOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import styles from "./style.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RecordForm from '@/pages/operations/recordForm'
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal';

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'cruxParSupervisionAnalysis'




const dvaPropsData = ({ loading, cruxParSupervisionAnalysis, global, common, point, autoForm }) => ({
  clientHeight: global.clientHeight,
  tableDatas: cruxParSupervisionAnalysis.tableDatas,
  tableLoading: cruxParSupervisionAnalysis.tableLoading,
  tableTotal: cruxParSupervisionAnalysis.tableTotal,
  exportLoading: cruxParSupervisionAnalysis.exportLoading,
  tableDatas2: cruxParSupervisionAnalysis.tableDatas2,
  tableLoading2: cruxParSupervisionAnalysis.tableLoading2,
  tableTotal2: cruxParSupervisionAnalysis.tableTotal2,
  exportLoading2: cruxParSupervisionAnalysis.exportLoading2,
  regQueryPar: cruxParSupervisionAnalysis.regQueryPar,
  regDetailQueryPar: cruxParSupervisionAnalysis.regDetailQueryPar,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (namespace,payload) => {
      dispatch({
          type: `${namespace}/updateState`,
          payload: payload,
      })
    },
    getKeyParameterAnalyseList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getKeyParameterAnalyseList`,
        payload: payload,
        callback: callback
      })
    },
    exportKeyParameterAnalyseList: (payload) => { //导出
      dispatch({
        type: `${namespace}/exportKeyParameterAnalyseList`,
        payload: payload,
      })
    },

  }
}
const Index = (props) => {


  const [form] = Form.useForm();
  const [form2] = Form.useForm();



  const { tableDatas, tableTotal, tableLoading, exportLoading,regQueryPar, tableDatas2, tableTotal2, tableLoading2, exportLoading2, regDetailQueryPar, } = props;
  const { route :{name } } = props;
  useEffect(() => {
    onFinish()
  }, []);
  
  const commonCol = (type)=>[
    {
      title: '核查总数',
      dataIndex: 'allCount',
      key: 'allCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '完成数',
      dataIndex: 'completeCount',
      key: 'completeCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '待完成数',
      dataIndex: 'noCompleteCount',
      key: 'noCompleteCount',
      align: 'center',
      ellipsis: true,
      render:(text,record)=>{
        return  type==1? <a onClick={()=>{regDetail(record,3)}}>{text}</a> : text
       }
    },
    {
      title: '核查完成率',
      dataIndex: 'rate',
      key: 'rate',
      width: 150,
      align:'center',
      sorter: (a, b) => a.rate - b.rate,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text=='-'? 0 : text}
              size="small"
              style={{width:'80%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
            />
          </div>
        );
      }
    },
    {
      title: '一次合格数',
      dataIndex: 'qualifiedCount',
      key: 'qualifiedCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '一次合格率',
      dataIndex: 'qualifiedRate',
      key: 'qualifiedRate',
      width: 150,
      align:'center',
      sorter: (a, b) => a.qualifiedRate - b.qualifiedRate,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text=='-'? 0 : text}
              size="small"
              style={{width:'80%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
            />
          </div>
        );
      }
    },
    {
      title: '二次合格数',
      dataIndex: 'resultQualifiedCount',
      key: 'resultQualifiedCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '二次合格率',
      dataIndex: 'resultQualifiedRate',
      key: 'resultQualifiedRate',
      width: 150,
      align:'center',
      sorter: (a, b) => a.resultQualifiedRate - b.resultQualifiedRate,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text=='-'? 0 : text}
              size="small"
              style={{width:'80%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
            />
          </div>
        );
      }
    },
    {
      title: '省区经理待核查数',
      dataIndex: 'supervisionCount',
      key: 'supervisionCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省区经理核查率',
      dataIndex: 'supervisionRate',
      key: 'supervisionRate',
      width: 150,
      align:'center',
      sorter: (a, b) => a.supervisionRate - b.supervisionRate,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text=='-'? 0 : text}
              size="small"
              style={{width:'80%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
            />
          </div>
        );
      }
    },
    {
      title: '督查人员待核查数',
      dataIndex: 'resultSupervisionCount',
      key: 'resultSupervisionCount',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '督查人员核查率',
      dataIndex: 'resultSupervisionRate',
      key: 'resultSupervisionRate',
      align: 'center',
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.resultSupervisionRate - b.resultSupervisionRate,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text=='-'? 0 : text}
              size="small"
              style={{width:'80%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
            />
          </div>
        );
      }
    },
    {
      title: '未完成整改数',
      dataIndex: 'wwcquestionCount',
      key: 'wwcquestionCount',
      align: 'center',
      ellipsis: true,
      render:(text,record)=>{
        return type==1? <a onClick={()=>{regDetail(record,4)}}>{text}</a> : text
       }
    },
    {
      title: '整改率',
      dataIndex: 'questionRate',
      key: 'questionRate',
      width: 150,
      align:'center',
      sorter: (a, b) => a.questionRate - b.questionRate,
      render: (text, record) => {
        return (
          <div>
            <Progress
              percent={text=='-'? 0 : text}
              size="small"
              style={{width:'80%'}}
              status='normal'
              format={percent => <span style={{ color: 'rgba(0,0,0,.6)' }}>{text=='-'? text : text + '%'}</span>}
            />
          </div>
        );
      }
    },
  ]
  const columns = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
      render:(text,record,index)=>{
        return index + 1 
       }
    },
    {
      title: '省',
      dataIndex: 'regionName',
      key: 'regionName',
      align: 'center',
      ellipsis: true,
      render:(text,record)=>{
       return <a onClick={()=>{regDetail(record,2)}}>{text}</a>
       }
      },
      ...commonCol(1)
  ];
  const [regDetailVisible, setRegDetailVisible] = useState(false)
  const [regDetailTitle, setRegDetailTitle] = useState()
  const [regionCode, setRegionCode] = useState()
  const [staticType,setStaticType] = useState(2)

  const regDetail = (row,staticType) => {
    setRegDetailVisible(true)
    setRegDetailTitle(`${row.regionName} - 统计${regQueryPar.beginTime&&moment(regQueryPar.beginTime).format('YYYY-MM-DD')}~${regQueryPar.endTime&&moment(regQueryPar.endTime).format('YYYY-MM-DD')}内关键参数核查分析`)
    setRegionCode(row.regionCode)
    form2.resetFields()
    setStaticType(staticType)
    onFinish2(row.regionCode,staticType)
  }
  const onFinish = async () => {  //查询  par参数 分页需要的参数
    try {
      const values = await form.validateFields();
      props.getKeyParameterAnalyseList({
        ...values,
        beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
        time: undefined,
        staticType:1,
        // type:name=='cruxParSupervisionAnalysis'? 'analysis' : 'statistics'
      }, ( par) => {
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports = async () => { //导出
    const values = await form.validateFields();
    props.exportKeyParameterAnalyseList({
      ...values,
      beginTime: values.time && moment(values.time[0].startOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      endTime: values.time && moment(values.time[1].endOf("day")).format('YYYY-MM-DD HH:mm:ss'),
      time: undefined,
      staticType:1,
    })
  }




  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      layout='inline'
      initialValues={{
        time: [moment(new Date()).startOf('M'), moment().add(-1, 'D')],
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={() => { onFinish() }}
    >
     <Form.Item label='日期' name='time' >
        <RangePicker_
          format='YYYY-MM-DD'
          style={{ width: 240 }}
        />
      </Form.Item>
        <Form.Item label='监测点类型' name='PollutantType'>
          <Select placeholder='请选择' style={{ width: 150 }} allowClear>
            <Option key={2} value={2} >废气</Option>
            <Option key={1} value={1} >废水</Option>
          </Select>
        </Form.Item>
      <Form.Item>
        <Button type="primary" loading={tableLoading} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>
        <Button icon={<ExportOutlined />} onClick={() => { exports() }} loading={exportLoading}>
          导出
          </Button>

      </Form.Item>

    </Form>
  }

  //省级详情
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '省',
      dataIndex: 'province',
      key: 'province',
      align: 'center',
      width:120,
      ellipsis: true,
    },
    {
      title: '市',
      dataIndex: 'city',
      key: 'city',
      align: 'center',
      width:120,
      ellipsis: true,
    },
    {
      title: '企业名称',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      width:120,
      ellipsis: true,
    },
    {
      title: '监测点名称',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      width:100,
      ellipsis: true,
    },
    {
      title: '执行人员',
      dataIndex: 'operationName',
      key: 'operationName',
      align: 'center',
      width:100,
      ellipsis: true,
    },
    
  ];
  const statisticColumns2 = [
    ...columns2,
    ...commonCol(2)
  ]

  const searchComponents2 = () => {
    return <Form
      form={form2}
      name="advanced_search"
      layout='inline'
      className={styles["ant-advanced-search-form"]}
      onFinish={() => {  onFinish2(regionCode,staticType) }}
    >
        <Form.Item label='企业名称' name='entName'>
          <Input allowClear placeholder='请输入'/>
        </Form.Item>
      <Form.Item>
        <Button type="primary" loading={tableLoading2} htmlType='submit' style={{ marginRight: 8 }}>
          查询
          </Button>
        <Button icon={<ExportOutlined />} onClick={() => { exports2() }} loading={exportLoading2}>
          导出
          </Button>

      </Form.Item>

    </Form>
  }






  const onFinish2 = async (regionCodes,staticType) => {  //查询  par参数 分页需要的参数
    try {
      const values = await form2.validateFields();
      props.getKeyParameterAnalyseList({
        ...values,
        ...regQueryPar,
        time: undefined,
        regionCode:regionCodes,
        staticType:staticType,
      }, ( par) => {

        
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const exports2 = async () => { //详情导出
    const values = await form2.validateFields();
    props.exportKeyParameterAnalyseList({
      ...values,
      ...regQueryPar,
      regionCode:regionCode,
      time: undefined,
      staticType:staticType,
    })
  }
 
  // const [pageIndex, setPageIndex] = useState(1)
  // const [pageSize, setPageSize] = useState(20)
  // const handleTableChange2 = (PageIndex, PageSize) => {
  //   setpageIndex(PageIndex)
  //   setPageSize(PageSize)
  //   onFinish2(PageIndex, PageSize, { ...regDetailQueryPar, pageIndex: PageIndex, pageSize: PageSize })
  // }



  return (
    <div className={styles.cruxParSupervisionAnalysisSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
            loading={tableLoading}
            bordered
            dataSource={tableDatas}
            columns={columns}
            pagination={false}
            className={styles.cruxParAnalysisRegTableSty}
          />
        </Card>
        <Modal //省级详情
          visible={regDetailVisible}
          title={regDetailTitle}
          wrapClassName='spreadOverModal'
          footer={null}
          width={'100%'}
          onCancel={() => { setRegDetailVisible(false) }}
          destroyOnClose
        >
          <Card title={searchComponents2()}>
            <SdlTable
              loading={tableLoading2}
              bordered
              dataSource={tableDatas2}
              columns={staticType==2? statisticColumns2 : columns2}
              // pagination={{
              //   total: tableTotal2,
              //   pageSize: pageSize,
              //   current: pageIndex,
              //   showSizeChanger: true,
              //   showQuickJumper: true,
              //   onChange: handleTableChange2,
              // }}
            />
          </Card>
        </Modal>

      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);