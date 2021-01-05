


import React from 'react';

import {Form,Row,Col,Button,Input,Modal,Spin,Empty,message} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import { green } from '@ant-design/colors';
import CemsTabs from '@/components/CemsTabs'
import FileViewer from 'react-file-viewer';
// import { CustomErrorComponent } from 'custom-error';
import config from '@/config'


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
            dataIndex: 'monitorItem',
            key: 'monitorItem',
            align: 'center'
          },
          {
            title: '质控周期',
            dataIndex: 'space',
            key: 'space',
            align: 'center',
          },
          {
            title: '质控时间',
            dataIndex: 'time',
            key: 'time',
            align: 'center'
          },
          {
            title: '首次执行时间',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            // render: text =>  moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
          },
        ]
    }

    componentDidMount(){
        const { onRef } = this.props;
        onRef && onRef(this);
        // const blindItem=[{title: '标气浓度', dataIndex: 'value',  key: 'value',align: 'center'  }]
        // this.blindCol=[...this.columns,...blindItem]
    }


    qualityProg=()=>{
      const type = 'docx'
      let {seeEchoData} = this.props;
      let { visible } = this.state;
      return  <FileViewer
      style={{width:"100%"}}
      fileType={type}
      filePath={`/upload/${seeEchoData.ProgrammeFileName}`}
      onError={this.onError}/>
    }
    onError=()=>{
      message.error("打开文件失败")
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

      // console.log(getDetailsList)   
      // const title = {
      //   0: "零点核查",
      //   1: "量程核查",
      //   2:"线性核查",
      //   3:"响应时间核查",
      //   4:"盲样核查"
      // }
      console.log()
      return getDetailsLoading? <Spin size="small" />  :
       <>
       { 
         getDetailsList.length>0 ?
        <Row gutter={[16, 16]}> 
          {getDetailsList.map((item,index)=>{
            return   <Col span={ getDetailsList.length>1  ? 12 :24} > 
             <h2>{item.qcaTypeName}</h2>
             <SdlTable
            rowKey={(record, index) => `complete${index}`}
            dataSource={item.qcaList}
            // columns={item.qcaTypeName== "盲样核查"? this.blindCol : this.columns }
            columns={this.columns }
            resizable
            pagination={ false }
           />
            </Col>
          }) }
        
          </Row>
          :
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          
       }
       </>
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
          className="qualitySee"
        >
       {visible? <CemsTabs type='line' panes={this.state.panes} tabChange={this.tabChange}/> :null}
        </Modal>
     </div>;
  }
}

export default EditorAddMode;