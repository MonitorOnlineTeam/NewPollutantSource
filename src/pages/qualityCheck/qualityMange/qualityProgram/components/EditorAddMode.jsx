


import React from 'react';

import {Form,Row,Col,Button,Input,Modal,DatePicker,Upload} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import { green } from '@ant-design/colors';
import { UploadOutlined,DownloadOutlined} from '@ant-design/icons';
const { TextArea } = Input;
/**
 * 质控方案管理
 * jab 2020.9.2
 */

@connect(({ qualityProData }) => ({
    tableDatas:qualityProData.tableDatas,
    total: qualityProData.total,
    tablewidth: qualityProData.tablewidth,
    tableLoading:qualityProData.tableLoading,
    standardParams:qualityProData.standardParams,
    editLoading:qualityProData.editLoading,
    editEchoData:qualityProData.editEchoData
}))

class EditorAddMode extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            modelTitle:"添加"
        };
    }

    componentDidMount(){
        const { onRef } = this.props;
        onRef && onRef(this);
    }

  editClickSubmit=()=>{
     this.handleCancel();
     this.props.reloadList()
  }

  submitClick=()=>{
    this.setState({visible:true})

     console.log(this.props.editEchoData)
  }

  editVisibleShow=()=>{
    this.setState({visible:true})
  }
  handleCancel=()=>{
    this.setState({visible:false})
  }

  handleOk = values => {
   this.formRef.current.validateFields().then((values) => {
    console.log("values=", values)
    // return;
    let actionType = this.props.id ? "qualityUser/updateOperatorUser" : "qualityUser/addOperator";
    this.props.dispatch({
      type: actionType,
      payload: {
        ...values,
        userId: this.state.uuid
      }
    })
  })
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  explainUpload=()=>{
    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
      return<> 
            <Row> <Upload {...props}>
             <Button  shape="round" size='small' type="primary"  icon={<UploadOutlined />} style={{fontSize:12}}>上传文件</Button>
            </Upload>
            <Button  shape="round" size='small' icon={<DownloadOutlined />} onClick={this.explainTemplate} style={{marginLeft:5,fontSize:12}}>
              下载模板
            </Button>
            </Row>
             <span style={{paddingTop:5,color:"#c6c6c6",fontSize:12}}>用户点击下载模板，在模板基础上进行修改后上传即可</span>
            </>
  }

  strategyUpload=()=>{
    const props = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
          authorization: 'authorization-text',
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
      return<> 
            <Row> <Upload {...props}>
             <Button  shape="round" size='small'  type="primary"  icon={<UploadOutlined />} style={{fontSize:12}}>上传文件</Button>
            </Upload>
            <Button  shape="round" size='small'   icon={<DownloadOutlined />} onClick={this.strategyTemplate} style={{marginLeft:5,fontSize:12}}>
              下载模板
            </Button>
            </Row>
             <span style={{paddingTop:5,color:"#c6c6c6",fontSize:12}}>用户点击下载模板，在模板基础上进行修改后上传即可</span>
            </>
  }
  explainTemplate=()=>{ //  下载模板  说明

  }
  strategyTemplate=()=>{ //下载模板 策略

  }
  render() {

    const {confirmLoading} = this.props;
    const { visible,modelTitle } = this.state;

    const layout = {  labelCol: { span: 5,  }, wrapperCol: { span: 19,   }  };
 

    const ExplainUpload = this.explainUpload;
    const StrategyUpload = this.strategyUpload;
    return <div>
        <Modal
          title={modelTitle}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
    <Form {...layout} ref={this.formRef} name="basic" initialValues={{remember: true, }}  >
     <Form.Item label="方案名称" name="username"  rules={[{ required: true, message: '请输入方案名称!',  },]}>
        <Input />
      </Form.Item>
      <Form.Item label="方案描述" name="username33"  rules={[{ required: true, message: '请输入方案描述!',  },]}>
       <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="制定人" name="username32"  rules={[{ required: true, message: '请输入制定人!',  },]}>
        <Input />
      </Form.Item>     
      <Form.Item label="制定日期" name="username3">
       <DatePicker defaultValue={moment(moment(new Date).format('YYYY-MM-DD'), 'YYYY-MM-DD')} disabled style={{width:"100%"}}/>
      </Form.Item> 
      <Form.Item label="质控说明文件" name="username328" >
        <ExplainUpload />  
      </Form.Item>  
      <Form.Item label="质控策略文件" name="username329">
       <StrategyUpload />
      </Form.Item>   
    </Form>
        </Modal>
     </div>;
  }
}

export default EditorAddMode;