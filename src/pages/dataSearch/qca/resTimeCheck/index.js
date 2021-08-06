import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import ResTimeCheckPage from './ResTimeCheckPage'
import PageLoading from '@/components/PageLoading'


class index extends PureComponent {
  state = {
    pointName: "",
  }

  componentDidMount() {
    const { location } = this.props;
    if (location.query && location.query.type === 'alarm') {
      this.setState({
        title: location.query.title,
      })
    }
  }

  render() {
    const { pointName, DGIMN, pointType } = this.state;
    // const { resTimeCheckTableData, pollutantList, tableLoading } = this.props;
    const { location } = this.props;

    return (
      <>
        {location.query && location.query.type !== 'alarm' ?
          <NavigationTree domId="#resTimeCheck" onItemClick={item => {
            if (!item[0].IsEnt) {
              this.setState({
                pointName: `${item[0].entName} - ${item[0].pointName}`,
                // pointName: `${item.EntName} - ${item.title}`,
                DGIMN: item[0].key,
                pointType: item[0].Type
              })
            }
          }} />
          : null
        }
        <div id="resTimeCheck">
          <BreadcrumbWrapper extraName={pointName}>
            {
              location.query && location.query.type === 'alarm' ? <ResTimeCheckPage DGIMN={location.query.dgimn} initLoadData location={location} /> : DGIMN ? <ResTimeCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
            }
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}
export default index;
