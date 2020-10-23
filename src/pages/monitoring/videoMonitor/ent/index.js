/**
 * 功  能：视频监控 企业
 * 创建人：贾安波
 * 创建时间：2020.10.20
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ContentData from '../components/ContentData'




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
        <BreadcrumbWrapper title="视频监控(企业)">
           <ContentData/>
        </BreadcrumbWrapper>
    );
  }
}
