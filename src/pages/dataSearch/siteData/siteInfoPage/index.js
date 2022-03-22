import React, { useState } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import SiteInfo from '../component/SiteInfo'

const SiteInfoPage = () => {
  const [DGIMN, setDGIMN] = useState()

  return (
    <>
      <NavigationTree domId="#SiteInfoPage" onItemClick={item => {
        setDGIMN(item[0].key)
      }} />
      <div id="SiteInfoPage">
        <BreadcrumbWrapper>
          {DGIMN && <SiteInfo DGIMN={DGIMN} />}
        </BreadcrumbWrapper>
      </div>
    </>
  );
}
export default SiteInfoPage;
