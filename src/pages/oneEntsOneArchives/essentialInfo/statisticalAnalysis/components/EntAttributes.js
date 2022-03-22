import React, { Component } from 'react';
import { connect } from 'dva';
import styles  from '../index.less';
import Marquee from '@/components/Marquee';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Statistic, Row, Col, Divider,Radio  } from 'antd';
import moment from 'moment';
import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable';
@connect(({ loading,autoForm }) => ({
  loading: loading.effects["autoForm/getFormData"],
  entDetailData: autoForm.editFormData&&autoForm.editFormData.AEnterpriseTest,
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
      // dispatch({
      //   type: "home/getAllEntAndPoint",
      //   payload: { entCode  }
      // })
      dispatch({
         type: 'autoForm/getFormData',
         payload: {
             configId:'AEnterpriseTest',
             "dbo.T_Bas_Enterprise.EntCode": entCode
         },
       })
    }
       
    }



    render() {
        const { entDetailData,loading}=this.props;
        
        return <>
          <div className={styles.title}>
            <p>企业属性</p>
          </div>

          {/* {loading?
          <PageLoading/>: */}
          <div className={styles.content} style={{padding:'17px 10px 10px 10px'}}>
          {entDetailData&&<>
             <Row className={styles.entRowTop}>
              <Col span={12}   className={styles.entCol}>   
              <Row align='middle' className={styles.entRow}>
               <img src='/ent1.png' className={styles.entImg}/>
              <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>公司名称</div> 
              <div title={entDetailData.EntName} className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData.EntName}</div>
               </div>
              </Row>
              </Col>
              
              <Col span={12}   className={styles.entCol}>   

              <Row align='middle' className={styles.entRow}>
               <img src='/ent2.png' className={styles.entImg}/>
              <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>关注程度</div> 
              <div title={entDetailData['dbo.T_Cod_AttentionDegree.AttentionName'] } className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData['dbo.T_Cod_AttentionDegree.AttentionName']}</div>
               </div>
              </Row>
              </Col>
        </Row> 

        <Row className={styles.entRowTop}>

              
              <Col span={12}   className={styles.entCol}>   

              <Row align='middle' className={styles.entRow}>
               <img src='/ent3.png' className={styles.entImg}/>
              <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>污染源规模</div> 
              <div title={entDetailData["dbo.T_Cod_PSScale.PSScaleName"]} className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData["dbo.T_Cod_PSScale.PSScaleName"]}</div>
               </div>
              </Row>
              </Col>

              <Col span={12}   className={styles.entCol}>   


                <Row align='middle' className={styles.entRow}>
               <img src='/ent4.png' className={styles.entImg}/>
               <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>注册类型</div> 
              <div title={entDetailData["dbo.T_Cod_RegistType.RegistTypeName"]} className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData["dbo.T_Cod_RegistType.RegistTypeName"]}</div>
              </div>
             </Row>
             </Col>
        </Row> 
        
        <Row className={styles.entRowTop}>
        <Col span={12}   className={styles.entCol}>   
          <Row align='middle' className={styles.entRow}>
               <img src='/ent5.png' className={styles.entImg}/>
              <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>隶属关系</div> 
              <div title={entDetailData['dbo.T_Cod_SubjectionRelation.SubjectionRelationName']} className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData['dbo.T_Cod_SubjectionRelation.SubjectionRelationName']}</div>
               </div>
              </Row>
              </Col>
              
              <Col span={12}   className={styles.entCol}>   
              <Row align='middle' className={styles.entRow}>
               <img src='/ent6.png' className={styles.entImg}/>
              <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>所属行业</div> 
              <div title={entDetailData["dbo.T_Cod_IndustryType.IndustryTypeName"]} className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData["dbo.T_Cod_IndustryType.IndustryTypeName"]}</div>
               </div>
              </Row>
              </Col>
        </Row> 

        <Row className={styles.entRowTop}>
        <Col span={12}   className={styles.entCol}>   
              <Row align='middle' className={styles.entRow}>
               <img src='/ent7.png' className={styles.entImg}/>
              <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>办公电话</div> 
              <div title={entDetailData["dbo.T_Bas_Enterprise.OfficePhone"]} className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData["dbo.T_Bas_Enterprise.OfficePhone"]}</div>
               </div>
              </Row>
              </Col>
              
              <Col span={12}   className={styles.entCol}>   
              <Row align='middle' className={styles.entRow}>
               <img src='/ent8.png' className={styles.entImg}/>
              <div  className={styles.entDivSty}>
              <div className={styles.entNameSty}>移动电话</div> 
              <div title={entDetailData["dbo.T_Bas_Enterprise.MobilePhone"]} className={`textOverflow ${styles.entDetailDataSty}`}  >{entDetailData["dbo.T_Bas_Enterprise.MobilePhone"]}</div>
               </div>
              </Row>
              </Col>
        </Row>     

        </>}
          </div>
        {/* } */}
          </>;
    }
}

export default EntAttributes;