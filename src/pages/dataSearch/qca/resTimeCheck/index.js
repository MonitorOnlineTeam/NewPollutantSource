import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import ResTimeCheckPage from './ResTimeCheckPage'
import PageLoading from '@/components/PageLoading'


class index extends PureComponent {
  state = {
    pointName: "",
  }

  componentDidMount() {
  }

  render() {
    const { pointName, DGIMN, pointType } = this.state;
    // const { resTimeCheckTableData, pollutantList, tableLoading } = this.props;
    return (
      <>
        <NavigationTree domId="zeroCheck" onTreeSelect={(value, item) => {
          this.setState({
            pointName: item.title,
            DGIMN: value,
            pointType: item.PointType
          })
        }} />
        <BreadcrumbWrapper id="zeroCheck" extraName={pointName}>
          {
            DGIMN ? <ResTimeCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
          }
        </BreadcrumbWrapper>
      </>
    );
  }
}
export default index;
