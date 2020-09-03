


import React from 'react';

import {Form,Row,Col,Button,Input,Modal} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import { green } from '@ant-design/colors';
import CemsTabs from '@/components/CemsTabs'
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
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            panes: [{
                key: 'zhikongfangan',
                title: '质控方案',
                name:  this.qualityProg
              }, {
                key: 'detail',
                title: '方案详情',
                name: this.qualityDetail
              }],
        };
    }

    componentDidMount(){
        const { onRef } = this.props;
        onRef && onRef(this);
    }


    qualityProg=()=>{
      return <span>质控方案</span>
    }
    
    qualityDetail=()=>{
        return <span>质控详情</span>
    }

  seeVisibleShow=()=>{
    this.setState({visible:true})

  }
 
  handleCancel=()=>{
    this.setState({visible:false})
  }
  tabChange=()=>{

  }
  render() {

    const { visible } = this.state;
    return <div>
        <Modal
          width	="90%"
          visible={visible}
          onOk={this.submitClick}
          onCancel={this.handleCancel}
        >
        <CemsTabs type='line' panes={this.state.panes} tabChange={this.tabChange}/>
        </Modal>
     </div>;
  }
}

export default EditorAddMode;