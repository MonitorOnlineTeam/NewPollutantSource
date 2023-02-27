import React, { useState, useEffect } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import ErrorValuePage from './ErrorValuePage'
import PageLoading from '@/components/PageLoading'

const BlindCheck = (props) => {
  const [pointName, setPointName] = useState()
  const [DGIMN, setDGIMN] = useState()
  const [pointType, setPointType] = useState()

  const { location, showMode } = props;

  useEffect(() => {
    if (location.query && location.query.type === 'alarm') {
      setPointName(location.query.title)
    }
  }, []);


  const getPageContent = () => {
    return <>
      {
        location.query && location.query.type === 'alarm' ?
          <ErrorValuePage DGIMN={location.query.dgimn} initLoadData location={location} /> :
          DGIMN ? <ErrorValuePage DGIMN={DGIMN} pointType={pointType} pointName={pointName} /> : <PageLoading />
      }
    </>
  }

  return (
    <>
      {location.query && location.query.type !== 'alarm' ?
        <NavigationTree getContainer={showMode === 'modal' ? false : 'body'} domId="#blindCheck" onItemClick={item => {
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
        {
          showMode === 'modal' ?
            getPageContent() :
            <BreadcrumbWrapper>
              {getPageContent()}
            </BreadcrumbWrapper>
        }

      </div>
    </>
  );
}
export default BlindCheck;
