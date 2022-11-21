/*
 * @Author: JiaQi 
 * @Date: 2022-11-17 15:56:55 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2022-11-17 15:56:55 
 * @Description: 环保车清单台账页面
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import { Card } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';

const CONFIGID = 'UnEcoCar';

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
        ></SearchWrapper>
        <AutoFormTable
          getPageConfig
          noload
          handleMode="modal"
          style={{ marginTop: 10 }}
          configId={CONFIGID}
        />
      </Card>
    </BreadcrumbWrapper >
  }
}

export default index;