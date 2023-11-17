/**
 * 功  能：去除率
 * 创建人：jab
 * 创建时间：2020.10.10
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import AnalysisData from '../components/AnalysisData'




export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }

  componentDidMount() {

  
   }
  render() {
    return (
        <BreadcrumbWrapper title="去除率分析">
           <AnalysisData />
        </BreadcrumbWrapper>
    );
  }
}
