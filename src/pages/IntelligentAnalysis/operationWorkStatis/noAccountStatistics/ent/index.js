/**
 * 功  能：无账台工单记录
 * 创建人：贾安波
 * 创建时间：2020.10.26
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
    
    let level = this.props.location.pathname==='/Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent'? '' : '2';
    return (
        <BreadcrumbWrapper >
           <ContentData level={level}/>
        </BreadcrumbWrapper>
    );
  }
}
