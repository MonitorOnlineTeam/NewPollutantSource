
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import StandardData from './components/StandardData'




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
        <BreadcrumbWrapper title="异常标准查询">
           <StandardData />
        </BreadcrumbWrapper>
    );
  }
}
                                                                                             