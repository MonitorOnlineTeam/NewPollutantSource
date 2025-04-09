/*
 * @Author: outman0611
 * @Date: 2024-06-14 09:42:04
 * @LastEditors: outman0611
 * @LastEditTime: 2025-04-08 13:35:19
 * @Description: 
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import OverVerifyLst from './components/OverVerifyLst';

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}
  render() {
    const { location:{pathname,query}} = this.props;
    let level = pathname==='/Intelligentanalysis/dataAlarm/overVerifyRate/cityLevel'? '2' : ''
    return (
      <BreadcrumbWrapper>
        <OverVerifyLst level={level}  query={query} {...this.props}/>
      </BreadcrumbWrapper>
    );
  }
}
