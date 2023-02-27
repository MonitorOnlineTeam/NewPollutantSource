import React, { useState, useEffect } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import RangeCheckPage from './RangeCheckPage'
import PageLoading from '@/components/PageLoading'

const RangeCheck = (props) => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  const { location, showMode } = props;

  useEffect(() => {
    if (location.query && location.query.type === 'alarm') {
      setPointName(location.query.title)
    }
  }, []);

  return (
    <>
      {location.query && location.query.type !== 'alarm' ?
        <NavigationTree getContainer={showMode === 'modal' ? false : 'body'} domId="#rangeCheck" onItemClick={item => {
          if (!item[0].IsEnt) {
            setDGIMN(item[0].key)
            setPointType(item[0].Type)
            setPointName(`${item[0].entName} - ${item[0].pointName}`)
          }
        }} />
        : null
      }
      <div id="rangeCheck">
        {
          showMode === 'modal' ?
            location.query && location.query.type === 'alarm' ? <RangeCheckPage DGIMN={location.query.dgimn} initLoadData location={location} /> : DGIMN ? <RangeCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
            :
            <BreadcrumbWrapper>
              {
                location.query && location.query.type === 'alarm' ? <RangeCheckPage DGIMN={location.query.dgimn} initLoadData location={location} /> : DGIMN ? <RangeCheckPage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
              }
            </BreadcrumbWrapper>
        }
      </div>
    </>
  );
}
export default RangeCheck;
