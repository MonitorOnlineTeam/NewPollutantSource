/**
 * 功  能：运维督查管理
 * 创建人：jab
 * 创建时间：2022.04.20
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag,Popover, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import EntAtmoList from '@/components/EntAtmoList'
import EntType from '@/components/EntType'
import UserList from '@/components/UserList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'supervisionManager'




const dvaPropsData = ({ loading, supervisionManager, global,common,point,autoForm }) => ({
  tableDatas: supervisionManager.tableDatas,
  tableLoading: supervisionManager.tableLoading,
  tableTotal: supervisionManager.tableTotal,
  pointParamesLoading: loading.effects[`${namespace}/getPointParames`],
  infoloading: loading.effects[`${namespace}/getInspectorOperationInfoList`],
  userLoading: loading.effects[`common/getUserList`],
  regLoading: loading.effects[`autoForm/getRegions`],
  entLoading:common.entLoading,
  clientHeight: global.clientHeight,
  monitoringTypeList: point.monitoringTypeList,
  systemModelList: point.systemModelList,
  loadingSystemModel: loading.effects[`point/getSystemModelList`]|| false,
  systemModelListTotal: point.systemModelListTotal,
  operationInfoList: supervisionManager.operationInfoList,
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getPointByEntCode: (payload, callback) => { //监测点
      dispatch({
        type: `remoteSupervision/getPointByEntCode`,
        payload: payload,
        callback: callback
      })
    },
    getEntByRegionCallBack: (payload, callback) => { //企业
      dispatch({
        type: `common/getEntByRegionCallBack`,
        payload: payload,
        callback: callback
      })
    },
    getMonitoringTypeList: (payload) => {
      dispatch({
        type: `point/getMonitoringTypeList`, //获取监测类别
        payload: payload,
      })
    },
    getSystemModelList: (payload) => { //列表 系统型号
      dispatch({
        type: `point/getSystemModelList`,
        payload: payload,
      })
    },
    getInspectorOperationManageList: (payload) => { //列表
      dispatch({
        type: `${namespace}/getInspectorOperationManageList`,
        payload: payload,
      })
    },
    getInspectorOperationInfoList: (payload,callback) => {//获取单个督查表实体
      dispatch({
        type: `${namespace}/getInspectorOperationInfoList`,
        payload: payload,
        callback:callback,
      })

    },
    getPointParames: (payload, callback) => { //获取单个排口默认值
      dispatch({
        type: `${namespace}/getPointParames`,
        payload: payload,
        callback: callback
      })

    },

  }
}
const Index = (props) => {



  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();



  const [fromVisible, setFromVisible] = useState(false)


  const [type, setType] = useState('add')





  const [manufacturerId, setManufacturerId] = useState(undefined)

  const { tableDatas, tableTotal, tableLoading, pointParamesLoading,infoloading, userLoading,entLoading,systemModelList,operationInfoList,} = props;

  useEffect(() => {  
    initData()
  }, []);

  const initData = () =>{
    onFinish()
    props.getInspectorOperationInfoList({ID:''},(data)=>{ })
    props.getMonitoringTypeList({})
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      width:50,
    },
    {
      title: '行政区',
      dataIndex: 'StandardGasCode',
      key: 'StandardGasCode',
      align: 'center',
    },
    {
      title: `企业名称`,
      dataIndex: 'StandardGasName',
      key: 'StandardGasName',
      align: 'center',
    },
    {
      title: '站点名称',
      dataIndex: 'Component',
      key: 'Component',
      align: 'center',
    },
    {
      title: '督查类别',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: '监测因子',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '督查人员',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: '督查日期',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '运维人员',
      dataIndex: 'OperationUser',
      key: 'OperationUser',
      align: 'center',
    },
    {
      title: '原则问题数量',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '重点问题数量',
      dataIndex: 'Manufacturer',
      key: 'Manufacturer',
      align: 'center',
    },
    {
      title: '一般问题数量',
      dataIndex: 'StandardGasCode',
      key: 'StandardGasCode',
      align: 'center',
    },
    {
      title: `原则问题`,
      dataIndex: 'StandardGasName',
      key: 'StandardGasName',
      align: 'center',
    },
    {
      title: '一般问题',
      dataIndex: 'Component',
      key: 'Component',
      align: 'center',
    },
    {
      title: '总分',
      dataIndex: 'Unit',
      key: 'Unit',
      align: 'center',
    },
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width: 180,
      render: (text, record) => {
        return <span>
          
          <Fragment><Tooltip title="编辑"> <a href="#" onClick={() => { edit(record) }} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment><Tooltip title='详情'> <a href="#" onClick={() => { detail(record) }} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
          <Fragment> <Tooltip title="删除">
            <Popconfirm title="确定要删除此条信息吗？" style={{ paddingRight: 5 }} onConfirm={() => { del(record) }} okText="是" cancelText="否">
              <a href="#" ><DelIcon /></a>
            </Popconfirm>
          </Tooltip>
          </Fragment>
        </span>
      }
    },
  ];


  const edit = async (record) => {
    setFromVisible(true)
    setType('edit')
    form2.resetFields();
    try {
      form2.setFieldsValue({
        ...record,
      })

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
 const detail = (record) =>{

}
  const del = async (record) => {
    const values = await form.validateFields();
    props.delStandardGas({ ID: record.ID }, () => {
      setPageIndex(1)
      props.getStandardGasList({
        ...values,
        PageIndex: 1,
        PageSize: pageSize
      })
    })
  };


  const [entLoading2,setEntLoading2 ] = useState(false)
  const [entList,setEntList ] = useState([])
  const getEntList = (pollutantType) =>{
    setEntLoading2(true)
    props.getEntByRegionCallBack({RegionCode:'',PollutantType:pollutantType},(data)=>{
      setEntList(data)
      setEntLoading2(false)
    })
  }



  
  const add = () => {
    setFromVisible(true)
    setType('add')
    form2.resetFields();
    getEntList(2);
  };

  const onFinish = async (pageIndexs, pageSizes) => {  //查询
    try {
      const values = await form.validateFields();

      props.getInspectorOperationManageList({
        ...values,
        BTime: values.time&&moment(values.time[0]).format('YYYY-MM—DD HH:mm:ss'),
        ETime: values.time&&moment(values.time[1]).format('YYYY-MM—DD HH:mm:ss'),
        time:undefined,
        pageIndex: pageIndexs && typeof pageIndexs === "number" ? pageIndexs : pageIndex,
        pageSize: pageSizes ? pageSizes : pageSize,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const onModalOk = async () => { //添加 or 编辑弹框

    try {
      const values = await form2.validateFields();//触发校验
       props.addStandardGas({
        ...values,
        ManufacturerId: manufacturerId
      }, () => {
        setFromVisible(false)
        onFinish()
      })
        

    } catch (errInfo) {
      console.log('错误信息:', errInfo);
    }
  }

  const [pointList, setPointList] = useState([])
  const [pointLoading, setPointLoading] = useState(false)

  const onValuesChange = (hangedValues, allValues) => {
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form.setFieldsValue({ DGIMN: undefined })
        setPointList([])
        return;
      }
      setPointLoading(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList(res)
        setPointLoading(false)
      })
      form.setFieldsValue({ DGIMN: undefined })
    }
  }


  const [pointList2, setPointList2] = useState([])
  const [pointLoading2, setPointLoading2] = useState(false)
  const [pollutantType,setPollutantType] = useState("2")

  const onAddEditValuesChange = (hangedValues, allValues) => { //添加修改时的监测类型请求
    if (Object.keys(hangedValues).join() == 'EntCode') {
      if (!hangedValues.EntCode) { //清空时 不走请求
        form2.setFieldsValue({ DGIMN: undefined })
        setPointList2([])
        return;
      }
      setPointLoading2(true)
      props.getPointByEntCode({ EntCode: hangedValues.EntCode }, (res) => {
        setPointList2(res)
        setPointLoading2(false)
      })
      form2.setFieldsValue({ DGIMN: undefined })
    }

    if (Object.keys(hangedValues).join() == 'PollutantType') {
       getEntList(hangedValues.PollutantType)
       form2.setFieldsValue({ EntCode: undefined })
       setPollutantType(hangedValues.PollutantType)
    }
    if (Object.keys(hangedValues).join() == 'DGIMN') {
       props.getPointParames({DGIMN:hangedValues.DGIMN},(data)=>{
         console.log(data)
         form2.setFieldsValue({...data,RegionCode:data.RegionCode?data.RegionCode.split(','):undefined })
       })
   }
  }

  const searchComponents = () => {
    return <Form
      form={form}
      name="advanced_search"
      initialValues={{
        time:[moment(new Date()).add(-30, 'day').startOf("day"), moment().endOf("day"),]
      }}
      className={styles["ant-advanced-search-form"]}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Row align='middle'>
        <Spin  size='small' spinning={props.regLoading} style={{ top: -8,left:20 }}>
        <Form.Item label='行政区' name='RegionCode' >
          <RegionList levelNum={3} style={{ width: 150 }}/>
        </Form.Item>
        </Spin>
        <Spin spinning={entLoading} size='small' style={{ top: -8 }}>
        <Form.Item label='企业' name='EntCode' style={{ marginLeft:8,marginRight:8 }}>
          <EntAtmoList  style={{ width: 380}} />
        </Form.Item>
        </Spin>
        <Spin spinning={pointLoading} size='small' style={{ top: -8,left:20 }}>
          <Form.Item label='监测点名称' name='DGIMN' >

            <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" style={{ width: 150 }}>
              {
                pointList[0] && pointList.map(item => {
                  return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                })
              }
            </Select>
          </Form.Item>
        </Spin>
      </Row>

      <Row>
      <Spin spinning={infoloading} size='small' style={{top:-8,left:20}}>
        <Form.Item label="督查人员" name="Inspector"  >
         <UserList  style={{ width: 150}}  data={operationInfoList&&operationInfoList.UserList}/>
        </Form.Item>
        </Spin>
        <Form.Item label="督查日期" name="time" style={{ marginLeft:8,marginRight:8 }}  >
            <RangePicker_
              style={{ width: 380}}
              allowClear={true}
              format="YYYY-MM-DD HH:mm:ss"
              showTime="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Spin spinning={infoloading} size='small' style={{top:-8,left:20}}>
        <Form.Item label="运维人员" name="OperationUser" style={{ marginRight: 8 }}  >
        <UserList  style={{ width: 150}}  data={operationInfoList&&operationInfoList.UserList}/>
        </Form.Item>
        </Spin>
        <Form.Item>
          <Button type="primary" htmlType='submit' style={{ marginRight: 8 }}>
            查询
     </Button>
          <Button onClick={() => { form.resetFields() }} style={{ marginRight: 8 }} >
            重置
     </Button>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => { add() }} >
            添加
     </Button>
        </Form.Item>
      </Row>
    </Form>
  }


  const handleTableChange = (PageIndex, PageSize) => {
    setPageIndex(PageIndex)
    setPageSize(PageSize)
    onFinish(PageIndex, PageSize)
  }


   const [pageSize, setPageSize] = useState(20)
   const [pageIndex, setPageIndex] = useState(1)

  const TitleComponents = (props) =>{
  return  <div style={{display:'inline-block', fontWeight:'bold',padding:'2px 4px',marginBottom:16,borderBottom:'1px solid rgba(0,0,0,.1)'}}>{props.text}</div>
          
  }


  const generatorCol = [
    {
      title: '设备厂家',
      dataIndex: 'ManufacturerName',
      key: 'ManufacturerName',
      align: 'center',
    },
    {
      title: '系统名称',
      dataIndex: 'SystemName',
      key: 'SystemName',
      align: 'center',
    },
    {
      title: '系统型号',
      dataIndex: 'SystemModel',
      key: 'SystemModel',
      align: 'center',
    },
    {
      title: '监测类别',
      dataIndex: 'MonitoringType',
      key: 'MonitoringType',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      render: (text, record) => {
        return <Button type='primary' size='small' onClick={() => { generatorColChoice(record) }}> 选择 </Button>
      }
    },

  ]

  const generatorColChoice = (record) => {
    if (popVisible) {
      form2.setFieldsValue({ GasManufacturer: record.ID, GasEquipment: record.SystemModel });
      setGaschoiceData(record.ManufacturerName)
      setPopVisible(false)
    } else {//颗粒物
      form2.setFieldsValue({ PMManufacturer: record.ID, PMEquipment: record.SystemModel });
      setPmchoiceData(record.ManufacturerName)
      setPmPopVisible(false)
    }

  }

  const [gaschoiceData, setGaschoiceData] = useState()
  const [pmchoiceData, setPmchoiceData] = useState()

  const onClearChoice = (value) => {
    form2.setFieldsValue({ GasManufacturer: value, GasEquipment: '' });
    setGaschoiceData(value)
  }

  const onPmClearChoice = (value) => {
    form2.setFieldsValue({ PMManufacturer: value, PMEquipment: '' });
    setPmchoiceData(value)
  }
  const [pageIndex2,setPageIndex2] = useState(1)
  const [pageSize2,setPageSize2] = useState(10)
  const onFinish3 = async (pageIndex2,pageSize2) => { //生成商弹出框 查询
    try {
      const values = await form3.validateFields();
      props.getSystemModelList({
        pageIndex: pageIndex2,
        pageSize: pageSize2,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }
  const handleTableChange2 =   async (PageIndex, PageSize)=>{ //分页
    const values = await form3.validateFields();
    setPageSize2(PageSize)
    setPageIndex2(PageIndex)
    props.getSystemModelList({...values,PageIndex,PageSize})
  }
  const [popVisible, setPopVisible] = useState(false)
  const [pmPopVisible, setPmPopVisible] = useState(false) //颗粒物弹出框

   useEffect(()=>{
     if(pmPopVisible || popVisible){
       form3.resetFields()
       setPageIndex2(1)
       setPageSize2(10)
       onFinish3(1,10)
     }
   },[pmPopVisible,popVisible])


  const { monitoringTypeList } = props;
 
  const manufacturerList  = operationInfoList&&operationInfoList.EquipmentManufacturerList || [];
  const selectPopover = (type) => {
    return <Popover
      title=""
      trigger="click"
      visible={type === 'pm' ? pmPopVisible : popVisible}
      onVisibleChange={(visible) => { type === 'pm' ? setPmPopVisible(visible) : setPopVisible(visible) }}
      placement={"right"}
      getPopupContainer={trigger => trigger.parentNode}
      content={
        <Form
          form={form3}
          name="advanced_search3"
          onFinish={() => { onFinish3(pageIndex2,pageSize2) }}
          initialValues={{
            ManufacturerId:manufacturerList[0] && manufacturerList[0].ID,
          }}
        >
          <Row>
            <Form.Item style={{ marginRight: 8 }} name='ManufacturerID' >
              <Select placeholder='请选择设备厂家'    showSearch allowClear filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {
                  manufacturerList[0] && manufacturerList.map(item => {
                    return <Option key={item.ID} value={item.ID}>{item.ManufacturerName}</Option>
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item style={{ marginRight: 8 }} name="SystemModel">
              <Input allowClear placeholder="请输入系统型号" />
            </Form.Item>
            <Form.Item style={{ marginRight: 8 }} name="MonitoringType">
              <Select allowClear placeholder="请选择监测类别">
                {
                  monitoringTypeList[0] && monitoringTypeList.map(item => {
                    return <Option key={item.Code} value={item.Code}>{item.Name}</Option>
                  })
                }
              </Select>

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType='submit'>
                查询
             </Button>
            </Form.Item>
          </Row>
          <SdlTable scroll={{ y: 'calc(100vh - 550px)' }} style={{ width: 800 }} 
                    loading={props.loadingSystemModel} bordered dataSource={systemModelList} columns={generatorCol}
                    pagination={{
                      total:props.systemModelListTotal,
                      pageSize: pageSize2,
                      current: pageIndex2,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      onChange: handleTableChange2,
                    }}
          />
        </Form>
      }
    >
      <Select onChange={type === 'pm' ? onPmClearChoice : onClearChoice} allowClear showSearch={false} value={type === 'pm' ? pmchoiceData : gaschoiceData} dropdownClassName={'popSelectSty'} placeholder="请选择">
      </Select>
    </Popover>
  }
  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    return obj;
  };
  const supervisionCol1 = [ {
    title: <span style={{fontWeight:'bold',fontSize:14}}>原则问题（否决项，出现1项此点位得0分）</span>,
    align: 'center',
    children:[
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      width:100,
    },
    {
      title: '督查内容',
      dataIndex: 'aa',
      key: 'aa',
      align: 'center',
      width:380,
      render: (text, record) => {
        return <div style={{textAlign:"left"}}>{text}</div>
      },
    },
    {
      title: `有无原则问题`,
      dataIndex: 'StandardGasName',
      key: 'StandardGasName',
      align: 'center',
      width:200,
      render: (text, record) => {
        return <Form.Item>
               <Select placeholder='请选择'> <Option>有</Option>   <Option>无</Option>     </Select>
             </Form.Item>
      },
    },
    {
      title: '问题描述',
      dataIndex: 'Component',
      key: 'Component',
      align: 'center',
      render: (text, record) => {
        return <Form.Item>
               <TextArea rows={1} placeholder='请输入'/>
             </Form.Item>
      },
    }]
  }
  ]

    const supervisionCol2 = [ {
      title: <span style={{fontWeight:'bold',fontSize:14}}>重点问题（每项5分，共60分）</span>,
      align: 'center',
      children:[
      {
        title: '序号',
        dataIndex: 'Sort',
        key: 'Sort',
        align: 'center',
        width:100,
      },
      {
        title: '督查内容',
        dataIndex: 'StandardGasCode',
        key: 'StandardGasCode',
        align: 'center',
        width:380,
      },
      {
        title: `扣分`,
        dataIndex: 'StandardGasName',
        key: 'StandardGasName',
        align: 'center',
        width:200,
        render: (text, record) => {
          return <Form.Item>
                 <InputNumber placeholder='请输入' />
               </Form.Item>
        },
      },
      {
        title: '说明',
        dataIndex: 'Component',
        key: 'Component',
        align: 'center',
        render: (text, record) => {
          return <Form.Item>
                 <TextArea rows={1} placeholder='请输入'/>
               </Form.Item>
        },
       }]
      }]

      const supervisionCol3 = [{
        title: <span style={{fontWeight:'bold',fontSize:14}}>一般问题（每项2分，共40分）</span>,
        align: 'center',
        children:[ 
        {
          title: '序号',
          dataIndex: 'Sort',
          key: 'Sort',
          align: 'center',
          width:100,
        },
        {
          title: '督查内容',
          dataIndex: 'StandardGasCode',
          key: 'StandardGasCode',
          align: 'center',
          width:380,
        },
        {
          title: `扣分`,
          dataIndex: 'StandardGasName',
          key: 'StandardGasName',
          align: 'center',
          width:200,
          render: (text, record) => {
            return <Form.Item>
                   <InputNumber placeholder='请输入' />
                 </Form.Item>
          },
        },
        {
          title: '说明',
          dataIndex: 'Component',
          key: 'Component',
          align: 'center',
          render: (text, record) => {
            return <Form.Item>
                   <TextArea rows={1} placeholder='请输入'/>
                 </Form.Item>
          },
        }]
        }]
        const supervisionCol4 = [
          {
            align:'center',
            render: (text, record,index) => {
             return  index == 0? '总分': '评价'
             },
            },
            {
              align:'center',
              render: (text, record,index) => {
                if(index==0){
                  return <Form.Item>
                  <InputNumber placeholder='请输入' />
                </Form.Item>
                }else{    
                return {
                  children: <Form.Item>  <TextArea rows={1} placeholder='请输入' /></Form.Item>,
                  props: {colSpan:3},
                };
                }

              }
            },
            {
              align:'center',
              render: (text, record,index) => {
                const obj = {
                  children: '附件',
                  props: {},
                };
                if (index === 1) {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              key: 'Component',
              render: (text, record,index) => {
                const obj = {
                  children: <Form.Item>
                  <InputNumber placeholder='请输入' />
                </Form.Item>,
                  props: {},
                };
                if (index === 1) {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
      ]
  return (
    <div className={styles.supervisionManagerSty}>
      <BreadcrumbWrapper>
        <Card title={searchComponents()}>
          <SdlTable
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
      <Modal
        title={`${type === 'add' ? '添加' : '编辑'}`}
        visible={fromVisible}
        onOk={onModalOk}
        onCancel={() => { setFromVisible(false) }}
        className={styles.fromModal}
        destroyOnClose
        width='80%'
        footer={[
          <Button  onClick={() => { setFromVisible(false)}}>
            取消
          </Button>,
          // <Button  type="primary" onClick={()=>{save(1)}}  loading={tabType == 1 ? saveLoading1 : saveLoading2}>
          //   保存
          // </Button>,
          // <Button type="primary" onClick={()=>save(2)}  loading={tabType == 1 ? saveLoading1 : saveLoading2} >
          //   提交
          // </Button>,
        ]}
      >
        <Form
          name="basic"
          form={form2}
          initialValues={{
            PollutantType: '2',
          }}
          onValuesChange={onAddEditValuesChange}
        >
            <div style={{fontSize:16,padding:6,textAlign:'center',fontWeight:'bold'}}>运维督查表</div>
          <div className={'essentialInfoSty'}>
           <TitleComponents text='基本信息'/>
           <Row>
            <Col span={12}>
              <Form.Item label="行业" name="PollutantType" >
                <EntType placeholder='请选择' allowClear={false} />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Spin spinning={infoloading} size='small' style={{ top: -9 }}>
              <Form.Item label='督查类别' name="StandardGasName" rules={[{ required: true, message: '请输入督查类别' }]} >
               <Select>
                 </Select>
              </Form.Item>
              </Spin>
            </Col>

            <Col span={12}>
            <Spin spinning={entLoading2} size='small' style={{ top: -9 }}>
              <Form.Item label="企业名称" name="EntCode" rules={[{ required: true, message: '请输入企业名称' }]}>
              <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" >
              {
                entList[0] && entList.map(item => {
                  return <Option key={item.EntCode} value={item.EntCode} >{item.EntName}</Option>
                })
              }
            </Select>
              </Form.Item>
              </Spin>
            </Col>
            <Col span={12}>
            <Spin spinning={pointLoading2} size='small' style={{ top: -9}}>
            <Form.Item label='站点名称' name='DGIMN' rules={[{ required: true, message: '请选择站点名称' }]}>

            <Select placeholder='请选择' allowClear showSearch optionFilterProp="children">
              {
                pointList2[0] && pointList2.map(item => {
                  return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                })
              }
            </Select>
          </Form.Item>
        </Spin>
            </Col>

            {pollutantType==2&& <Col span={12}>
              <Form.Item label="是否排口" name="OutputType" rules={[{ required: true, message: '请选择是否排口' }]} >
              <Select placeholder='请选择' optionFilterProp="children">
                <Option value={"1"}>排放口</Option>
                <Option value={"0"}>非排放口</Option>
              </Select>
              </Form.Item>
            </Col>}
            <Col span={12}>
              <Form.Item label='行政区' name='RegionCode' rules={[{ required: true, message: '请选择行政区' }]}>
               <SdlCascader  selectType='3,是'/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="监测因子" name="PollutantCode" rules={[{ required: true, message: '请输入监测因子' }]} >
               <Input placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
            <Col span={12}>
             <Spin spinning={infoloading} size='small' style={{top:-8,left:0}} >
             <Form.Item label="督查人员" name="IsUsed"  rules={[{ required: true, message: '请输入督查人员' }]} >
              <UserList    data={operationInfoList&&operationInfoList.UserList}/>
               </Form.Item>
               </Spin>
            </Col >
            <Col span={12}>
              <Form.Item label="督查日期" name="time" rules={[{ required: true, message: '请选择督查日期' }]} >
                <DatePicker /> 
              </Form.Item>
              </Col >
            <Col span={12}>
              <Spin spinning={infoloading} size='small' style={{top:-8,left:0}}>
               <Form.Item label="运维人员" name="IsUsed"  rules={[{ required: true, message: '请输入运维人员' }]}>
               <UserList  data={operationInfoList&&operationInfoList.UserList}/>
               </Form.Item>
               </Spin>
            </Col>
            </Row>
          </div>

          <div className={'deviceInfoSty'}>
           <TitleComponents text='设备信息'/>
            {pollutantType==1?
            <>
               <Row>
            <Col span={12}>
            <Spin spinning={infoloading} size='small' style={{top:-8,left:0}} >
            <Form.Item label='设备厂家' name='DGIMsN' >

            <Select placeholder='请选择' allowClear showSearch optionFilterProp="children" >
              {
                pointList2[0] && pointList2.map(item => {
                  return <Option key={item.DGIMN} value={item.DGIMN} >{item.PointName}</Option>
                })
              }
            </Select>
          </Form.Item>
          </Spin>
          </Col>
          <Col span={12}>
            <Form.Item label='设备类型' name='DGIMsN'>
              <Input placeholder='请输入' allowClear/>
          </Form.Item>
          </Col>
          
          <Col span={24}>
          <Form.Item label='备注' name='Remark'>
                  <TextArea rows={1} placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
          </Row>
            </>
            :
            <>
           <Row>
            <Col span={12}>
            <Form.Item label='气态CEMS设备生产商' name='GasManufacturer' rules={[{ required: false, message: '请选择气态CEMS设备生产商' }]}>
             {selectPopover()}
          </Form.Item>
            </Col>
            <Col span={12}>
                 <Form.Item label='气态CEMS设备规格型号' name='GasEquipment' rules={[{ required: false, message: '请输入气态CEMS设备规格型号' }]}>
                 <Input placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
          </Row>

           <Row>
            <Col span={12}>
            <Form.Item label='颗粒物CEMS设备生产商' name='PMManufacturer' rules={[{ required: false, message: '请选择颗粒物CEMS设备生产商' }]}>
            {selectPopover('pm')}
          </Form.Item>
            </Col>
            <Col span={12}>
                 <Form.Item label='颗粒物CEMS设备规格型号' name='PMEquipment' rules={[{ required: false, message: '请输入颗粒物CEMS设备规格型号' }]}>
                  <Input placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
          <Col span={24}>
          <Form.Item label='备注' name='Remark'>
                  <TextArea rows={1} placeholder='请输入' allowClear/>
              </Form.Item>
            </Col>
          </Row>
          </>}
           </div>

           <div className={'supervisionContentSty'}>
           <TitleComponents text='督查内容'/>
             <Table 
              bordered
              dataSource={[{Sort:1,aa:'督查内儿童'}]}
              columns={supervisionCol1}
              rowClassName="editable-row"
              pagination={false}
             />
             <Table 
              bordered
              dataSource={[{Sort:1,aa:'督查内儿童'}]}
              columns={supervisionCol2}
              rowClassName="editable-row"
              className="impTableSty"
              pagination={false}
             />
            <Table 
              bordered
              dataSource={[{Sort:1,aa:'督查内儿童'}]}
              columns={supervisionCol3}
              rowClassName="editable-row"
              pagination={false}
              className={'commonlyTableSty'}
             />
             <Table 
              bordered
              dataSource={[{Sort:1},{Sort:2}]}
              columns={supervisionCol4}
              className="summaryTableSty"
              pagination={false}
             />
           </div>
        </Form>
      </Modal>
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);