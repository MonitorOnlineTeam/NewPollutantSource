import React, { useState } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import BlindCheckPage from './BlindCheckPage'
import PageLoading from '@/components/PageLoading'

const BlindCheck = () => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  return (
    <>
      <NavigationTree domId="blindCheck" onTreeSelect={(value, item) => {
        setPointName(item.title)
        setDGIMN(value)
        setPointType(item.PointType)
      }} />
      <BreadcrumbWrapper id="blindCheck" extraName={pointName}>
        {
          DGIMN ? <BlindCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
        }
      </BreadcrumbWrapper>
    </>
  );
}
export default BlindCheck;