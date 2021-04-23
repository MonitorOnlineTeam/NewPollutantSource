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
      <BreadcrumbWrapper title="超标报警核实率">
        <OverVerifyLst level={level}  query={query}/>
      </BreadcrumbWrapper>
    );
  }
}
