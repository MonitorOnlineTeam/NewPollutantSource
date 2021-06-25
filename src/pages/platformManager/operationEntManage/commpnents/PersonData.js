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
  Switch,
  message
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
import flowanalysismodel from '@/models/flowanalysismodel';
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
  editFormData:autoForm.editFormData,
  operationList:operationPerson.operationList,
  duplicateList:operationPerson.duplicateList
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
      fileList: [],
      uid:cuid(),
      uidWater:cuid(),
      uidGas:cuid(),
      waterPhoto:[],
      gasPhoto:[],
      switchGas:true,
      switchWater:true,
      pageSize:20,
      pageIndex:1
    };
    this.columns =  [
      {
        title: <span>运维单位</span>,
        dataIndex: 'Personnellist',
        key: 'Personnellist',
        align: 'center',
      //   render: (text, record) => {     
      //     return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
      //  },
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
        render: (text, record) => {     
          return  <div style={{width:'100%'}}>{text==1?'男':'女'}</div>
       },
      },
      {
        title: <span>手机号</span>,
        dataIndex: 'Phone',
        key: 'Phone',
        align: 'center'
      },
      {
        title: <span>身份证号</span>,
        dataIndex: 'IdCertificates',
        key: 'IdCertificates',
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
                 <a href="#" onClick={()=>{this.edit(record)}} >编辑</a>
                 <a href="javasctipt:;"  style={{padding:'0 5px'}} onClick={()=>{this.see(record)}} >详情</a>
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


    // dispatch({
    //   type: 'autoForm/getPageConfig',
    //   payload: {
    //     configId,
    //   },
    // });
    dispatch({
      type: 'operationPerson/listOperationMaintenanceEnterprise',
      payload: {},
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
    this.setState({
      pageIndex: 1,
    })
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

    const {dispatch,form:{setFieldsValue},editFormData} = this.props;

    this.setState({
      visible:true,
      switchGas:true,
      switchWater:true,
      type:'edit',
    },()=>{
      // 获取详情页面数据
      dispatch({
        type: 'autoForm/getDetailsConfigInfo',
        payload: {
          configId:'OperationMaintenancePersonnel',
        },
      });

        dispatch({
          type: 'autoForm/getFormDatas',
          payload: {
            configId:'OperationMaintenancePersonnel',
            "dbo.T_Bas_OperationMaintenancePersonnel.PersonnelID":row.PersonnelID
          },
          callback:res=>{
            if (res) {
              let operationData = res;
              this.setState({
                uid:operationData.AttachmentID?operationData.AttachmentID:cuid(),
                uidWater:operationData.WaterPhoto?operationData.WaterPhoto:cuid(),
                uidGas:operationData.GasPhoto?operationData.GasPhoto:cuid(),
              })
              setFieldsValue({
                PersonnelID:operationData['dbo.T_Bas_OperationMaintenancePersonnel.PersonnelID'],
                EnterpriseID:operationData['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID'],
                PersonnelName:operationData.PersonnelName,
                Gender:operationData.Gender,
                Phone:operationData.Phone,
                IdCertificates:operationData.IdCertificates,
                Education:operationData.Education,
                Major:operationData.Major,
                School:operationData.School,
                StartWorkTime:operationData.StartWorkTime? moment(moment(operationData.StartWorkTime).format('YYYY-MM-DD')):'',//参加工作时间
                Position:operationData.Position,
                WaterCertificateNumber:operationData.WaterCertificateNumber,
                WaterEndCertificatesTime:operationData.WaterEndCertificatesTime?moment(moment(operationData.WaterEndCertificatesTime).format('YYYY-MM-DD')):'',//到期时间 水
                WaterStartCertificatesTime:operationData.WaterStartCertificatesTime?moment(moment(operationData.WaterStartCertificatesTime).format('YYYY-MM-DD')):'',//发证时间 水
                WaterPhoto:operationData.WaterPhoto,
                GasCertificateNumber:operationData.GasCertificateNumber,
                GasEndCertificatesTime:operationData.GasEndCertificatesTime?moment(moment(operationData.GasEndCertificatesTime).format('YYYY-MM-DD')):'',//到期时间 气
                GasStartCertificatesTime:operationData.GasStartCertificatesTime?moment(moment(operationData.GasStartCertificatesTime).format('YYYY-MM-DD')):'',//发证时间 气
                GasPhoto:operationData.GasPhoto,
                
              })
              dispatch({
                type: 'autoForm/getAttachmentLists',
                payload: {
                  FileUuid: operationData.AttachmentID,
                },
                callback:res=>{
                  this.setState({
                    fileList:res
                  })
                }
               });
               dispatch({
                type: 'autoForm/getAttachmentLists',
                payload: {
                  FileUuid: operationData.WaterPhoto,
                },
                callback:res=>{
                  this.setState({
                    waterPhoto:res
                  })
                }
               });
               dispatch({
                type: 'autoForm/getAttachmentLists',
                payload: {
                  FileUuid: operationData.GasPhoto,
                },
                callback:res=>{
                  this.setState({
                    gasPhoto:res
                  })
                }
               });
            }
          }
        })

    })
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
     const {uid,uidGas,uidWater,type} = this.state;
     const { duplicateList } = this.props;
     this.props.form.setFieldsValue({ AttachmentID:this.state.fileList.length>0? this.state.uid : ''})
     this.props.form.setFieldsValue({ WaterPhoto:this.state.waterPhoto.length>0? this.state.uidWater : ''})
     this.props.form.setFieldsValue({ GasPhoto:this.state.gasPhoto.length>0? this.state.uidGas : ''})

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      
       let flag=true;
      
       duplicateList.length>0&&type==='add'&&duplicateList.map(item=>{
          
          if(item.EnterpriseID===values.EnterpriseID&&item.Phone===values.Phone&&item.PersonnelName===values.PersonnelName){
            flag = false;
            message.error('运维单位、姓名、手机号存在重复信息');
          }
       })
        if(flag){
        this.props.dispatch({
              type: type==='add'? 'autoForm/add' : 'autoForm/saveEdit',
              payload: {
              configId:'OperationMaintenancePersonnel',
              FormData:{...values,
                StartWorkTime:values.StartWorkTime&&moment(values.StartWorkTime).format('YYYY-MM-DD'),
                WaterEndCertificatesTime:values.WaterEndCertificatesTime&&moment(values.WaterEndCertificatesTime).format('YYYY-MM-DD'),
                WaterStartCertificatesTime:values.WaterStartCertificatesTime&&moment(values.WaterStartCertificatesTime).format('YYYY-MM-DD'),
                GasEndCertificatesTime:values.GasEndCertificatesTime&&moment(values.GasEndCertificatesTime).format('YYYY-MM-DD'),
                GasStartCertificatesTime:values.GasStartCertificatesTime&&moment(values.GasStartCertificatesTime).format('YYYY-MM-DD'),

              }
           },
          })

        this.setState({
             visible:false,
            uid:cuid(),
            uidWater:cuid(),
            uidGas:cuid(),
        },()=>{
          this.getTableData();
        })
      }
      }
    });
   }
   add=()=>{
    const {dispatch,form:{setFieldsValue}} = this.props;

     this.setState({
      visible:true,
      fileList:'',
      type:'add',
      uid:cuid(),
      uidWater:cuid(),
      uidGas:cuid(),
    })
    setFieldsValue({
      Gender:'', 
      switchGas:true,
      switchWater:true
    })
   }
   see=(record)=>{
    router.push('/operations/operationEntManage/operationPerson/detail/'+'OperationMaintenancePersonnel'+ '/' + record.PersonnelID)
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
   handleChange = (info) => { //change 事件仅当用户交互才会触发。该设计是为了防止在 change 事件中调用 setFieldsValue 导致的循环问题。
     
    //  if (info.file.status === 'done') {
      this.setState({
        fileList: info.fileList
      })
    // }
    if (info.file.status === 'error') {
      message.error('上传文件失败！')
    }

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

  normFileWater = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    this.setState({
      waterPhoto:e.fileList
    })
    return e && e.fileList;
  };
  normFileGas = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    this.setState({
      gasPhoto:e.fileList
    })
    return e && e.fileList;
  };
  operationLists=()=>{
    const { operationList } = this.props;

    let operationData=[];
    if(operationList&&operationList.length>0){
      operationData  = operationList.map(item=>{
      return   <Option title={item.Company} key={item.EnterpriseID} value={item.EnterpriseID}>{item.Company}</Option>
      })
  
    }

    return operationData;
  }
  cancel=()=>{
    this.setState({
      visible:false,
      switchGas:true,
      switchWater:true,
      fileList:[],
      waterPhoto:[],
      gasPhoto:[]
    })
    // this.props.form.setFieldsValue({

    // })
  }
  gasEndDisabledDate=(current)=>{
    const time = this.props.form.getFieldValue('GasStartCertificatesTime')
    return time&&current && current < moment(time).endOf('day');
  }
  gasStartDisabledDate=(current)=>{
    const time = this.props.form.getFieldValue('GasEndCertificatesTime')
    return time&&current && current > moment(time).startOf('day');
  }

  waterEndDisabledDate=(current)=>{
    const time = this.props.form.getFieldValue('WaterStartCertificatesTime')
    return time&&current && current < moment(time).endOf('day');
  }
  waterStartDisabledDate=(current)=>{
    const time = this.props.form.getFieldValue('WaterEndCertificatesTime')
    return time&&current && current > moment(time).startOf('day');
  }



  render() {
    const {
      Atmosphere,
      exloading,
      queryPar: {  type,col1 },
      match: { params: { configId } },
      form:{ getFieldDecorator,getFieldValue },
    
    } = this.props;
    const { previewVisible, previewImage, fileList,waterPhoto,gasPhoto} = this.state;
  
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传照片</div>
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
                  <Input placeholder='请输入运维单位' onChange={this.operationUnit}/>
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
                 <Option key='1' value='2,1'>有运维工证书(气)</Option>
                 <Option key='2' value='2,2'> 无运维工证书(气)</Option>
                 <Option key='3' value='1,1'>有运维工证书(水)</Option>
                 <Option key='4' value='1,2'> 无运维工证书(水)</Option>
                  </Select>
              </Form.Item>
              <Form.Item label=''>
              <Select
                    placeholder="运维证书是否过期"
                    onChange={this.operationBookOverdue}
                    defaultValue={col1?col1:undefined}
                    allowClear
                    style={{width:'170px'}}
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
              pagination={{
                pageSize: this.state.pageSize,
                total: this.props.tableDatas.length,
                showSizeChanger: true,
                current:this.state.pageIndex,
                onChange: (current, size) => {
                  this.setState({
                    pageSize: size,
                    pageIndex: current,
                  })
                },
                pageSizeOptions: ['10', '20', '30', '40', '100'],
              }}
            />
       <Modal
        title={this.state.type==='edit'? '编辑运维人员':'添加运维人员'}
        visible={this.state.visible}
        onOk={this.onFinish}
        // footer={null}
        // confirmLoading={confirmLoading}
        onCancel={this.cancel}
        className={styles.operationModal}
        destroyOnClose
      >
        <Form
      name="basic"
      ref={this.formRef}
    >
      <Row>
        <Col span={12}>
        <Form.Item  label="运维单位">
           {getFieldDecorator('EnterpriseID', {   rules: [{required: true,  message: '请输入运维单位！'}],   })(
                               <Select
                                     placeholder="请选择运维单位"
                                     allowClear
                                   >  
                                   {
                                    this.operationLists()
                                   }
                                
                                   </Select>
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
                          <Radio value="1">男</Radio>
                          <Radio value="2">女</Radio>
                        </Radio.Group>
                   )}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label="手机号"  >
      {getFieldDecorator('Phone', {   rules: [{required: true,  message: '请输入手机号！'}],   })( <Input placeholder="请输入手机号" />)}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="身份证号">
         {getFieldDecorator('IdCertificates')( <Input placeholder="请输入身份证号"/>)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='学历' >
      {getFieldDecorator('Education')(<Select placeholder="请选择学历">
          <Option value="1">小学</Option>
          <Option value="2">初中</Option>
          <Option value="3">高中</Option>
          <Option value="4">专科</Option>
          <Option value="5">本科</Option>
          <Option value="6">硕士</Option>
          <Option value="7">博士</Option>

        </Select>)}
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
      <Form.Item  label='毕业学校' >
      {getFieldDecorator('School')(<Input placeholder="请输入毕业学校"/>)}
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
         {getFieldDecorator('AttachmentID',  
          // {   rules: [{required: true,  message: '请上传照片！'}],   }
          )(
         <Upload
         action="/api/rest/PollutantSourceApi/UploadApi/PostFiles"
         listType="picture-card"
         fileList={fileList}
         onPreview={this.handlePreview}
         onChange={this.handleChange}
         style={{width:'180px'}}
         accept='image/*'
         data={{
          FileUuid: this.state.uid,
          FileActualType: '0',
        }}
        onRemove={
          (file)=>{
            if (!file.error) {
              this.props.dispatch({
                type: "autoForm/deleteAttach",
                payload: {
                  FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
                  Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
                }
              })
            }
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
         <Switch  defaultChecked onChange={(checked)=>{this.setState({
              switchGas:checked
         })}}/>
      </Form.Item>
       </Col>
      </Row> 

     {this.state.switchGas?<> <Row>
        <Col span={12}>
         <Form.Item label="证书编号"  >
         {getFieldDecorator('GasCertificateNumber')( <Input placeholder="请输入证书编号"/>)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='发证日期'>
      {getFieldDecorator('GasStartCertificatesTime')( <DatePicker  disabledDate={this.gasStartDisabledDate}/>)}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="到期时间" name="username"  >
         {getFieldDecorator('GasEndCertificatesTime')( <DatePicker  disabledDate={this.gasEndDisabledDate} />)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="证书照片"  className='certificatePhoto' extra="">
          {getFieldDecorator('GasPhoto', {
            getValueFromEvent: this.normFileGas,
          })( 
            <Upload 
             action="/api/rest/PollutantSourceApi/UploadApi/PostFiles"
             accept='image/*'
             fileList={gasPhoto}
             data={{
              FileUuid: this.state.uidGas,
              FileActualType: '0',
            }}
            onRemove={
              (file)=>{
                if (!file.error) {
                  this.props.dispatch({
                    type: "autoForm/deleteAttach",
                    payload: {
                      FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
                      Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
                    }
                  })
                }
              }

            }
             >
              <Button style={{width:180}}>
              <UploadOutlined />  请选择证书照片
              </Button>
              <Tooltip title="需包含照片、姓名、身份证号、证书编号、有效期"><QuestionCircleOutlined  style={{paddingLeft:5}}/></Tooltip>

            </Upload>
           )} 
        </Form.Item>
      </Col>
      </Row></>:null}


     <Row> 
        <Col span={12}>
    <Form.Item
        label="运维证书相关信息(水)"
      >
      <Switch defaultChecked  onChange={(checked)=>{this.setState({
              switchWater:checked
         })}}/>
      </Form.Item>
       </Col>
      </Row> 
      {this.state.switchWater? <> <Row>
        <Col span={12}>
         <Form.Item label="证书编号" >
         {getFieldDecorator('WaterCertificateNumber')( <Input  placeholder="请输入证书编号"/>)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item  label='发证日期' >
      {getFieldDecorator('WaterStartCertificatesTime')( <DatePicker disabledDate={this.waterStartDisabledDate} />)}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={12}>
         <Form.Item label="到期时间"   >
         {getFieldDecorator('WaterEndCertificatesTime')(<DatePicker disabledDate={this.waterEndDisabledDate} />)}
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item label="证书照片" extra="">
         {getFieldDecorator('WaterPhoto', { 
            // valuePropName: 'fileList',
            getValueFromEvent: this.normFileWater,
          })( 
            <Upload name="logo" className='certificatePhoto' action="/api/rest/PollutantSourceApi/UploadApi/PostFiles"
            accept='image/*'
            fileList={waterPhoto}
            data={{
             FileUuid: this.state.uidWater,
             FileActualType: '0',
           }}
           onRemove={
            (file)=>{
              if (!file.error) {
                this.props.dispatch({
                  type: "autoForm/deleteAttach",
                  payload: {
                    FileName: file.response && file.response.Datas ? file.response.Datas : file.name,
                    Guid: file.response && file.response.Datas ? file.response.Datas : file.name,
                  }
                })
              }
            }}
            >
              <Button style={{width:180}}>
              <UploadOutlined /> 请选择证书照片
              </Button>
              <Tooltip title="需包含照片、姓名、身份证号、证书编号、有效期"><QuestionCircleOutlined  style={{paddingLeft:5}}/></Tooltip>

            </Upload>
           )} 
        </Form.Item>
      </Col>
      </Row> </> : null}

      <Form.Item label="ID"   hidden>
         {getFieldDecorator('PersonnelID')(<Input />)}
      </Form.Item> 
      {/* <Form.Item style={{textAlign:'right'}}>
        <Button type="primary"  onClick={this.onFinish}>
          提交
        </Button>
      </Form.Item> */}
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
