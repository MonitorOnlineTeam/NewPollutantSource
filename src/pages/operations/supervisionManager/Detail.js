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
import AttachmentView from './components/AttachmentView'

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;


const namespace = 'supervisionManager'




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
  
 const supervisionCol1 = [ {
    title: <span style={{fontWeight:'bold',fontSize:14}}>原则问题（否决项，出现1项此点位得0分）</span>,
    align: 'center',
    children:[
    {
      title: '序号',
      dataIndex: 'Sort',
      key: 'Sort',
      align: 'center',
      width:100,
    },
    {
      title: '督查内容',
      dataIndex: 'ContentItem',
      key: 'ContentItem',
      align: 'center',
      width:380,
      render: (text, record) => {
        return <div style={{textAlign:"left"}}>{text}</div>
      },
    },
    {
      title: `有无原则问题`,
      dataIndex: 'Inspector',
      key: 'Inspector',
      align: 'center',
      width:200,
      render: (text, record) => {
        return <div>{text ==0? '有' : '无'}</div>
      },
    },
    {
      title: '问题描述',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      render: (text, record) => {
        return <div style={{textAlign:"left"}}>{text}</div>
      },
    }]
  }
  ]

    const supervisionCol2 = [ {
      title: <span style={{fontWeight:'bold',fontSize:14}}>重点问题（每项5分，共60分）</span>,
      align: 'center',
      children:[
      {
        title: '序号',
        dataIndex: 'Sort',
        key: 'Sort',
        align: 'center',
        width:100,
      },
      {
        title: '督查内容',
        dataIndex: 'ContentItem',
        key: 'ContentItem',
        align: 'center',
        width:380,
        render: (text, record) => {
          return <div style={{textAlign:"left"}}>{text}</div>
        },
      },
      {
        title: `扣分`,
        dataIndex: 'Inspector',
        key: 'Inspector',
        align: 'center',
        width:200,
      },
      {
        title: '说明',
        dataIndex: 'Remark',
        key: 'Remark',
        align: 'center',
        render: (text, record) => {
          return <div style={{textAlign:"left"}}>{text}</div>
        },
       }]
      }]

      const supervisionCol3 = [{
        title: <span style={{fontWeight:'bold',fontSize:14}}>一般问题（每项2分，共40分）</span>,
        align: 'center',
        children:[ 
        {
          title: '序号',
          dataIndex: 'Sort',
          key: 'Sort',
          align: 'center',
          width:100,
        },
        {
          title: '督查内容',
          dataIndex: 'ContentItem',
          key: 'ContentItem',
          align: 'center',
          width:380,
          render: (text, record) => {
            return <div style={{textAlign:"left"}}>{text}</div>
          },
        },
        {
          title: `扣分`,
          dataIndex: 'Inspector',
          key: 'Inspector',
          align: 'center',
          width:200,
        },
        {
          title: '说明',
          dataIndex: 'Remark',
          key: 'Remark',
          align: 'center',
          render: (text, record) => {
            return <div style={{textAlign:"left"}}>{text}</div>
          },
        }]
        }]
        const supervisionCol4 = [
          {
            align:'center',
            render: (text, record,index) => {
             return  index == 0? '总分': '评价'
             },
            },
            {
              key: 'Sort',
              render: (text, record,index) => {
                if(index==0){
                  return   <div>{infoList&&infoList.TotalScore} </div>
                }else{    
                return {
                  children: <div>{infoList&&infoList.Evaluate} </div>,
                  props: {colSpan:3},
                };
                }

              }
            },
            {
              key: 'Sort',
              align:'center',
              render: (text, record,index) => {
                const obj = {
                  children: '附件',
                  props: {},
                };
                if (index === 1) {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              key: 'Sort',
              render: (text, record,index) => {
                const attachmentDataSource = getAttachmentArrDataSource(infoList&&infoList.FilesList);
                const obj = {
                  children:  <div>
                  <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} /> 
                </div>,
                  props: {},
                };
                if (index === 1) {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
      ]
  return (
    <div>
       <div style={{fontSize:16,padding:6,textAlign:'center',fontWeight:'bold'}}>运维督查表</div>

       <Spin spinning={detailLoading}>

        <Form
          name="basics"
        >
        
          <div className={'essentialInfoSty'}>
           <TitleComponents text='基本信息'/>
           <Row>
            <Col span={12}>
              <Form.Item label="行业" >
              {infoList&&infoList.PollutantTypeName}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='督查类别' >
              {infoList&&infoList.InspectorTypeName}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="企业名称" >
              {infoList&&infoList.EntName}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label='站点名称' >
            {infoList&&infoList.PointName}
          </Form.Item>
            </Col>

            {infoList&&infoList.PollutantTypeName=='废气'&& <Col span={12}>
              <Form.Item label="是否排口" >
                {infoList&&infoList.OutTypeName}
              </Form.Item>
            </Col>}
            <Col span={12}>
              <Form.Item label='行政区'>
               {infoList&&infoList.RegionName}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="监测因子" >
              {infoList&&infoList.PollutantName}
              </Form.Item>
            </Col>
            <Col span={12}>
             <Form.Item label="督查人员"   >
             {infoList&&infoList.InspectorName}
               </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="督查日期" >
             {infoList&&infoList.InspectorDate}
               
              </Form.Item>
              </Col >
            <Col span={12}>
               <Form.Item label="运维人员"  >
               {infoList&&infoList.OperationUserName}
              
               </Form.Item>
            </Col>
            </Row>
          </div>


          <div className={'deviceInfoSty'}>
           <TitleComponents text='设备信息'/>
            {infoList&&infoList.PollutantTypeName=='废水'?
            <>
               <Row className='waterDeviceInfo'>
            <Col span={12}>
            <Form.Item label='设备厂家'  >
            {infoList&&infoList.GasManufacturer}
      
          </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='设备类型'>
            {infoList&&infoList.GasEquipment}
          </Form.Item>
          </Col>
          
          <Col span={24}>
          <Form.Item label='备注' name='EquipmentRemark'>
          {infoList&&infoList.EquipmentRemark}
              </Form.Item>
            </Col>
          </Row>
            </>
            :
            <>
           <Row>
            <Col span={12}>
            <Form.Item label='气态CEMS设备生产商' >
            {infoList&&infoList.GasManufacturer}
          </Form.Item>
            </Col>
            <Col span={12}>
                 <Form.Item label='气态CEMS设备规格型号'>
                 {infoList&&infoList.GasEquipment}
              </Form.Item>
            </Col>
          </Row>

           <Row>
            <Col span={12}>
            <Form.Item label='颗粒物CEMS设备生产商' >
            {infoList&&infoList.PMManufacturer}
          </Form.Item>
            </Col>
            <Col span={12}>
                 <Form.Item label='颗粒物CEMS设备规格型号'>
                 {infoList&&infoList.PMEquipment}
              </Form.Item>
            </Col>
          </Row>
          <Row>
          <Col span={24}>
          <Form.Item label='备注' name='EquipmentRemark'>
          {infoList&&infoList.EquipmentRemark}
              </Form.Item>
            </Col>
          </Row>
          </>}
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
             <Table 
              bordered
              dataSource={operationInfoList.PrincipleProblemList&&operationInfoList.PrincipleProblemList}
              columns={supervisionCol1} 
              rowClassName="editable-row"
              pagination={false}
             />
             <Table 
              bordered
              dataSource={operationInfoList.importanProblemList&&operationInfoList.importanProblemList}
              columns={supervisionCol2}
              rowClassName="editable-row"
              className="impTableSty"
              pagination={false}
             />
            <Table 
              bordered
              dataSource={operationInfoList.CommonlyProblemList&&operationInfoList.CommonlyProblemList}
              columns={supervisionCol3}
              rowClassName="editable-row"
              pagination={false}
              className={'commonlyTableSty'}
             />
             <Table 
              bordered
              dataSource={[{Sort:1},{Sort:2}]}
              columns={supervisionCol4}
              className="summaryTableSty"
              pagination={false}
             />
           </>
           }
           
           
           </div>
           
           </Spin>

    </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);