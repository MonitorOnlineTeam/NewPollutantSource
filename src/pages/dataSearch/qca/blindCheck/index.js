import React, { useState, useEffect } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import BlindCheckPage from './BlindCheckPage'
import PageLoading from '@/components/PageLoading'

const BlindCheck = (props) => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  const { location } = props;

  useEffect(() => {
    if (location.query && location.query.type === 'alarm') {
      setPointName(location.query.title)
    }
  }, []);
  return (
    <>
      {location.query && location.query.type !== 'alarm' ?
        <NavigationTree domId="blindCheck" onTreeSelect={(value, item) => {
          setPointName(`${item.EntName} - ${item.title}`)
          setDGIMN(value)
          setPointType(item.PointType)
        }} />
        : null
      }
      <BreadcrumbWrapper id="blindCheck" extraName={pointName}>
        {
          location.query && location.query.type === 'alarm' ?
            <BlindCheckPage DGIMN={location.query.dgimn} initLoadData location={location} /> :
            DGIMN ? <BlindCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
        }
      </BreadcrumbWrapper>
    </>
  );
}
export default BlindCheck;