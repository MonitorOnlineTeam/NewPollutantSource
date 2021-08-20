import React, { useState, useEffect } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
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
        <NavigationTree domId="#blindCheck" onItemClick={item => {
          if (!item[0].IsEnt) {
            setDGIMN(item[0].key)
            setPointType(item[0].Type)
            // setPointName(item[0].pointName)
            setPointName(`${item[0].entName} - ${item[0].pointName}`)

          }
        }} />
        : null
      }
      <div id="blindCheck">
        <BreadcrumbWrapper>
          {
            location.query && location.query.type === 'alarm' ?
              <BlindCheckPage DGIMN={location.query.dgimn} initLoadData location={location} /> :
              DGIMN ? <BlindCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
          }
        </BreadcrumbWrapper>
      </div>
    </>
  );
}
export default BlindCheck;