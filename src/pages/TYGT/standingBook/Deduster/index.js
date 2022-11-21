/*
 * @Author: JiaQi 
 * @Date: 2022-11-16 16:05:32 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-17 15:15:51
 * @Description: 除尘器清单台账页面
 */
import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import { Card } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';

const CONFIGID = 'UnDuster';

@connect()
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.match.params.entCode
    };
  }

  render() {
    return <BreadcrumbWrapper>
      <Card>
        <SearchWrapper
          configId={CONFIGID}
        // reloadFlag={DGIMN}
        // searchParams={[{
        //   Key: "dbo__T_Cod_UnEmissionAndEnt__EntCode",
        //   Value: entCode,
        //   Where: '$=',
        // }]}
        ></SearchWrapper>
        <AutoFormTable
          getPageConfig
          noload
          style={{ marginTop: 10 }}
          handleMode="modal"
          configId={CONFIGID}
        // searchParams={[{
        //   Key: "dbo__T_Cod_UnEmissionAndEnt__EntCode",
        //   Value: entCode,
        //   Where: '$=',
        // }]}
        />
      </Card>
    </BreadcrumbWrapper >
  }
}

export default index;