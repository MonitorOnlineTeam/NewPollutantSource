import React, { useState } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import OffStreamPage from './OffStreamPage'
import PageLoading from '@/components/PageLoading'

const ZeroCheck = () => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  return (
    <>
      <NavigationTree domId="offStream" onTreeSelect={(value, item) => {
        setPointName(item.title)
        setDGIMN(value)
        setPointType(item.PointType)
      }} />
      <BreadcrumbWrapper id="offStream" extraName={pointName}>
        {
          DGIMN ? <OffStreamPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
        }
      </BreadcrumbWrapper>
    </>
  );
}
export default ZeroCheck;
