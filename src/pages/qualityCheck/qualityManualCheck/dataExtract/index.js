import React, { useState } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'
import DataExtractPage from './DataExtractPage'

const DataExtract = () => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()
  const [status, setStatus] = useState()

  return (
    <>
      <NavigationTree domId="#manualQuality" onItemClick={item => {
        console.log('item=', item)
        if (!item[0].IsEnt) {
          setDGIMN(item[0].key)
          setPointType(item[0].Type)
          setPointName(`${item[0].entName} - ${item[0].pointName}`)
        }
        // setPointName(`${item.EntName} - ${item.title}`)
        // setDGIMN(value)
        // setPointType(item.PointType)
        // setStatus(item.Status)
      }} />
      <div id="manualQuality">
        <BreadcrumbWrapper extraName={pointName}>
          {
            DGIMN ? <DataExtractPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} status={status} /> : <PageLoading />
          }
        </BreadcrumbWrapper>
      </div>
    </>
  );
}
export default DataExtract;
