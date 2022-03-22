import React, { PureComponent } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntStaticstics from '../components/EntStaticstics'
class index extends PureComponent {
  render() {
    const {location} = this.props;
    return (
      <BreadcrumbWrapper>
          <EntStaticstics location = {location}></EntStaticstics>
      </BreadcrumbWrapper>
    );
  }
}

export default index;