/**
 * 功  能：排放量变化趋势
 * 创建人：贾安波
 * 创建时间：2020.10.19
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import ContentData from './components/ContentData'




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
        <BreadcrumbWrapper title="排放量变化趋势">
           <ContentData />
        </BreadcrumbWrapper>
    );
  }
}
