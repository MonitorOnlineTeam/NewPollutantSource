/*
 * @Author: Jiaqi 
 * @Date: 2022-10-27 15:26:47 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2022-10-27 15:27:17
 * @Description: 质控日志查询
 */
import React, { PureComponent } from 'react'
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import { Card } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import NavigationTree from '@/components/NavigationTree'

const CONFIGID = 'QCARecordManager';

@connect(({ loading, autoForm }) => ({
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      DGIMN: '',
    };
  }

  changeDgimn = (item) => {
    if (!item[0].IsEnt) {
      this.setState({
        DGIMN: item[0].key,
      })
    }
  }

  render() {
    const { DGIMN } = this.state;
    console.log("DGIMN=", DGIMN)
    return (
      <>
        <NavigationTree domId="#QCARecordManager" onItemClick={(value) => { this.changeDgimn(value) }} />
        <div id="QCARecordManager">
          <BreadcrumbWrapper>
            <Card>
              {
                DGIMN && <>
                  <SearchWrapper
                    configId={CONFIGID}
                    reloadFlag={DGIMN}
                    searchParams={[{
                      Key: "dbo__T_Bas_QCARecord__DGIMN",
                      Value: DGIMN,
                      Where: '$=',
                    }]}
                  ></SearchWrapper>
                  <AutoFormTable
                    getPageConfig
                    noload
                    style={{ marginTop: 10 }}
                    configId={CONFIGID}
                  />
                </>
              }
            </Card>
          </BreadcrumbWrapper>
        </div>
      </>
    );
  }
}

export default index;