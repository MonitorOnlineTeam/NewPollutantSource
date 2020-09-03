


import React from 'react';

import {Form,Row,Col,Button,Input,Modal,Spin} from 'antd';

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
    getDetailsList:qualityProData.getDetailsList,
    seeEchoData:qualityProData.seeEchoData,
    getDetailsLoading:qualityProData.getDetailsLoading
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
        this.columns = [
          {
            title: '监测项目',
            dataIndex: 'PollutantName',
            key: 'PollutantName',
            align: 'center'
          },
          {
            title: '质控周期',
            dataIndex: 'Value',
            key: 'Value',
            align: 'center',
          },
          {
            title: '质控时间',
            dataIndex: 'Unit',
            key: 'Unit',
            align: 'center'
          },
          {
            title: '创建时间',
            dataIndex: 'CertificateNo',
            key: 'CertificateNo',
            align: 'center',
            // render: text =>  moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
          },
        ]
    }

    componentDidMount(){
        const { onRef } = this.props;
        onRef && onRef(this);
        const blindItem=[{title: '标气浓度', dataIndex: 'Unit',  key: 'Unit',align: 'center'  }]
        this.blindCol=[...this.columns,...blindItem]
    }


    qualityProg=()=>{
      return <span>质控方案</span>
    }
    

    getDetailClick=()=>{
      let {dispatch,seeEchoData} = this.props;
      dispatch({
         type: 'qualityProData/getDetailsFile',
         payload: { ID: seeEchoData.ID },
         callback:(res)=>{
            
         }
     });
    }
    qualityDetail=()=>{ 
      const {getDetailsLoading,getDetailsList} = this.props;

      console.log(getDetailsList)
      const title = {
        0: "零点核查",
        1: "量程核查",
        2:"线性核查",
        3:"响应时间核查",
        4:"盲样核查"
      }
      return getDetailsLoading? <Spin size="small" />  :
        <Row gutter={[16, 16]}>
         
           
          {getDetailsList.map(item,index=>{
            return   <Col span={12} > 
             <h1>{title[index]}</h1>
             <SdlTable
            rowKey={(record, index) => `complete${index}`}
            dataSource={tableDatas}
            columns={index==4? this.columns : this.blindItem}
            resizable
            pagination={ false }
           />
            </Col>
          }) }
        
          </Row>
     
    }


     seeVisibleShow=()=>{
       this.setState({visible:true},()=>{
        setTimeout(() => {
          this.getDetailClick()
          });
         })
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
          footer={null}
          onCancel={this.handleCancel}
        >
        <CemsTabs type='line' panes={this.state.panes} tabChange={this.tabChange}/>
        </Modal>
     </div>;
  }
}

export default EditorAddMode;