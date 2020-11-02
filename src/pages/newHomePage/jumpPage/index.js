/**
 * 功  能：运转率 故障率 超标率
 * 创建人：贾安波
 * 创建时间：2020.11
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RegionData from './faultOverWorkRate/components/Region'
import { connect } from 'dva';
import  moment from 'moment';
import styles from './style.less'
const pageUrl = {
  updateState: 'home/updateState',
};
@connect(({ home }) => ({

  isWorkRate:home.isWorkRate,
  queryPar:home.queryPar
}))
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regionVisible:false
    };
    
  }

  componentDidMount() {

  
   }
   updateQueryState = payload => {
    const { queryPar, dispatch } = this.props;

    dispatch({
      type: pageUrl.updateState,
      payload: { queryPar: { ...queryPar, ...payload } },
    });
  };
   workNextPage=(type)=>{ //运转率
    const { dispatch,location } = this.props;

    this.updateQueryState({
      BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD HH:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [],
      ModelType: "All"
    });
    dispatch({
      type: pageUrl.updateState,
      payload: { isWorkRate: true,Atmosphere:type=='air'?true:false,ModelType:'All'},
    });
    setTimeout(()=>{
      this.setState({regionVisible:true})
      
    })
   }

   faultNextPage=(type)=>{ //故障率
    const { dispatch } = this.props;
    this.updateQueryState({
      BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD HH:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [],
      ModelType: "All"
    });
    dispatch({
      type: pageUrl.updateState,
      payload: { isFaultRate: true,Atmosphere:type=='air'?true:false,ModelType:'All'},
    });
    setTimeout(()=>{
      this.setState({regionVisible:true})
      
    })
   }
   overNextPage=(type)=>{ //超标率
    const { dispatch } = this.props;
    this.updateQueryState({
      BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
      EndTime: moment().format('YYYY-MM-DD HH:59:59'),
      EntCode: "",
      RegionCode: "",
      PollutantTypeCode: [],
      ModelType: "All"
    });
    dispatch({
      type: pageUrl.updateState,
      payload: { isOverRate: true,Atmosphere:type=='air'?true:false,ModelType:'All'},
    });
    setTimeout(()=>{
      this.setState({regionVisible:true})
      
    })
   }

   regionCancel=()=>{ //行政区页面
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { isWorkRate: false,isFaultRate:false,isOverRate:false},
    });
     this.setState({regionVisible:false})
   }
           /* <BreadcrumbWrapper title="首页">
          <a href='#' onClick={this.workNextPage} style={{paddingLeft:10}}>运转率</a>
          <a href='#' onClick={()=>{this.workNextPage("air")}} style={{paddingLeft:10}}>运转率空气站</a>
          <a href='#' onClick={this.faultNextPage} style={{paddingLeft:10}}>故障率</a>
          <a href='#' onClick={()=>{this.faultNextPage("air")}} style={{paddingLeft:10}}>故障率空气站</a>
          <a href='#' onClick={this.overNextPage} style={{paddingLeft:10}}>超标率</a>
          <a href='#' onClick={()=>{this.overNextPage('air')}} style={{paddingLeft:10}}>超标率空气站</a>
          {regionVisible?  <RegionData regionVisible={regionVisible} regionCancel={this.regionCancel}/> : null}

            <div className={styles.homeContent}>
           </div>
        </BreadcrumbWrapper> */
  render() {
    const { regionVisible } = this.state;
    return (
      <div className={styles.pageContainer}>
         <div style={{height:'1900px',background:'red'}}>
           1111
          </div>
       </div> 
    );
  }
}
