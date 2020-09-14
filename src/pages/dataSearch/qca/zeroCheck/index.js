import React, { useState,useEffect } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import ZeroCheckPage from './ZeroCheckPage'
import PageLoading from '@/components/PageLoading'

const ZeroCheck = (props) => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()
  
  const {location} = props;


  useEffect(() => {
    if(location.query&&location.query.type==='alarm' ){
      setPointName(location.query.title)  
    }
  },[]);


  return (
    <>
      {location.query&&location.query.type!=='alarm'?
      <NavigationTree domId="zeroCheck" onTreeSelect={(value, item) => {
        setPointName(item.title)
        setDGIMN(value)
        setPointType(item.PointType)
      }} />
      :null
     }
      <BreadcrumbWrapper id="zeroCheck" extraName={pointName}>
        {
         
          location.query&&location.query.type==='alarm'? <ZeroCheckPage DGIMN={location.query.dgimn} initLoadData location={location}/> :  DGIMN ? <ZeroCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
        }
      </BreadcrumbWrapper>
    </>
  );
}
export default ZeroCheck;
