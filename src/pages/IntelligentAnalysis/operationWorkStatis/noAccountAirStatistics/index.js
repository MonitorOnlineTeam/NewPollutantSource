
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import AirMissing from './components/airMissing';
import CityLevel from './components/CityLevel';


export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {

  }
  render() {
    const flag = this.props.location.pathname==='/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics'? true: false
    return (
      <BreadcrumbWrapper >
     {flag? <AirMissing /> : <CityLevel location={this.props.location}/> }
      </BreadcrumbWrapper>
    );
  }
}
