import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntWorkOrderStatistics from './components/EntWorkOrderStatistics';
import CityLevel from './components/CityLevel';

class index extends PureComponent {



  render() {
    let level = this.props.location.pathname==='/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics'? '' : '2';

    return (
      <BreadcrumbWrapper>
        {!level?   <EntWorkOrderStatistics /> : <CityLevel location={this.props.location} />}
      </BreadcrumbWrapper>
    );
  }
}

export default index;
