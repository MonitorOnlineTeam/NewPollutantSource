/**
 * 功  能：企业异常记录
 * 创建人：jab
 * 创建时间：2020.10.29
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
        <BreadcrumbWrapper title="企业异常记录">
          <ContentData />
        </BreadcrumbWrapper>
    );
  }
}
