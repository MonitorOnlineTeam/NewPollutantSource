


import React from 'react';

import { Card,Table,Empty,Form,Row,Col,Button,Input,Popconfirm,Modal,Tooltip} from 'antd';

import { connect } from 'dva';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'
import { green } from '@ant-design/colors';

import EditorAddMode from "../components/EditorAddMode"
import ApplyModel from "../components/ApplyModel"
import SeeModel from "../components/SeeModel"
import point from '@/models/point';
/**
 * 质控方案管理
 * jab 2020.9.2
 */

@connect(({ qualityProData }) => ({
    tableDatas:qualityProData.tableDatas,
    total: qualityProData.total,
    tablewidth: qualityProData.tablewidth,
    tableLoading:qualityProData.tableLoading,
    queryParams:qualityProData.queryParams,
    editEchoData:qualityProData.editEchoData,
    applyEchoData:qualityProData.applyEchoData,
    seeEchoData:qualityProData.seeEchoData,
    echoType:qualityProData.echoType
}))

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        tableDatas:[],
        columns:[],
        dateValue: [ moment(new Date()).add(-1, 'month'), moment(new Date())],
        visible:false,
        };
        this.columns = [
          {
            title: '质控方案名称',
            dataIndex: 'QCAProgrammeName',
            key: 'QCAProgrammeName',
            align: 'center'
          },
          {
            title: '说明',
            dataIndex: 'Describe',
            key: 'Describe',
            align: 'center',
             render: text => {
               return  <Tooltip title={this.tooltipText.bind(this,text)} color={"#fff"} overlayStyle={{maxWidth:300}}>
                      <span>{text}</span>
                     </Tooltip>
             },
             ellipsis: true,
            //  width:150
          },
          {
            title: '创建人',
            dataIndex: 'DesignatedPerson',
            key: 'DesignatedPerson',
            align: 'center'
          },
          {
            title: '创建时间',
            dataIndex: 'CreateTime',
            key: 'CreateTime',
            align: 'center',
            // render: text =>  moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
          },
          {
            title: '操作',
            dataIndex: 'Unit',
            key: 'Unit',
            align: 'center',
            render: (text,row)=>{
              return <> 
                      <a href="#"style={{cursor:"pointer"}} onClick={this.applyClick.bind(this,row)}>应用</a>
                      <a href="#"  style={{paddingLeft:5,cursor:"pointer"}}  onClick={this.seeClick.bind(this,row)}>查看</a>
                      <a href="#" style={{paddingLeft:5,cursor:"pointer"}} onClick={this.editAddClick.bind(this,row,"编辑")}>编辑</a>
                      <Popconfirm  title="即将删除一条方案数据?" onConfirm={this.confirmDelete.bind(this,row)}>
                      <a href="#"  style={{paddingLeft:5,cursor:"pointer"}} >删除</a>
                      </Popconfirm>
                     </>
            }
          },
        ];
    }

    componentDidMount(){
       
      this.props.initLoadData && this.changeDgimn(this.props.dgimn)
     
    }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {
   if(prevProps.dgimn !==  this.props.dgimn) {
        this.changeDgimn(this.props.dgimn);
    }
}
tooltipText=(value)=>{ 
  return <div style={{color:'rgba(0, 0, 0, 0.65)',wordWrap:'break-word'}}>{value}</div>
}
 /** 切换排口 */
      changeDgimn = (dgimn) => {
        this.getTableData(dgimn);
  
    }

  /** 根据排口dgimn获取它下面的数据 */
  getTableData = dgimn => {
          let {dispatch,queryParams} = this.props;
          queryParams = {
            ...queryParams,
            DGIMN:dgimn,
            QCAProgrammeName:""
          }
           dispatch({
              type: 'qualityProData/updateState',
              payload: { queryParams  },
          });
         setTimeout(()=>{this.onFinish()})
         
          
      }

  onFinish = ()=>{
    let {dispatch,queryParams,dgimn} = this.props;
    queryParams = {
      ...queryParams,
      DGIMN:dgimn
    }
     dispatch({
        type: 'qualityProData/getQCAProgrammeList',
        payload: { ...queryParams  },
    });
  }

  reloadList=()=>{
    let {dispatch,queryParams} = this.props;
     dispatch({
        type: 'qualityProData/getQCAProgrammeList',
        payload: { ...queryParams  },
    });
  }

  programmeChange=(e)=>{
    let {dispatch,queryParams} = this.props;
    queryParams = {
      ...queryParams,
      QCAProgrammeName:e.target.value
    }
     dispatch({
        type: 'qualityProData/updateState',
        payload: { queryParams },
    });
  }

   //删除
  confirmDelete=(row)=>{
    let {dispatch} = this.props;
   const delParams = {
      ID:row.ID
    }
     dispatch({
        type: 'qualityProData/delQCAProgramme',
        payload: { ...delParams },
        callback:()=>{
          this.reloadList();
        }
    });
  }

  //添加 修改
  editAddClick = (row,type) => { 
    let {dispatch,echoType,editEchoData} = this.props;
       echoType = type;
        dispatch({
        type: 'qualityProData/updateState',
        payload: { echoType  },
      });

       if(type == "编辑"){
        editEchoData = row;
         dispatch({
            type: 'qualityProData/updateState',
            payload: { editEchoData  },
        });
        this.child.editVisibleShow();
       }
    
       if(type == "添加"){
        this.child.editVisibleShow();
       }
      }
   //应用
      applyClick=(row)=>{
        let {dispatch,applyEchoData} = this.props;
        applyEchoData = row;
         dispatch({
            type: 'qualityProData/updateState',
            payload: { applyEchoData  },
        });
        this.applyChild.applyVisibleShow();
      }
   //查看
      seeClick=(row)=>{
        let {dispatch,seeEchoData} = this.props;
        seeEchoData = row;
         dispatch({
            type: 'qualityProData/updateState',
            payload: { seeEchoData  },
        });
        this.seeChild.seeVisibleShow();
      }
      
  onRef = (ref) => {
    this.child = ref
  }
  onApplyRef=ref=>{
    this.applyChild = ref
  }
  onSeeyRef=ref=>{
    this.seeChild = ref
  }
      //查询条件
  queryCriteria = () => {
    return <div>
      <div style={{ marginTop: 10 }}>
        <Form className="search-form-container" layout="inline"  onFinish={this.onFinish}>
          <Row gutter={[8,8]} style={{flex:1}} > 
            <Col xxl={7} xl={10}   lg={14} md={16} sm={24} xs={24}>
              <Form.Item label="方案名称" className='queryConditionForm'>
              <Input placeholder="请输入方案名称" onChange={this.programmeChange}/>
              </Form.Item>
            </Col>
            <Col xxl={4} xl={4} lg={4}  md={3} sm={24} xs={24}>
              <Form.Item  className='queryConditionForm'> 
                <Button type="primary" loading={false} htmlType="submit" style={{ marginRight: 5 }}>查询</Button>
                <Button type="primary" loading={false} onClick={this.editAddClick.bind(this,"","添加")} style={{ marginRight: 5 }}>添加</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  }
  render() {

    const {tableLoading,tableDatas,total} = this.props;
    const  QueryCriteria = this.queryCriteria;
    return <div id="qualityProData">
        <Card title={<QueryCriteria />} >
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={tableDatas}
              columns={this.columns}
              resizable
              defaultWidth={80}
              scroll={{ y: this.props.tableHeight || undefined}}
              loading={tableLoading}
              pagination={{total:total, showSizeChanger:true , showQuickJumper:true,defalutPageSize: 20}}
          /> 
        </Card>

        <EditorAddMode  onRef={this.onRef}  reloadList={this.reloadList}/>

        <ApplyModel onRef={this.onApplyRef}  reloadList={this.reloadList}/>

        <SeeModel onRef={this.onSeeyRef}  reloadList={this.reloadList}/>
     </div>;
  }
}

export default TableData;