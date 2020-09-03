


import React from 'react';

import {Form,Row,Col,Button,Input,Modal,DatePicker,TreeSelect} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import { green } from '@ant-design/colors';
import { UploadOutlined,DownloadOutlined} from '@ant-design/icons';
const { TextArea } = Input;
const { SHOW_PARENT, TreeNode } = TreeSelect;
/**
 * 质控方案管理
 * jab 2020.9.2
 */

@connect(({ qualityProData,common }) => ({
    tableDatas:qualityProData.tableDatas,
    total: qualityProData.total,
    tablewidth: qualityProData.tablewidth,
    tableLoading:qualityProData.tableLoading,
    standardParams:qualityProData.standardParams,
    applyLoading:qualityProData.applyLoading,
    editEchoData:qualityProData.editEchoData,
    entAndPointList: common.entAndPointList,
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
        this.getEntAndPointList()
    }
  // 获取企业和排口
  getEntAndPointList = () => {
    this.props.dispatch({
      type: "common/getEntAndPointList",
      payload: { "Status": [], "RunState": "1", "PollutantTypes": "1,2" }
    })
  }

  editClickSubmit=()=>{
     this.handleCancel();
     this.props.reloadList()
  }

  submitClick=()=>{
    this.setState({visible:true})

     console.log(this.props.editEchoData)
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


  applyVisibleShow=()=>{
    this.setState({visible:true})
  }
  render() {

    const {applyLoading,entAndPointList} = this.props;
    const { visible,modelTitle } = this.state;

    const layout = {  labelCol: { span: 6,  }, wrapperCol: { span:18,   }  };
    const tProps = {
        treeData: entAndPointList,
        treeDefaultExpandAll: true,
        treeCheckable: true,
        treeNodeFilterProp: "title",
        placeholder: '请选择运维站点！',
        allowClear:true,
        style: {
          width: '100%',
        },
      };

    return <div>
        <Modal
          title={"应用到企业排扣"}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={applyLoading}
          onCancel={this.handleCancel}
        >
    <Form {...layout} ref={this.formRef}  initialValues={{remember: true, }}  >
     <Form.Item label="质控方案名称" name="username"  rules={[{ required: true, message: '请输入方案名称!',  },]}>
        <Input />
      </Form.Item>
      <Form.Item label="质控方案描述" name="username33"  rules={[{ required: true, message: '请输入方案描述!',  },]}>
       <TextArea rows={4} />
      </Form.Item>  
      <Form.Item label="选择应用排扣" name="username3">
        <TreeSelect {...tProps} />
      </Form.Item>   
    </Form>
        </Modal>
     </div>;
  }
}

export default EditorAddMode;