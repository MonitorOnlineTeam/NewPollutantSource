import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '../index.less';
import Marquee from '@/components/Marquee';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Statistic, Row, Col, Divider,Radio  } from 'antd';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable';
@connect(({ loading, home }) => ({
  entDetailData: home.entDetailData,
  loading: loading.effects["home/getEntDetails"],
  }))
class EntAttributes extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         };
    }

    componentDidMount()  {
         
         const { entCode } = this.props;
         
         this.getData(entCode);
    }
    componentWillReceiveProps(nextProps)
      {
      if (this.props.entCode !== nextProps.entCode) {
         this.getData(nextProps.entCode);
        }
    }
    getData=(entCode)=>{

     const{dispatch}=this.props;
    // 获取单个企业详情
    if (entCode) {
      dispatch({
        type: "home/getEntDetails",
        payload: { entCode  }
      })
    }
       
    }



    render() {
        const { entDetailData,loading}=this.props;

        return <>
          <div className={styles.title}>
            <p>企业属性</p>
          </div>

          {loading?
          <PageLoading/>:
          <div className={styles.content} style={{padding:'30px 0'}}>

          <Row style={{paddingTop:6}}>
           <Col span={24}>
              <span>公司名称：</span> <span title={entDetailData.EntName} className='textOverflow'  style={{width:301,verticalAlign:'top'}} >{entDetailData.EntName}</span>
              </Col>
        </Row> 
        <Row style={{paddingTop:22}}>
           <Col span={24}>
              <span>公司地址：</span> <span title={entDetailData.EntAddress} className='textOverflow' style={{width:301,verticalAlign:'top'}}>{entDetailData.EntAddress}</span>
           </Col>
        </Row> 
        <Row style={{paddingTop:22}}>
           <Col span={24}>
              <span>企业简称：</span> <span title={entDetailData.Abbreviation} className='textOverflow' style={{width:301,verticalAlign:'top'}}>{entDetailData.Abbreviation}</span>
           </Col>
        </Row> 

        <Row style={{paddingTop:22}}>
           <Col span={24}>
              <span>所属行业：</span> <span title={entDetailData.IndustryTypeName} className='textOverflow' style={{width:301,verticalAlign:'top'}}>{entDetailData.IndustryTypeName}</span>
           </Col>
        </Row> 
        <Row style={{paddingTop:22}}>
           <Col span={12}> <span>法人姓名：</span> <span>{entDetailData.CorporationName}</span></Col>
           <Col span={12}><span>法人编号：</span> <span>{entDetailData.CorporationCode}</span></Col>
        </Row> 
        <Row style={{paddingTop:22}}>
           <Col span={12}><span>企业类型：</span> <span>{entDetailData.EntType_Name}</span></Col>
           <Col span={12}><span>移动电话：</span> <span>{entDetailData.MobilePhone}</span></Col>
        </Row> 
        <Row style={{paddingTop:22}}>
           <Col span={12}> <span>关注程度：</span> <span>{entDetailData.AttentionName}</span></Col>
           <Col span={12}><span>办公电话：</span> <span>{entDetailData.OfficePhone}</span></Col>
        </Row> 
        <Row style={{paddingTop:22}}>
           <Col span={12}> <span>经度度数：</span> <span>{entDetailData.Latitude}</span></Col>
           <Col span={12}><span>纬度度数：</span> <span>{entDetailData.Longitude}</span></Col>
        </Row> 
        <Row style={{paddingTop:22}}>
           <Col span={12}><span>单位类型：</span> <span>{entDetailData.UnitTypeName}</span></Col>
           <Col span={12}><span>隶属关系：</span> <span>{entDetailData.SubjectionRelationName}</span></Col>
        </Row> 

        <Row style={{paddingTop:22}}>
         <Col span={12}> <span>环保负责：</span> <span>{entDetailData.EnvironmentPrincipal}</span></Col>
         <Col span={12}> <span>属行政区：</span> <span>{entDetailData.RegionName}</span></Col>
        </Row> 
          </div>
        }
          </>;
    }
}

export default EntAttributes;