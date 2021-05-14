/**
 * 功  能：运维人员管理
 * 创建人：jab
 * 创建时间：2021.05.08
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
  Upload
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import DatePickerTool from '@/components/RangePicker/DatePickerTool';
import { router } from 'umi';
import styles from '../operationPerson/style.less';
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
  UploadOutlined
} from '@ant-design/icons';
const { Search } = Input;
const { MonthPicker } = DatePicker;
const { Option } = Select;
const { RangePicker } = DatePicker;
const monthFormat = 'YYYY-MM';

const pageUrl = {
  updateState: 'operationPerson/updateState',
  getData: 'operationPerson/selectOperationMaintenancePersonnel',
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@connect(({ loading, operationPerson,autoForm,common}) => ({
  priseList: operationPerson.priseList,
  exloading:operationPerson.exloading,
  loading: loading.effects[pageUrl.getData],
  total: operationPerson.total,
  tableDatas: operationPerson.tableDatas,
  queryPar: operationPerson.queryPar,
  regionList: autoForm.regionList,
  attentionList:operationPerson.attentionList,
  atmoStationList:common.atmoStationList
}))
@Form.create()
export default class PersonData extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      visible:false,
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
    };
    this.columns =  [
      {
        title: <span>运维单位</span>,
        dataIndex: 'Personnellist',
        key: 'Personnellist',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>姓名</span>,
        dataIndex: 'PersonnelName',
        key: 'PersonnelName',
        align: 'center',
      },
      {
        title: <span>性别</span>,
        dataIndex: 'Gender',
        key: 'Gender',
        align: 'center',
      },
      {
        title: <span>手机号</span>,
        dataIndex: 'Phone',
        key: 'Phone',
        align: 'center'
      },
      {
        title: <span>身份证号</span>,
        dataIndex: 'Identity',
        key: 'Identity',
        align: 'center',
      },
      {
        title: <span>运维证书编号(气)</span>,
        dataIndex: 'GasCertificateNumber',
        key: 'GasCertificateNumber',
        align: 'center',
      },
      {
        title: <span>运维证书编号(水)</span>,
        dataIndex: 'WaterCertificateNumber',
        key: 'WaterCertificateNumber',
        align: 'center',
      },
      {
        title: <span>操作</span>,
        dataIndex: 'x',
        key: 'x',
        align: 'center',
        render: (text, record) =>{
          return  <span>
                 <a href="#" onClick={()=>{this.see(record)}} >查看</a>
                 <a href="#" style={{padding:'0 5px'}} onClick={()=>{this.edit(record)}} >编辑</a>
                 <Popconfirm  title="确定要删除此条信息吗？" onConfirm={() => this.del(record)} okText="是" cancelText="否">
                 <a href="#" >删除</a>
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
    const {dispatch, match: { params: { configId } }} = this.props;


    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId,
      },
    });
  

    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };

  getTableData = () => {
    const { dispatch, queryPar } = this.props;
    dispatch({
      type: pageUrl.getData,
      payload: { ...queryPar },
    });
  };



  
  //查询事件
  queryClick = () => {

    const {queryPar: {dataType }, } = this.props;
   

    this.getTableData();
  };


  
  onRef1 = (ref) => {
    this.child = ref;
  }
   

   edit=()=>{  //编辑
    this.setState({
      visible:true
    })
   }


   operationUnit=(e)=>{ //运维单位
    this.updateQueryState({Personnellist:e.target?e.target.value:''})
   } 
   operationName=(e)=>{ //姓名
    this.updateQueryState({PersonnelName:e.target?e.target.value:''})
   }
   operationBook=(value)=>{
     this.updateQueryState({type:value?value:''})
   }

   operationBookOverdue=(value)=>{
    this.updateQueryState({col1:value?value:''})
   }
   onFinish=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
   }
   add=()=>{

   }
   see=()=>{

   }
   del=(row)=>{ //删除
    
    this.props.dispatch({
      type: 'operationPerson/deleteOperationMaintenancePersonnel',
      payload: { PersonnelID:row.PersonnelID },
      callback:res=>{
        this.getTableData();
      }
    });
   }
   handleChange = ({ fileList }) => this.setState({ fileList });  //头像
   handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  render() {
    const {
      Atmosphere,
      exloading,
      queryPar: {  type,col1 },
      match: { params: { configId } },
      form:{ getFieldDecorator }
    } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
        <Card
          bordered={false}
          title={
            <>
              <Form layout="inline">
            
              <Row>
              <Form.Item label=''>
              <Input placeholder='请输入运维公司' onChange={this.operationUnit}/>
              </Form.Item>
              <Form.Item label=''>
                  <Input placeholder='请输入姓名' onChange={this.operationName}/>
              </Form.Item>
              <Form.Item label=''>
              <Select
                    placeholder="是否有运维工证书"
                    onChange={this.operationBook}
                    allowClear
                    defaultValue={type}
                    style={{width:'150px'}}
                  >  
                 <Option key='1' value='1'>有运维工证书(气)</Option>
                 <Option key='2' value='2'> 无运维工证书(气)</Option>
                 <Option key='3' value='3'>有运维工证书(水)</Option>
                 <Option key='4' value='4'> 无运维工证书(水)</Option>
                  </Select>
              </Form.Item>
              <Form.Item label=''>
              <Select
                    placeholder="证书是否过期"
                    onChange={this.operationBookOverdue}
                    defaultValue={col1}
                    allowClear
                    style={{width:'150px'}}
                  >  
                 <Option key='1' value='1'>证书已过期</Option>
                 <Option key='2' value='2'> 证书未过期</Option>
                  </Select>
              </Form.Item>
              <Form.Item>
             <Button style={{ marginLeft: '6px' }} type="primary" onClick={this.queryClick}> 查询 </Button>
       <Button
         style={{ margin: '0 5px' }}
         onClick={this.add}
         loading={exloading}
       >
         添加
       </Button>
     </Form.Item>
                </Row>
                
              </Form>
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
        title={'运维人员'}
        visible={this.state.visible}
        // onOk={this.handleOk}
        footer={null}
        // confirmLoading={confirmLoading}
        onCancel={()=>{this.setState({visible:false})}}
        className={styles.operationModal}
      >
        <Form
      name="basic"
      ref={this.formRef}
    >
      <Row>
        <Col span={12}>
        <Form.Item  label="运维人员">
           {getFieldDecorator('Device_Port', {   rules: [{required: true,  message: '请输入运维人员！'}],   })(
                  <Input placeholder="请输入运维人员" />,
                   )}
         </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="姓名"
        name="password"
        required
        rules={[
          {
            required: true,
          },
        ]}
      >
           {getFieldDecorator('Device_Port', {   rules: [{required: true,  message: '请输入姓名！'}],   })(
                  <Input placeholder="请输入姓名" />,
                   )}
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
         <Form.Item label="性别" name="username"  >
         {getFieldDecorator('Device_Port', {   rules: [{required: true,  message: '请输入性别！'}],   })(
                          <Radio.Group>
                          <Radio value="a">男</Radio>
                          <Radio value="b">女</Radio>
                        </Radio.Group>
                   )}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label="手机号"  name="password" >
        <Input/>
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="专业" name="username"   >
          <Input/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='学历'  name="password" >
      <Select placeholder="请选择专业">
          <Option value="china">China</Option>
          <Option value="usa">U.S.A</Option>
        </Select>
      </Form.Item>
      </Col>
      </Row>


      <Row>
        <Col span={12}>
         <Form.Item label="参加工作时间" name="username"  >
          <Input/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='职位'  name="password" >
        <Input/>
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>

      <Form.Item label="照片" name="username" >
         {getFieldDecorator('Device_Port',
        //  {
        //     valuePropName: 'fileList',
        //     getValueFromEvent: this.handleChange,
        //   },   
          {   rules: [{required: true,  message: '请上传照片！'}],   })(
          <>
         <Upload
         action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
         listType="picture-card"
         fileList={fileList}
         onPreview={this.handlePreview}
         onChange={this.handleChange}
         style={{width:'180px'}}
       >
       {fileList.length >= 1 ? null : uploadButton}
       </Upload>
       <Tooltip title="1-2寸免冠正面照"><QuestionCircleOutlined  style={{paddingLeft:5}}/></Tooltip>
                 </>  )}
      </Form.Item>
      </Col>
      </Row>

     <Row> 
        <Col span={12}>
    <Form.Item
        label="运维证书相关信息(气)"
        name="username"
      >
        <Input/>
      </Form.Item>
       </Col>
      </Row> 

      <Row>
        <Col span={12}>
         <Form.Item label="证书编号" name="username"  >
          <Input/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='发证日期'  name="password" >
        <Input/>
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="到期时间" name="username"  >
          <Input/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="证书照片" extra="">
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do">
              <Button style={{width:180}}>
              <UploadOutlined /> Click to upload
              </Button>
              <Tooltip title="需包含照片、姓名、身份证号、证书编号、有效期"><QuestionCircleOutlined  style={{paddingLeft:5}}/></Tooltip>

            </Upload>,
          )}
        </Form.Item>
      </Col>
      </Row>


     <Row> 
        <Col span={12}>
    <Form.Item
        label="运维证书相关信息(水)"
        name="username"
        rules={[ { required: true,  message: 'Please input your username!', }, ]}
      >
        <Input/>
      </Form.Item>
       </Col>
      </Row> 
      <Row>
        <Col span={12}>
         <Form.Item label="证书编号" name="username"  >
          <Input/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='发证日期'  name="password" >
        <Input/>
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="到期时间" name="username"  >
          <Input/>
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="证书照片" extra="">
          {getFieldDecorator('upload2', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do">
              <Button style={{width:180}}>
              <UploadOutlined /> Click to upload
              </Button>
              <Tooltip title="需包含照片、姓名、身份证号、证书编号、有效期"><QuestionCircleOutlined  style={{paddingLeft:5}}/></Tooltip>

            </Upload>,
          )}
        </Form.Item>
      </Col>
      </Row>


      <Form.Item style={{textAlign:'right'}}>
        <Button type="primary"  onClick={this.onFinish}>
          提交
        </Button>
      </Form.Item>
    </Form>
      </Modal>


      <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
          {/* <img alt="example" style={{ width: '100%' }} src={previewImage} /> */}
        </Modal>
          </>
        </Card>
    );
  }
}
