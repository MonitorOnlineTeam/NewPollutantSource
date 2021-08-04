/**
 * 功  能：运维单位管理
 * 创建人：jab
 * 创建时间：2021.05.08
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import UnitData from '../commpnents/UnitData'

export default class OperationUnit extends Component {
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
        <UnitData {...this.props}/>
      </BreadcrumbWrapper>
    );
  }
}
