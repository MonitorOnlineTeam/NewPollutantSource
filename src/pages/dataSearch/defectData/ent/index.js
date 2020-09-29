/**
 * 功  能：缺失数据 企业
 * 创建人：贾安波
 * 创建时间：2020.09.28
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import DefectData from '../commpnents/DefectData'

export default class Ent extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {

  }
  
  render() {
  

    return (
      <BreadcrumbWrapper title="有效传输率">
        <DefectData />
      </BreadcrumbWrapper>
    );
  }
}
