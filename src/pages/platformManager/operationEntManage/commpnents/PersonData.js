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
import cuid from 'cuid';
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
  atmoStationList:common.atmoStationList,
  editFormData:autoForm.editFormData
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
    const {dispatch, match: { params: { configId } },form:{setFieldsValue}} = this.props;


    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId,
      },
    });
    setFieldsValue({switchGas:true})
    setFieldsValue({switchWater:true})
    setTimeout(() => {
      this.getTableData();
    });
  };
  updateQueryState = payload => {
    const { queryPar, dispatch} = this.props;

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
   

   edit=(row)=>{  //编辑

    const {dispatch,form:{setFieldsValue}} = this.props;
    this.setState({
      visible:true
    },()=>{
      setFieldsValue({PersonnelID:row.PersonnelID})
        dispatch({
          type: 'autoForm/getFormData',
          payload: {
            configId:'OperationMaintenancePersonnel',
            "dbo.T_Bas_OperationMaintenancePersonnel.PersonnelID":row.PersonnelID
          },
        })
    })
    // setTimeout(()=>{
    //   console.log(this.props.editFormData)
    // })
   }


   operationUnit=(e)=>{ //运维单位
    this.updateQueryState({Company:e.target?e.target.value:''})
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
     this.setState({
      visible:true
    })
   }
   see=(record)=>{
    router.push('/platformconfig/operationEntManage/operationPerson/detail/'+'OperationMaintenancePersonnel'+ '/' + record.PersonnelID)
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
   handleChange = (info) => {
     if (info.file.status === 'done') {
      // setFieldsValue({ cuid: uid })
      // setFieldsValue({ [fieldName]: uid })
    } else if (info.file.status === 'error') {
      message.error('上传文件失败！')
    }
    this.setState({
      fileList: info.fileList
    })
   }
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
      form:{ getFieldDecorator,getFieldValue }
    } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
  
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    console.log(this.props.form.getFieldsValue())
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
                    defaultValue={type?type:undefined}
                    style={{width:'170px'}}
                  >  
                 <Option key='1' value='1,1'>有运维工证书(气)</Option>
                 <Option key='2' value='1,2'> 无运维工证书(气)</Option>
                 <Option key='3' value='2,1'>有运维工证书(水)</Option>
                 <Option key='4' value='2,2'> 无运维工证书(水)</Option>
                  </Select>
              </Form.Item>
              <Form.Item label=''>
              <Select
                    placeholder="证书是否过期"
                    onChange={this.operationBookOverdue}
                    defaultValue={col1?col1:undefined}
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
        <Form.Item  label="运维单位">
           {getFieldDecorator('EnterpriseID', {   rules: [{required: true,  message: '请输入运维单位！'}],   })(
                  <Input placeholder="请输入运维单位" />,
                   )}
         </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        label="姓名"
      >
           {getFieldDecorator('PersonnelName', {   rules: [{required: true,  message: '请输入姓名！'}],   })(
                  <Input placeholder="请输入姓名" />,
                   )}
      </Form.Item>
      </Col>
      </Row>
      <Row>
        <Col span={12}>
         <Form.Item label="性别" >
         {getFieldDecorator('Gender', {   rules: [{required: true,  message: '请选择性别！'}],   })(
                          <Radio.Group>
                          <Radio value="a">男</Radio>
                          <Radio value="b">女</Radio>
                        </Radio.Group>
                   )}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label="手机号"  >
      {getFieldDecorator('Phone')( <Input placeholder="请输入姓名" />)}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="专业">
         {getFieldDecorator('Major')( <Input placeholder="请输入专业"/>)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='学历' >
      {getFieldDecorator('Education')(<Select placeholder="请选择学历">
          <Option value="china">China</Option>
          <Option value="usa">U.S.A</Option>
        </Select>)}
      </Form.Item>
      </Col>
      </Row>


      <Row>
        <Col span={12}>
         <Form.Item label="参加工作时间">
         {getFieldDecorator('StartWorkTime')(<DatePicker />)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='职位' >
      {getFieldDecorator('Position')(<Input placeholder="请输入职位"/>)}
      </Form.Item>
      </Col>
      </Row>

      <Row align='middle'>
        {/* <Col span={12}> */}

      <Form.Item label="照片" name="username" >
         {getFieldDecorator('photo',
        //  {
        //     valuePropName: 'fileListss',
        //     getValueFromEvent: this.handleChange,
        //   },   
          {   rules: [{required: true,  message: '请上传照片！'}],   })(
         <Upload
         action="/api/rest/PollutantSourceApi/UploadApi/PostFiles"
         listType="picture-card"
         fileList={fileList}
         onPreview={this.handlePreview}
         onChange={this.handleChange}
         style={{width:'180px'}}
         accept='image/*'
         data={{
          FileUuid: cuid(),
          FileActualType: '0',
        }}
       >
       {fileList.length >= 1 ? null : uploadButton}
       </Upload> )}
      </Form.Item>

     <Tooltip title="1-2寸免冠正面照"><QuestionCircleOutlined /></Tooltip>
      {/* </Col> */}
      </Row>

     <Row> 
        <Col span={12}>
    <Form.Item
        label="运维证书相关信息(气)"
      >
         {getFieldDecorator('switchGas')( <Switch  defaultChecked />)}
      </Form.Item>
       </Col>
      </Row> 

     {getFieldValue('switchGas')?<> <Row>
        <Col span={12}>
         <Form.Item label="证书编号"  >
         {getFieldDecorator('GasCertificateNumber')( <Input placeholder="请输入证书编号"/>)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='发证日期'>
      {getFieldDecorator('WaterStartCertificatesTime')( <DatePicker />)}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="到期时间" name="username"  >
         {getFieldDecorator('GasEndCertificatesTime')( <DatePicker />)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="证书照片"  className='certificatePhoto' extra="">
          {getFieldDecorator('GasPhoto', {
            getValueFromEvent: this.normFile,
          })(
            <Upload 
             action="/api/rest/PollutantSourceApi/UploadApi/PostFiles"
             accept='image/*'
             data={{
              FileUuid: cuid(),
              FileActualType: '0',
            }}
             >
              <Button style={{width:180}}>
              <UploadOutlined />  请选择证书照片
              </Button>
              <Tooltip title="需包含照片、姓名、身份证号、证书编号、有效期"><QuestionCircleOutlined  style={{paddingLeft:5}}/></Tooltip>

            </Upload>,
          )}
        </Form.Item>
      </Col>
      </Row></>:null}


     <Row> 
        <Col span={12}>
    <Form.Item
        label="运维证书相关信息(水)"
      >
       {getFieldDecorator('switchWater')( <Switch defaultChecked  />)}
      </Form.Item>
       </Col>
      </Row> 
      {getFieldValue('switchWater')? <> <Row>
        <Col span={12}>
         <Form.Item label="证书编号" >
         {getFieldDecorator('WaterPhoto')( <Input  placeholder="请输入证书编号"/>)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='发证日期' >
      {getFieldDecorator('WaterStartCertificatesTime')( <DatePicker />)}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="到期时间"   >
         {getFieldDecorator('WaterEndCertificatesTime')(<DatePicker />)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="证书照片" extra="">
          {getFieldDecorator('WaterPhoto', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" className='certificatePhoto' action="/api/rest/PollutantSourceApi/UploadApi/PostFiles"
            accept='image/*'
            data={{
             FileUuid: cuid(),
             FileActualType: '0',
           }}
            >
              <Button style={{width:180}}>
              <UploadOutlined /> 请选择证书照片
              </Button>
              <Tooltip title="需包含照片、姓名、身份证号、证书编号、有效期"><QuestionCircleOutlined  style={{paddingLeft:5}}/></Tooltip>

            </Upload>,
          )}
        </Form.Item>
      </Col>
      </Row> </> : null}

      <Form.Item label="ID"   hidden>
         {getFieldDecorator('PersonnelID')(<Input />)}
      </Form.Item>
      <Form.Item style={{textAlign:'right'}}>
        <Button type="primary"  onClick={this.onFinish}>
          提交
        </Button>
      </Form.Item>
    </Form>
      </Modal>


      <Modal visible={this.state.previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
          </>
        </Card>
    );
  }
}
