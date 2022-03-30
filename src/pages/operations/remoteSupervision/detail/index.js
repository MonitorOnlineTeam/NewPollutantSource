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
    const {location:{query:{ id}},tableLoading }= props;
  

    const [rangeUpload,setRangeUpload] = useState()
    const [couUpload,setCouUpload] = useState()
    const [consistencyCheckDetail,setConsistencyCheckDetail] = useState({})
    const [tableData1,setTableData1] = useState([])  

  useEffect(() => {
    props.getConsistencyCheckInfo({ID:id},(data)=>{
      setRangeUpload(data.rangeUploadFormat)
      setCouUpload(data.couUploadFormat)

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
                return   <Checkbox checked={true} disabled>有显示屏</Checkbox> 
            }else if(record.DataList.Special&&record.DataList.Special==2){
              return <Checkbox checked={true} disabled>无显示屏</Checkbox>
             }else if(record.DataList.flag==2){
              return  <Checkbox checked={false} disabled>有显示屏</Checkbox>
             }else{
              return  <Checkbox checked={false} disabled>无显示屏</Checkbox>
             }
          
          }else if(text=='流速'){
              if(record.DataList.Special&&record.DataList.Special==1 ){
                return   <div  style={{marginLeft:-12}}><Checkbox checked={true} disabled>差压法</Checkbox></div>
            }else if(record.DataList.Special&&record.DataList.Special==2){
              return <Checkbox style={{marginLeft:15}} checked={true} disabled>只测流速法</Checkbox>
             }else if(record.DataList.flag==2){
              return   <div  style={{marginLeft:-12}}><Checkbox checked={false} disabled>差压法</Checkbox></div>
             }else{
              return  <Checkbox  style={{marginLeft:15}} checked={false} disabled>只测流速法</Checkbox>
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
              return '1111'
            }
          }
        },
        {
          title: <Row align='middle' justify='center'> <Checkbox checked={true} disabled></Checkbox><span style={{paddingLeft:5}}>DAS量程</span></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            } else {
              return text
            }
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={false}  disabled></Checkbox><span style={{paddingLeft:5}}>数采仪量程</span></Row>,
          align: 'center',
          dataIndex: 'PollutantName',
          key: 'PollutantName',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量') {
              return '—'
            } else {
              return '222'
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
              return '333'
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
              return '444'
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
              return '555'
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
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (text == '颗粒物' && record.concentrationType == '原始浓度') {
          obj.props.rowSpan = 2;
        }
        if (text == '颗粒物' && record.concentrationType == '标杆浓度') {
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
          dataIndex: 'concentrationType',
          key: 'concentrationType',
          width: 130,
          render: (text, record) => {
            return text ? text : '—'

          }
        },
        {
          title: '分析仪示值',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          render: (text, record) => {
            if (record.Name === 'NOx' || record.Name === '标杆流量' || record.Name === '流速' || record.Name === '颗粒物' && record.concentrationType === '标杆浓度') {
              return '—'
            }
            return text
          }
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={false} disabled></Checkbox> <span style={{paddingLeft:5}}>DAS示值</span></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
        },
        {
          title: <Row align='middle' justify='center'><Checkbox checked={false} disabled></Checkbox><span style={{paddingLeft:5}}>数采仪实时数据</span></Row>,
          align: 'center',
          dataIndex: 'par',
          key: 'par',
          render: (text, record) => {
            if (record.Name === 'NO' || record.Name === 'NO2') {
              return '—'
            }else{
              return text
            }
          }
        },
        {
          title: '数据一致性(自动判断)',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
        },
        {
          title: '手工修正结果',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'par',
          key: 'par',
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
              obj.props.rowSpan = consistencyCheckDetail.consistencyCheckList.length;
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
      dataIndex: 'Name',
      key: 'Name',
      align: 'center',
      render: (text, record, index) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>
      }
    },
    {
      title: '是否启用',
      align: 'center',
      dataIndex: 'isDisplay',
      key: 'isDisplay',
      render: (text, record) => {
        return   <Checkbox.Group disabled> <Checkbox  value={1} ></Checkbox></Checkbox.Group>

      }
    },
    {
      title: '设定值',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
    },
    {
      title: '溯源值',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
    },
    {
      title: '一致性(自动判断)',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
    },
    {
      title: '手工修正结果',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
      width: 150,
      render: (text, record) => {
        return <Form.Item  name={`${record.par}Remark3`} rules={[{ required: remark3[`${record.par}Remark3Flag`], message: '请输入' }]}>
          <Input placeholder='请输入' style={{ width: '100%' }} />
        </Form.Item>
      }
    },
    {
      title: '附件',
      align: 'center',
      dataIndex: 'par',
      key: 'par',
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






   console.log(tableData1)
  return (
    <div className={styles.remoteSupervisionDetailSty}>
    <BreadcrumbWrapper>
    <Card title={
     <Row justify='space-between'>
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
                dataSource={consistencyCheckDetail.consistencyCheckList}
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