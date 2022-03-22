import React, { useState } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'
import ManualQualityPage from './ManualQualityPage'

const ZeroCheck = () => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  return (
    <>
      <NavigationTree domId="#manualQuality" onItemClick={item => {
        console.log('item=', item)
        if (!item[0].IsEnt) {
          setDGIMN(item[0].key)
          setPointType(item[0].Type)
          setPointName(`${item[0].entName} - ${item[0].pointName}`)
        }
      }} />
      <div id="manualQuality">
        <BreadcrumbWrapper extraName={pointName}>
          {
            DGIMN ? <ManualQualityPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
          }
        </BreadcrumbWrapper>
      </div>
    </>
  );
}
export default ZeroCheck;
