/**
 * 功  能：空气质量状况统计
 * 创建人：贾安波
 * 创建时间：2020.12.28
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
        <BreadcrumbWrapper >
          <ContentData />
        </BreadcrumbWrapper>
    );
  }
}
