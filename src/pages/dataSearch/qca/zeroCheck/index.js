import React, { useState, useEffect } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import ZeroCheckPage from './ZeroCheckPage'
import PageLoading from '@/components/PageLoading'

const ZeroCheck = (props) => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  const { location } = props;


  // EntCode: "837bd06b-1653-4da9-ac54-6124f4885cbf"
  // IsEnt: false
  // Type: "2"
  // VideoNo: null
  // entName: "阿克苏青松水泥"
  // key: "399435xb9lcv3m"
  // pointName: "1#窑尾（数采仪采购中）"
  return (
    <>
      <NavigationTree domId="#zeroCheck" onItemClick={item => {
        if (!item[0].IsEnt) {
          setDGIMN(item[0].key)
          setPointType(item[0].Type)
        }
        console.log('item=', item)
      }} />
      <div id="zeroCheck">
        <BreadcrumbWrapper>
          {
            DGIMN ? <ZeroCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
          }
        </BreadcrumbWrapper>
      </div>
    </>
  );
}
export default ZeroCheck;
