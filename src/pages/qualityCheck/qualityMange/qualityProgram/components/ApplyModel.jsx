


import React from 'react';

import {Form,Row,Col,Button,Input,Modal,DatePicker,TreeSelect} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import { green } from '@ant-design/colors';
import { UploadOutlined,DownloadOutlined,ExclamationCircleOutlined} from '@ant-design/icons';

const { confirm } = Modal;
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
    applyEchoData:qualityProData.applyEchoData,
    entAndPointList: common.entAndPointList,
    applyPar:qualityProData.applyPar
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

    //  console.log(this.props.editEchoData)
  }

  handleCancel=()=>{
    this.setState({visible:false})
  }

  handleOk = values => {
    let _this = this;
    confirm({
      title: '确认要应用到企业排口？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        _this.formRef.current.validateFields().then((values) => {
          let {dispatch,applyPar} = _this.props;
           dispatch({
              type: 'qualityProData/applicationProgramme',
              payload: { ...applyPar  },
              callback:()=>{
                _this.handleCancel()
              }
          });
        })
      },
    });

  };

  onReset = () => {
    this.formRef.current.resetFields();
  };


  applyVisibleShow=()=>{
    this.setState({visible:true},()=>{
        
      let { applyEchoData,applyPar,dispatch} = this.props;
        setTimeout(()=>{
          this.formRef.current.setFieldsValue({
            QCAProgrammeName: applyEchoData.QCAProgrammeName,
            Describe: applyEchoData.Describe
          });

          applyPar = {
            ...applyPar,
            ID:applyEchoData.ID
          }
           dispatch({
              type: 'qualityProData/updateState',
              payload: { applyPar },
          });
        })

    })
  }
  treeChange=(value)=>{

    let {dispatch,applyPar} = this.props;
    applyPar = {
      ...applyPar,
      MNList:value
    }
     dispatch({
        type: 'qualityProData/updateState',
        payload: { applyPar },
    });
    this.formRef.current.setFieldsValue({
      apply: value,
    });
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
        placeholder: '请选择应用排口',
        allowClear:true,
        style: {
          width: '100%',
        },
      };

    return <div>
        <Modal
          title={"应用到企业排口"}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={applyLoading}
          onCancel={this.handleCancel}
        >
    <Form {...layout} ref={this.formRef}  initialValues={{remember: true, }}  >
     <Form.Item label="质控方案名称" name="QCAProgrammeName"  rules={[{ required: true, message: '请输入方案名称!',  },]}>
        <Input placeholder='请输入质控方案名称' disabled />
      </Form.Item>
      <Form.Item label="质控方案描述" name="Describe"  rules={[{ required: true, message: '请输入方案描述!',  },]}>
       <TextArea placeholder='质控方案描述' rows={4} disabled />
      </Form.Item>  
      <Form.Item label="选择应用排口" name="apply" rules={[{ required: true, message: '请选择应用排口!',  },]}>
        <TreeSelect {...tProps} onChange={this.treeChange}/>
      </Form.Item>   
    </Form>
        </Modal>
     </div>;
  }
}

export default EditorAddMode;