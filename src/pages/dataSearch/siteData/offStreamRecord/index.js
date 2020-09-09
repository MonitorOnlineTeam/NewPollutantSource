import React, { useState } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import OffStreamRecordPage from './OffStreamRecordPage'
import PageLoading from '@/components/PageLoading'

const OffStreamRecord = () => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  return (
    <>
      <NavigationTree domId="OffStreamRecord" onTreeSelect={(value, item) => {
        setPointName(item.title)
        setDGIMN(value)
        setPointType(item.PointType)
      }} />
      <BreadcrumbWrapper id="OffStreamRecord" extraName={pointName}>
        {
          DGIMN ? <OffStreamRecordPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
        }
      </BreadcrumbWrapper>
    </>
  );
}
export default OffStreamRecord;
