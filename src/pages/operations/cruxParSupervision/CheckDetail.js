/**
 * 功  能：督查管理
 * 创建人：jab
 * 创建时间：2022.04.25
 */
import React, { useState,useEffect,useRef,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tabs, Typography,Card,Button,Select,Progress, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio,Spin   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined,QuestionCircleOutlined,ProfileOutlined,EditOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { getAttachmentArrDataSource  } from '@/utils/utils';
import styles from "./style.less"
import Cookie from 'js-cookie';
// import AttachmentView from './components/AttachmentView'

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;


const namespace = 'cruxParSupervision'




const dvaPropsData =  ({ loading,supervisionManager,global,common }) => ({
    detailLoading: loading.effects[`${namespace}/getInspectorOperationView`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getInspectorOperationView: (payload,callback) => {//获取单个督查表实体
        dispatch({
          type: `${namespace}/getInspectorOperationView`,
          payload: payload,
          callback:callback,
        })
  
      },
    }
}




const Index = (props) => {
  
  
     const  {detailLoading,ID,pollutantType} = props;


  const [operationInfoList,setOperationInfoList] = useState([])
  const [infoList,seInfoList] = useState(null)

  useEffect(() => {
    props.getInspectorOperationView({ID:ID},(data)=>{
        setOperationInfoList(data)
        seInfoList(data.Info&&data.Info[0]?data.Info[0] : null )
    })
  }, []);

  const TitleComponents = (props) =>{
    return  <div style={{display:'inline-block', fontWeight:'bold',padding:'2px 4px',marginBottom:16,borderBottom:'1px solid rgba(0,0,0,.1)'}}>{props.text}</div>
            
    }
    const getAttachmentDataSource = (fileInfo)=> {
      const  fileList =[];
        if(fileInfo){
        fileInfo.split(',').map(item => {
          if(!item.IsDelete){
              fileList.push({ name: item,   attach: item })
         }
      })
    }
     return fileList;
    }
 const supervisionCol1 = [ {
    title: <span style={{fontWeight:'bold',fontSize:14}}>
      {operationInfoList.PrincipleProblemList&&operationInfoList.PrincipleProblemList[0]&&operationInfoList.PrincipleProblemList[0].Title}
    </span>,
    align: 'center',
    children:[
      {
        title: '序号',
        align: 'center',
        width:100,
        render:(text,record,index)=>{
         return index+1
        }
     },
    {
      title: '核查项',
      dataIndex: 'ContentItem',
      key: 'ContentItem',
      align: 'center',
      width:380,
    },
    {
      title: `备注`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width:200,
    },
    {
      title: '照片附件(运维人员提交)',
      dataIndex: 'Attachments',
      key: 'Attachments',
      align: 'center',
      width:120,
      render: (text, record) => {
        const attachmentDataSource = getAttachmentDataSource(text);
        return   <div>
           {text&&<AttachmentView  dataSource={attachmentDataSource} />}
      </div>
      },
    },
    {
      title: `核查状态`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width:200,
    },         
    {
      title: `核查问题描述`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width:200,
    },  
    {
      title: `核查问题照片附件`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width:200,
    },   
    {
      title: `核查问题照片附件`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width:200,
    },
    {
      title: '操作',
      align: 'center',
      fixed:'right',
      width:150,
      ellipsis:true,
      render: (text, record) => {
        return (
          <>
             <Divider type="vertical" />
                  <a> 核查  </a>
            <Divider type="vertical" />
              <Popconfirm  title="确定要清除此条核查记录？" placement="left" onConfirm={() => issues(record)} okText="是" cancelText="否">
                <a>
                 清除
                </a>
              </Popconfirm>
          </>
        )
      }

    }       
  ]
  }
  ]

  return (
    <div  className={'detail'} >
       <div style={{fontSize:16,padding:6,textAlign:'center',fontWeight:'bold'}}>运维督查表</div>

       <Spin spinning={detailLoading}>

        <Form
          name="basics"
        >
        
          <div className={'essentialInfoSty'}>
           <TitleComponents text='基本信息'/>
           <Row>
            <Col span={12}>
              <Form.Item label="企业名称" >
              {infoList&&infoList.EntName}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label='监测点名称' >
            {infoList&&infoList.PointName}
          </Form.Item>
            </Col>
            <Col span={12}>
             <Form.Item label="核查人员"   >
             {infoList&&infoList.InspectorName}
               </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="核查日期" >
             {infoList&&infoList.InspectorDate}
               
              </Form.Item>
              </Col >
            </Row>
          </div>
           </Form>

           <div className={'supervisionDetailSty'}>
           <TitleComponents text='督查内容'/>
            {!operationInfoList.PrincipleProblemList&&!operationInfoList.importanProblemList&&!operationInfoList.CommonlyProblemList?
            
              <Table 
              bordered
              dataSource={[]}
              columns={[]}
              pagination={false}
              locale={{ emptyText: '暂无模板数据' }}
              />
              :
              <>
             {operationInfoList.PrincipleProblemList&&operationInfoList.PrincipleProblemList[0]&&<Table 
              bordered
              dataSource={operationInfoList.PrincipleProblemList&&operationInfoList.PrincipleProblemList}
              columns={supervisionCol1} 
              rowClassName="editable-row"
              pagination={false}
             />}

           </>
           }
           
           
           </div>
           
           </Spin>

    </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);