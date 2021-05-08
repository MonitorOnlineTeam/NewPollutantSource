/**
 * 功  能：运维人员管理
 * 创建人：jab
 * 创建时间：2021.05.08
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import PersonData from '../commpnents/PersonData'

export default class OperationPerson extends Component {
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
        <PersonData />
      </BreadcrumbWrapper>
    );
  }
}
