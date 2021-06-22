/**
 * 功  能：首页 
 * 创建人：贾安波
 * 创建时间：2020.11
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RegionData from './components/jumpPage/faultOverWorkRate/Region'
import { connect } from 'dva';
import  moment from 'moment';
import styles from './style.less'
import RealTimeAlarm from './components/RealTimeAlarm'
import BrokenLine from './components/BrokenLine'
import WasteWaterPoint from './components/WasteWaterPoint'
import WasteGas from './components/WasteGas'
import AirStatistics from './components/AirStatistics'
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
  //  workNextPage=(type)=>{ //运转率
  //   const { dispatch } = this.props;

  //   this.updateQueryState({
  //     BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
  //     EndTime: moment().format('YYYY-MM-DD HH:59:59'),
  //     EntCode: "",
  //     RegionCode: "",
  //     PollutantTypeCode: [],
  //     ModelType: "All"
  //   });
  //   dispatch({
  //     type: pageUrl.updateState,
  //     payload: { isWorkRate: true,Atmosphere:type=='air'?true:false,ModelType:'All'},
  //   });
  //   setTimeout(()=>{
  //     this.setState({regionVisible:true})
      
  //   })
  //  }

  //  faultNextPage=(type)=>{ //故障率
  //   const { dispatch } = this.props;
  //   this.updateQueryState({
  //     BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
  //     EndTime: moment().format('YYYY-MM-DD HH:59:59'),
  //     EntCode: "",
  //     RegionCode: "",
  //     PollutantTypeCode: [],
  //     ModelType: "All"
  //   });
  //   dispatch({
  //     type: pageUrl.updateState,
  //     payload: { isFaultRate: true,Atmosphere:type=='air'?true:false,ModelType:'All'},
  //   });
  //   setTimeout(()=>{
  //     this.setState({regionVisible:true})
      
  //   })
  //  }
  //  overNextPage=(type)=>{ //超标率
  //   const { dispatch } = this.props;
  //   this.updateQueryState({
  //     BeginTime: moment().subtract(1, 'month') .format('YYYY-MM-DD 00:00:00'),
  //     EndTime: moment().format('YYYY-MM-DD HH:59:59'),
  //     EntCode: "",
  //     RegionCode: "",
  //     PollutantTypeCode: [],
  //     ModelType: "All"
  //   });
  //   dispatch({
  //     type: pageUrl.updateState,
  //     payload: { isOverRate: true,Atmosphere:type=='air'?true:false,ModelType:'All'},
  //   });
  //   setTimeout(()=>{
  //     this.setState({regionVisible:true})
      
  //   })
  //  }

   regionCancel=()=>{ //行政区页面
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { isWorkRate: false,isFaultRate:false,isOverRate:false},
    });
     this.setState({regionVisible:false})
   }

  render() {
    const { regionVisible } = this.state;
    return (
      <div  id='newHomePage' className={styles.pageContainer}>
         <div>
         {/* <RealTimeAlarm /> */}
         </div>
         <div style={{marginTop:10}}>
         <BrokenLine />
          </div>
          <div style={{marginTop:10}}>
            <WasteWaterPoint />
          </div>
          <div style={{marginTop:10}}>
            <WasteGas />
          </div>
          <div style={{marginTop:10}}>
         <AirStatistics />
          </div>
       </div> 
    );
  }
}
