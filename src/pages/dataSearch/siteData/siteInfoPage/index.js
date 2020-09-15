import React, { useState } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import PageLoading from '@/components/PageLoading'
import SiteInfo from '@/components/SiteInfo'

const SiteInfoPage = () => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  return (
    <>
      <NavigationTree domId="SiteInfoPage" onTreeSelect={(value, item) => {
        setPointName(item.title)
        setDGIMN(value)
        setPointType(item.PointType)
      }} />
      <BreadcrumbWrapper id="SiteInfoPage" extraName={pointName}>
        {DGIMN && <SiteInfo DGIMN={DGIMN} />}
      </BreadcrumbWrapper>
    </>
  );
}
export default SiteInfoPage;
