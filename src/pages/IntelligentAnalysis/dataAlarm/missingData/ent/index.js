
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import MissingData from '../components/MissingData'




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
        <BreadcrumbWrapper title="企业">
           <MissingData />
        </BreadcrumbWrapper>
    );
  }
}
                                                                                             