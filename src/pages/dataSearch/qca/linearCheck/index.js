import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import LinearCheckPage from './LinearCheckPage'
import PageLoading from '@/components/PageLoading'


class index extends PureComponent {
  state = {
    pointName: "",
  }

  componentDidMount() {
    const { location } = this.props;
    if(location.query&&location.query.type==='alarm' ){
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
    {location.query&&location.query.type!=='alarm'?
        <NavigationTree domId="zeroCheck" onTreeSelect={(value, item) => {
          this.setState({
            pointName: `${item.EntName} - ${item.title}`,
            DGIMN: value,
            pointType: item.PointType
          })
        }} />
        :null
      }
        <BreadcrumbWrapper id="zeroCheck" extraName={pointName}>
          {
           location.query&&location.query.type==='alarm'? <LinearCheckPage DGIMN={location.query.dgimn} initLoadData location={location}/> :   DGIMN ? <LinearCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
          }
        </BreadcrumbWrapper>
      </>
    );
  }
}
export default index;
