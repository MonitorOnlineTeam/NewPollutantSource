


import React from 'react';

import {Form,Row,Col,Button,Input,Modal,DatePicker,Upload,message} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import { green } from '@ant-design/colors';
import { UploadOutlined,DownloadOutlined} from '@ant-design/icons';
import Cookie from 'js-cookie';
import config from '@/config'
import cuid from 'cuid';
const { TextArea } = Input;
/**
 * 质控方案管理
 * jab 2020.9.2
 */

@connect(({ qualityProData }) => ({
    addOrupdatePar:qualityProData.addOrupdatePar,
    editLoading:qualityProData.editLoading,
    editEchoData:qualityProData.editEchoData,
    echoType:qualityProData.echoType
}))

class EditorAddMode extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            uploadLoading:false,
            uid1:cuid(),
            uid2:cuid(),
            exfileList:[],
            delfileList:[]
        };
    }

    componentDidMount(){
        const { onRef,editEchoData } = this.props;
        onRef && onRef(this);

        
    }
    


  editVisibleShow=()=>{
    this.setState({visible:true},()=>{
      this.echoData();
    })

  }
  handleCancel=()=>{
    this.setState({visible:false})
  }
  echoData=()=>{ //回显数据
    const {echoType } = this.props; 

    if(echoType == "添加"){

    setTimeout(()=>{
      this.onReset();
      this.onAddFill();
    }) 
   }else{
      setTimeout(()=>{
        this.onReset();
        this.onEditFill();
      })
   }
  }
  onReset=()=>{
    this.formRef.current.resetFields();
  }

  onAddFill = () =>{
    this.formRef.current.setFieldsValue({
      DesignatedPerson: JSON.parse(Cookie.get('currentUser')).UserName,
      CreateTime:moment(moment(new Date).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss')
    });
    let {dispatch,addOrupdatePar} = this.props;
    addOrupdatePar = {
      ...addOrupdatePar,
      DesignatedPerson:JSON.parse(Cookie.get('currentUser')).UserName,
      CreateTime:moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
      DetailsFile:"",
      ProgrammeFile:""
    }
     dispatch({
        type: 'qualityProData/updateState',
        payload: { addOrupdatePar },
    });
  }

  onEditFill = () => {
    const { editEchoData } = this.props;
    this.formRef.current.setFieldsValue({
      QCAProgrammeName: editEchoData.QCAProgrammeName,
      Describe: editEchoData.Describe,
      DesignatedPerson: editEchoData.DesignatedPerson,
      CreateTime:moment(moment(editEchoData.CreateTime), 'YYYY-MM-DD HH:mm:ss'),
      DetailsFile:editEchoData.DetailsFile,
      ProgrammeFile:editEchoData.ProgrammeFile        
    });
    let {dispatch,addOrupdatePar} = this.props;
    addOrupdatePar = {
      ...addOrupdatePar,
      ID:editEchoData.ID,
      DesignatedPerson: editEchoData.DesignatedPerson,
      ProgrammeFile:editEchoData.ProgrammeFile,        
      QCAProgrammeName: editEchoData.QCAProgrammeName,
      Describe: editEchoData.Describe,
      CreateTime:moment(editEchoData.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
      DetailsFile:editEchoData.DetailsFile,
      ProgrammeFile:editEchoData.ProgrammeFile    
    }
     dispatch({
        type: 'qualityProData/updateState',
        payload: { addOrupdatePar },
    });
  };

  handleOk = values => {
   
   this.formRef.current.validateFields().then((values) => {
    let {dispatch,addOrupdatePar} = this.props;
    dispatch({
       type: 'qualityProData/addOrUpdQCAProgramme',
       payload: { ...addOrupdatePar},
       callback:(res)=>{
          this.setState({visible:false},()=>{
            this.props.reloadList();
          })
       }
     });
    })
  };

  uploadSet=(type)=>{
    var _this = this;
    let {dispatch,addOrupdatePar,echoType,editEchoData} = this.props;
    const { uid1,uid2 } = this.state;
    return {
      // name: 'file',
      action: "/api/rest/PollutantSourceApi/QCAProgrammeApi/UploadFiles",
      onChange(info) {

          if (info.file.status === 'done') {

            if(type == "explain"){
              addOrupdatePar = {
                ...addOrupdatePar,
                ProgrammeFile:uid1
              } 
              _this.formRef.current.setFieldsValue({
                ProgrammeFile: info.file,        
              });
            }else{
              addOrupdatePar = {
                ...addOrupdatePar,
                DetailsFile: uid2
              } 
              _this.formRef.current.setFieldsValue({
                DetailsFile: uid2,        
              });
            }
            dispatch({
              type: 'qualityProData/updateState',
              payload: { addOrupdatePar },
          });
             _this.setState({
               uid1:cuid(),
               uid2:cuid()
             })
              message.success("上传成功！")

          } else if (info.file.status === 'error') {
                  message.error(info.file.response.Message);
          }
      },
      onRemove(){
        if( type == "explain"){
          _this.formRef.current.setFieldsValue({
            ProgrammeFile: null,        
          });
          addOrupdatePar = {
            ...addOrupdatePar,
            ProgrammeFile: ""
          }
        }else{
          _this.formRef.current.setFieldsValue({
            DetailsFile: null,        
          });
          addOrupdatePar = {
            ...addOrupdatePar,
            DetailsFile: ""
          }
        }
        dispatch({
          type: 'qualityProData/updateState',
          payload: { addOrupdatePar },
        });
      },
      accept: type == "explain"? ".docx" : ".xls,.xlsx",
      showUploadList: true,
      data: {
          FileUuid: type == "explain"? uid1 : uid2,
          FileActualType:"0",
          ssoToken: Cookie.get(config.cookieName)
      },
      defaultFileList: this.defaultFileList(type)
  };
  }
  defaultFileList=(type)=>{
    const {echoType,editEchoData,addOrupdatePar} = this.props;
      if(echoType!="添加"){
         if(type == "explain"){
           return  [{
            uid: editEchoData.ProgrammeFile,
            name: editEchoData.ProgrammeFileName,
            status: 'done',
            url: `${config.uploadHost}upload/${editEchoData.ProgrammeFileName}`,
          }]
         }else{
           return [{
            uid: editEchoData.DetailsFile,
            name: editEchoData.DetailsFileName,
            status: 'done',
            url: `${config.uploadHost}upload/${editEchoData.DetailsFileName}`,
          }]
         }
      }else{
        return [];
      }
      
     

  }
  fileAbled=(type,)=>{
    let {addOrupdatePar} = this.props;
     if(type == "explain"){
       return addOrupdatePar.ProgrammeFile;
     }else{
      return addOrupdatePar.DetailsFile;
     }
  }
  explainUpload=()=>{

    
    const {echoType} = this.props;
 

      return<> 
            <Row> <Upload  {...this.uploadSet("explain")}>
             <Button  disabled={this.fileAbled("explain")}  shape="round" size='small' type="primary"  icon={<UploadOutlined />} style={{fontSize:12}}>上传文件</Button>
            </Upload>
            <Button   style={{position:"absolute",left:100,fontSize:12}} shape="round" size='small' icon={<DownloadOutlined />} onClick={this.explainTemplate} >
              下载模板
            </Button>
            {echoType=="添加" ? <span style={{paddingTop:5,color:"#c6c6c6",fontSize:12}}>用户点击下载模板，在模板基础上进行修改后上传即可</span>:<></>}
            </Row>
         
            </>
  }

  strategyUpload=()=>{
    const {echoType} = this.props;
      return<> 
            <Row> <Upload {...this.uploadSet("detail")}>
             <Button disabled={this.fileAbled("detail")} shape="round" size='small'  type="primary"  icon={<UploadOutlined />} style={{fontSize:12}}>上传文件</Button>
            </Upload>
            <Button  style={{position:"absolute",left:100,fontSize:12}} shape="round" size='small'   icon={<DownloadOutlined />} onClick={this.strategyTemplate} >
              下载模板
            </Button>
            </Row>
            {echoType=="添加" ?   <span style={{paddingTop:5,color:"#c6c6c6",fontSize:12}}>用户点击下载模板，在模板基础上进行修改后上传即可</span>:<></>}
            </>
  }
  explainTemplate=()=>{ //  下载模板  说明
     window.location.href= `${config.uploadHost}upload/质控方案模板.docx` 
  }
  strategyTemplate=()=>{ //下载模板 策略
    window.location.href= `${config.uploadHost}upload/质控方案模板.xlsx` 
  }

  programmeChange=(e)=>{
    let {dispatch,addOrupdatePar} = this.props;
    addOrupdatePar = {
      ...addOrupdatePar,
      QCAProgrammeName:e.target.value
    }
     dispatch({
        type: 'qualityProData/updateState',
        payload: { addOrupdatePar },
    });
  }
  describeChange=(e)=>{
    let {dispatch,addOrupdatePar} = this.props;
    addOrupdatePar = {
      ...addOrupdatePar,
      Describe:e.target.value
    }
     dispatch({
        type: 'qualityProData/updateState',
        payload: { addOrupdatePar },
    });
  }
  render() {

    const {editLoading,echoType} = this.props;
    const { visible } = this.state;

    const layout = {  labelCol: { span: 6,  }, wrapperCol: { span: 18,   }  };
 

    const ExplainUpload = this.explainUpload;
    const StrategyUpload = this.strategyUpload;
    return <div>
        <Modal
          title={echoType}
          visible={visible}
          confirmLoading={editLoading}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
    <Form {...layout} ref={this.formRef} name="basic" initialValues={{remember: true, }}  >
     <Form.Item label="方案名称" name="QCAProgrammeName"  rules={[{ required: true, message: '请输入方案名称!',  },]}>
        <Input  onChange={this.programmeChange}/>
      </Form.Item>
      <Form.Item label="方案描述" name="Describe"  rules={[{ required: true, message: '请输入方案描述!',  },]}>
       <TextArea rows={4}  onChange={this.describeChange}/>
      </Form.Item>
      <Form.Item  label="制定人" name="DesignatedPerson"  rules={[{ required: true, message: '请输入制定人!',  },]}>
        <Input disabled/>
      </Form.Item>
      <Form.Item label="制定日期" name="CreateTime" rules={[{ required: true, message: '请输入制定日期!',  },]}>
       <DatePicker  style={{width:"100%"}} disabled format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item > 
       <Form.Item label="质控说明文件" name="ProgrammeFile" rules={[{ required: true, message: '请上传质控说明文件!',  },]}>
        <ExplainUpload /> 
      </Form.Item>
  
      <Form.Item label="质控策略文件" name="DetailsFile" rules={[{ required: true, message: '请上传质控策略文件!',  },]}>
       <StrategyUpload />
      </Form.Item>  
    </Form>
        </Modal>
     </div>;
  }
}

export default EditorAddMode;