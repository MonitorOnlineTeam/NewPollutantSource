/**
 * 功  能：远程督查 详情
 * 创建人：贾安波
 * 创建时间：2022.3.16
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Checkbox, Upload, Button, Select, Tabs, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';


import { RollbackOutlined } from '@ant-design/icons';

import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from "../style.less"
import SdlTable from '@/components/SdlTable'
import moment from 'moment'
import AttachmentView from '../components/AttachmentView'

const { Option } = Select;
const { TabPane } = Tabs;

const namespace = 'remoteSupervision'




const dvaPropsData =  ({ loading,remoteSupervision,global }) => ({
  tableLoading: loading.effects[`${namespace}/getConsistencyCheckInfo`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getConsistencyCheckInfo:(payload,callback)=>{ 
      dispatch({
        type: `${namespace}/getConsistencyCheckInfo`,
        payload:payload,
        callback:callback,
      })
    },
  }
}
const Index = (props) => {
    const {match:{params:{id}},tableLoading,type }= props;
   
    const [rangeUpload,setRangeUpload] = useState()
    const [couUpload,setCouUpload] = useState()
    const [consistencyCheckDetail,setConsistencyCheckDetail] = useState({})
    const [tableData1,setTableData1] = useState([])  
    const [tableData2,setTableData2] = useState([])  
   
    const [dasRangStatus,setDasRangStatus] = useState(false)
    const [dataRangStatus,setDataRangStatus] = useState(false)
  useEffect(() => {
    props.getConsistencyCheckInfo({ID:id},(data)=>{ //DAS量程
      setRangeUpload(data.rangeUploadFormat)
      setCouUpload(data.couUploadFormat)
      setConsistencyCheckDetail(data)
      
      if(data.consistencyCheckList&&data.consistencyCheckList[0]){//获取das量程和数采仪量程是否被选中
        setDasRangStatus(data.consistencyCheckList[0].DataList.DASStatus==1? true :  false)
        setDataRangStatus(data.consistencyCheckList[0].DataList.DataStatus==1? true :  false)
      }


     // 量程一致性核查表 数据
     let data1 = data.consistencyCheckList&&data.consistencyCheckList.filter(item=> !item.DataList.CouType)
      for(let i=0;i<data1.length;i++){
         if(data1[i].PollutantName === '颗粒物'){
            data1.splice(i+1,0,{PollutantName:'颗粒物',DataList:{ flag:data1[i].DataList.Special==1? 1 :2  }})
           break;
         }
      }
      for(let j=0;j<data1.length;j++){
        if(data1[j].PollutantName === '流速'){  
          data1.splice(j+1,0,{PollutantName:'流速',DataList:{ flag:data1[j].DataList.Special==1? 1 :2}})
         break;
       }
     }
      setTableData1(data1)

     // 实时护具一致性核查表 数据
     let data2 = data.consistencyCheckList&&data.consistencyCheckList.filter(item=> !(item.DataList.Special&&item.PollutantName==='颗粒物'))
      setTableData2(data2)


    })
  
  },[]);
  
  const getAttachmentDataSource = (value)=> {
    const fileInfo = value ? value.split(',') : [];
    let fileList =  fileInfo.map(item => {
      return {
        name: item,
        attach: item
      }
    })
   return fileList;
  }


  const columns1= [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
       
        if (text == '颗粒物' && record.DataList.Special || text == '流速' && record.DataList.Special) {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && !record.DataList.Special || text == '流速' && !record.DataList.Special) {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '量程一致性核查表',
      children: [
        {
          title: '有无显示屏',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            if(text=='颗粒物'){
              if(record.DataList.Special&&record.DataList.Special==1 ){
                return   <Checkbox checked={true} >有显示屏</Checkbox> 
            }else if(record.DataList.Special&&record.DataList.Special==2){
              return <Checkbox checked={true} >无显示屏</Checkbox>
             }else if(record.DataList.flag==2){
              return  <Checkbox checked={false} >有显示屏</Checkbox>
             }else{
              return  <Checkbox checked={false} >无显示屏</Checkbox>
             }
          
          }else if(text=='流速'){
              if(record.DataList.Special&&record.DataList.Special==1 ){
                return   <div  style={{marginLeft:-12}}><Checkbox checked={true} >差压法</Checkbox></div>
            }else if(record.DataList.Special&&record.DataList.Special==2){
              return <Checkbox style={{marginLeft:15}} checked={true} >只测流速法</Checkbox>
             }else if(record.DataList.flag==2){
              return   <div  style={{marginLeft:-12}}><Checkbox checked={false} >差压法</Checkbox></div>
             }else{
              return  <Checkbox  style={{marginLeft:15}} checked={false} >只测流速法</Checkbox>
             }
            
          }else {
              return '—'
            }

          }
        },
        {
          title: '分析仪量程',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            } else {
              return record.DataList.AnalyzerMin? `${record.DataList.AnalyzerMin}-${record.DataList.AnalyzerMin}` : null;
            }
          }
        },
        {
          title: <Row align='middle' justify='center'> <Checkbox checked={dasRangStatus}></Checkbox><span style={{paddingLeft:5}}>DAS量程</span></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            } else {
               return record.DataList.DASMin? `${record.DataList.DASMin}-${record.DataList.DASMax}` : null;
            }
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={dataRangStatus}  ></Checkbox><span style={{paddingLeft:5}}>数采仪量程</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            } else {
              return record.DataList.DataMin? `${record.DataList.DataMin}-${record.DataList.DataMax}` : null;

            }
          }
        },
        {
          title: '量程一致性(自动判断)',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            }else{
              return record.DataList.RangeAutoStatus==1? '是' : record.DataList.RangeAutoStatus==2 ? '否' : null
            }
          }
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record, index) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            }else{  
              let  rangeStatus = record.DataList.RangeStatus;
              return rangeStatus==1? '是' : rangeStatus ==2 ? '否' : rangeStatus ==3 ?  '不适用': null
            }
          }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 100,
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            }else{
              return record.RangeRemark
            }
          }
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 150,
          render: (text, record, index) => {
            const attachmentDataSource = getAttachmentDataSource(rangeUpload);
            const obj = {
              children: <div>
                <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} /> 
              </div>,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = tableData1.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;

          }
        },
      ]
    },
  ]
  const columns2 = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '监测参数',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text == '颗粒物' && record.DataList.CouType == '1') {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && record.DataList.CouType == '2') {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
    },
    {
      title: '实时数据一致性核查表',
      children: [
        {
          title: '浓度类型',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          width: 130,
          render: (text, record) => {
            return record.DataList.CouType == 1 ? '原始浓度' :  record.DataList.CouType == 2 ? '标杆浓度'  : '—'

          }
        },
        {
          title: '分析仪示值',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量' || record.Name === '流速' || record.Name === '颗粒物' && record.concentrationType === '标杆浓度') {
              return '—'
            }
            return record.DataList.AnalyzerCou
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={false} ></Checkbox> <span style={{paddingLeft:5}}>DAS示值</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            return record.DataList.DASCou
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={false} ></Checkbox><span style={{paddingLeft:5}}>数采仪实时数据</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            if (record.Name === 'NO' || record.Name === 'NO2') {
              return '—'
            }else{
              return record.DataList.DataCou
            }
          }
        },
        {
          title: '数据一致性(自动判断)',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
              return record.DataList.CouAutoStatus==1? '是' : record.DataList.CouAutoStatus==2 ? '否' : null
          }

        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            let  couStatus = record.DataList.CouStatus;
            return couStatus==1? '是' : couStatus ==2 ? '否' : couStatus ==3 ?  '不适用': null
        }

        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'CouRemrak',
          key: 'CouRemrak',
        },
        {
          title: '附件',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          width: 150,
          render: (text, record, index) => {
            const attachmentDataSource = getAttachmentDataSource(couUpload);
            const obj = {
              children: <div>
                    <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} /> 
              </div>,
              props: {},
            };
            if (index === 0) {
              obj.props.rowSpan = tableData2.length;
            } else {
              obj.props.rowSpan = 0;
            }

            return obj;

          }
        },
      ]
    },
  ]
  const columns3 = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: '检查项目',
      dataIndex: 'ItemName',
      key: 'ItemName',
      align: 'center',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    },
    {
      title: '是否启用',
      align: 'center',
      dataIndex: 'Status',
      key: 'Status',
      render: (text, record) => {
        return   <Checkbox checked={text==1?true:false} ></Checkbox>

      }
    },
    {
      title: '设定值',
      align: 'center',
      dataIndex: 'SetValue',
      key: 'SetValue',
    },
    {
      title: '溯源值',
      align: 'center',
      dataIndex: 'TraceabilityValue',
      key: 'TraceabilityValue',
    },
    {
      title: '一致性(自动判断)',
      align: 'center',
      dataIndex: 'AutoUniformity',
      key: 'AutoUniformity',
      render: (text, record) => {
        return text==1? '是' : text==2 ? '否' : null
    }
    },
    {
      title: '手工修正结果',
      align: 'center',
      dataIndex: 'Uniformity',
      key: 'Uniformity', 
      render: (text, record) => {
         return text==1? '是' : text ==2 ? '否' : text ==3 ?  '不适用': null
      }
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'Remark',
      key: 'Remark',
      width: 150,
    },
    {
      title: '附件',
      align: 'center',
      dataIndex: 'UploadFormat',
      key: 'UploadFormat',
      width: 150,

      render: (text, record, index) => {
        const attachmentDataSource = getAttachmentDataSource(text);

        return <div>
         <AttachmentView style={{ marginTop: 10 }} dataSource={attachmentDataSource} /> 
        </div>;

      }
    },
    {
      title: '判断依据',
      align: 'center',
      dataIndex: 'file',
      key: 'file',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    }
  ]






  return (
    <div className={styles.remoteSupervisionDetailSty}>
    <BreadcrumbWrapper hideBreadcrumb={props.hideBreadcrumb}>
    <Card title={ type!='mobile'&&<Row justify='space-between'>
        <span>详情</span>
        <Button onClick={() => {props.history.go(-1);   }} ><RollbackOutlined />返回</Button>
     </Row>
    }>
    <Form
      name="detail"
    >
      <Row>
      <Col span={6}>
        <Form.Item label="企业名称">
        {consistencyCheckDetail.entName }
      </Form.Item>
      </Col>
        <Col span={6}>
        <Form.Item label="监测点名称" >
        {consistencyCheckDetail.pointName }
      </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="核查月份" >
        {moment(consistencyCheckDetail.dateTime).format("YYYY-MM")}
      </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item label="核查结果" >
        {consistencyCheckDetail.resultCheck}
      </Form.Item>
      </Col>
      </Row>

      <Row>
        <Col span={6}>
        <Form.Item label="核查人">
        {consistencyCheckDetail.userName }
      </Form.Item>
      </Col>
      <Col span={6}>
      <Form.Item label="核查时间"  >
        {consistencyCheckDetail.createTime  }
      </Form.Item>
      </Col>
      </Row>
    </Form>
    <Tabs>
    <TabPane tab="数据一致性核查表" key="1">
              <SdlTable
                loading={tableLoading}
                columns={columns1}
                dataSource={tableData1}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
               <SdlTable
                loading={tableLoading}
                columns={columns2}
                dataSource={tableData2}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
            </TabPane>
            <TabPane tab="参数一致性核查表" key="2">
              <SdlTable
                loading={tableLoading}
                columns={columns3}
                dataSource={consistencyCheckDetail.consistentParametersCheckList}
                pagination={false}
                scroll={{ y: '100vh' }}
              />
            </TabPane>
          </Tabs>
   </Card>
   </BreadcrumbWrapper>
        </div>

  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);