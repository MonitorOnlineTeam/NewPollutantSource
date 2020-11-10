import React, { PureComponent } from 'react';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTreeNew'
import { Card } from 'antd';

const CONFIG_ID = "QCARecordManager";
class index extends PureComponent {
  state = {}

  changeDgimn = (value, selectItem) => {
    this.setState({
      DGIMN: value,
      searchParams: [{
        // Key: "dbo__T_Bas_QCARecord_DGIMN",
        Key: "[dbo]__[T_Bas_QCARecord]__DGIMN",
        Value: value,
        Where: '$=',
      }]
    })
  }

  render() {
    const { searchParams, DGIMN } = this.state;
    return (
      <>
        <NavigationTree domId="outageLog" onTreeSelect={(value, selectItem) => { this.changeDgimn(value, selectItem) }} />
        <BreadcrumbWrapper id="outageLog">
          <Card>
            {
              DGIMN && <>
                <SearchWrapper configId={CONFIG_ID} searchParams={searchParams} />
                <AutoFormTable getPageConfig configId={CONFIG_ID} searchParams={searchParams} />
              </>
            }
          </Card>
        </BreadcrumbWrapper>
      </>
    );
  }
}

export default index;