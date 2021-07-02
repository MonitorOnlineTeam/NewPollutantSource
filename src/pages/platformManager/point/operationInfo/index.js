/**
 * 功  能：监测点下的运维信息
 * 创建人：jab
 * 创建时间：2021.05.26
 */
import React, { Component,Fragment } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Select,
  Tooltip,
  Popconfirm,
  Radio,
  Upload,
  Switch
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from '../operationInfo/style.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { downloadFile } from '@/utils/utils';
import ButtonGroup_ from '@/components/ButtonGroup'
import { getThirdTableDataSource } from '@/services/entWorkOrderStatistics';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { EditIcon } from '@/utils/icon'
import {
  QuestionCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  LeftOutlined
} from '@ant-design/icons';
import cuid from 'cuid';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'operationInfo/updateState',
  getData: 'operationInfo/getOperationPointList',
};


@connect(({ loading, operationInfo,autoForm,common}) => ({
  loading: loading.effects[pageUrl.getData],
  confirmLoading: loading.effects['operationInfo/addOrUpdateOperationPoint'],
  total: operationInfo.total,
  tableDatas: operationInfo.tableDatas,
  operationList:operationInfo.operationList
}))
@Form.create()
export default class OperationInfo extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      visible:false,
      unitDisabled:false,
      DGIMN:''
    };
    this.columns =  [      {
      title: <span>运维类型</span>,
      dataIndex: 'operationTypeName',
      key: 'operationTypeName',
      align: 'center',
    },
      {
        title: <span>运维单位</span>,
        dataIndex: 'oprationEntName',
        key: 'oprationEntName',
        align: 'center',
      },
      {
        title: <span>开始时间</span>,
        dataIndex: 'beginTime',
        key: 'beginTime',
        align: 'center',
      },
      {
        title: <span>结束时间</span>,
        dataIndex: 'endTime',
        key: 'endTime',
        align: 'center',
      },
      {
        title: <span>操作</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        render: (text, record) =>{
          return  <span>
                 <a  style={{padding:'0 5px'}} onClick={()=>{this.edit(record)}} >编辑</a>
                 <Popconfirm  title="确定要删除此条信息吗？" onConfirm={() => this.del(record)} okText="是" cancelText="否">
                 <a >删除</a>
                 </Popconfirm>
               </span>
        }
      },
    ];
  }

  componentDidMount() {
    this.initData();
  }
  initData = () => {
    const {dispatch, location: { query: { p } },form:{setFieldsValue}} = this.props;
    dispatch({
      type: 'operationInfo/listOperationMaintenanceEnterprise',
      payload: {
      },
    });
    this.setState({
      DGIMN:p
    })
    setTimeout(() => {
      this.getTableData();
    });
  };


  getTableData = () => {
    const { dispatch,location: { query: { p } }} = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { DGIMN:p },
    });
  };



  
  //查询事件
  queryClick = () => {

   

    this.getTableData();
  };


  
  onRef1 = (ref) => {
    this.child = ref;
  }
   

   edit=(row)=>{  //编辑

    const {dispatch,form:{setFieldsValue},editFormData,operationList} = this.props;

    this.setState({
      visible:true,
      type:'edit',
    },()=>{
      if(row.operationType==1){
        this.setState({unitDisabled:true})
      }else{
        this.setState({unitDisabled:false})
        // row.EnterpriseID   = operationList.filter(item=>{
        //        if(item.Company === row.oprationEntName){
        //            return item
        //        }
        // })
        // row.entID= row.EnterpriseID[0].EnterpriseID
      }
      // 获取详情页面数据
      setFieldsValue({
        ID:row.ID,
        Type:row.operationType,
        OperationCompany:row.operationType==2?row.entID:undefined,//单位
        Time:[moment(row.beginTime),moment(row.endTime)]
      })

    })
   }





   handleOk=(e)=>{
     const {DGIMN} = this.state;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
       console.log(values)
        this.props.dispatch({
              type: 'operationInfo/addOrUpdateOperationPoint',
              payload: {
                  ...values,
                  DGIMN:DGIMN,
                  BeginTime:moment(values.Time[0]).format("YYYY-MM-DD 00:00:00"),
                  EndTime:moment(values.Time[0]).format("YYYY-MM-DD 23:59:59")
                 },
                 callback:res=>{
                  this.setState({
                   visible:false,
                  },()=>{
                 this.getTableData();
                 })
              }
          })

      }
    });
   }
   add=()=>{
    const {dispatch,form:{setFieldsValue}} = this.props;

     this.setState({
      visible:true,
      type:'add',
    })
   }

   del=(row)=>{ //删除
    const { dispatch,location: { query: { p } }} = this.props;
    this.props.dispatch({
      type: 'operationInfo/deleteOperationPoint',
      payload: { ID:row.ID,DGIMN:p },
      callback:res=>{
        this.getTableData();
      }
    });
   }

   
  operationLists=()=>{
    const { operationList } = this.props;

    let operationData=[];
    if(operationList&&operationList.length>0){
      operationData  = operationList.map(item=>{
      return   <Option key={item.EnterpriseID} value={item.EnterpriseID}>{item.Company}</Option>
      })
  
    }

    return operationData;
  }
  cancel=()=>{
    this.setState({
      visible:false,
    })

  }
  typeChange=(value)=>{
     if(value==1){
       this.setState({unitDisabled:true})
       this.props.form.setFieldsValue({OperationCompany:undefined})
     }else{
      this.setState({unitDisabled:false})
     }
  }
  render() {
    const {
      form:{ getFieldDecorator,getFieldValue },
      confirmLoading
    } = this.props;
    const { unitDisabled } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    return (
        // <BreadcrumbWrapper >
        <Card
          bordered={false}
          title={
        <>
       <Button
         style={{ margin: '0 5px' }}
         onClick={this.add}
         type='primary'
       >
         <PlusOutlined />
         添加
       </Button>
          {/* <Button
            style={{marginLeft: 10 }}
               onClick={() => {
              history.go(-1);
          }}
            ><LeftOutlined />返回
          </Button> */}
          </>
          }
        >
          <>

            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              loading={this.props.loading}
              columns={this.columns}
              dataSource={this.props.tableDatas}
            />
       <Modal
        title={this.state.type==='edit'? '编辑运维信息':'添加运维信息'}
        visible={this.state.visible}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.cancel}
        className={styles.operationInfoModal}
        destroyOnClose
      >
        <Form
      name="basic"
      ref={this.formRef}
    >

      <Row>
         <Form.Item label="运维类型" >
         {getFieldDecorator('Type', {   rules: [{required: true,  message: '请选择运维类型！'}],   })(
          <Select   placeholder="请选择运维类型"  allowClear onChange={this.typeChange} >  
                               <Option value={1}>自运维</Option>  
                               <Option value={2}>第三方运维</Option>                                  
                  </Select>
                   )}
      </Form.Item>
      </Row>
      <Row>
        <Form.Item  label="运维单位">
           {getFieldDecorator('OperationCompany', {   rules: [{required: !unitDisabled,  message: '请输入运维单位！'}],   })(
                               <Select
                                     placeholder="请选择运维单位"
                                     allowClear
                                     disabled={unitDisabled}
                                   >  
                                   {
                                    this.operationLists()
                                   }
                                   </Select>
                   )}
         </Form.Item>
      </Row>
      <Row>
         <Form.Item label="起止时间">
         {getFieldDecorator('Time', {   rules: [{required: true,  message: '请选择起止时间！'}],   })(<RangePicker/>)}
      </Form.Item>
      <Form.Item label="ID"   hidden>
         {getFieldDecorator('ID')(<Input />)}
      </Form.Item> 
      </Row>
    </Form>
      </Modal>
          </>
        </Card>
        // </BreadcrumbWrapper >
    );
  }
}
