/**
 * 功  能：首页
 * 创建人：贾安波
 * 创建时间：2020.10
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RegionData from './faultOverWorkRate/components/Region'
import { connect } from 'dva';


const pageUrl = {
  updateState: 'home/updateState',
};
@connect(({ home }) => ({

  isWorkRate:home.isWorkRate,
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
   workNextPage=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: pageUrl.updateState,
      payload: { isWorkRate: true},
    });
    setTimeout(()=>{
      this.setState({regionVisible:true})
      
    })
   }
   regionCancel=()=>{
     this.setState({regionVisible:false})
   }
  render() {
    const { regionVisible } = this.state;
    return (
        <BreadcrumbWrapper title="首页">
          <a href='javascript:;' onClick={this.workNextPage}>运转率</a>
          <a href='javascript:;' onClick={this.faultNextPage}>故障率</a>
          <a href='javascript:;' onClick={this.workNextPage}>率</a>
          {regionVisible?  <RegionData regionVisible={regionVisible} regionCancel={this.regionCancel}/> : null}
        </BreadcrumbWrapper>
    );
  }
}
