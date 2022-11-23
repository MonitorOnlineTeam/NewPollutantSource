/*
 * @Author: JiaQi 
 * @Date: 2022-11-17 15:17:42 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-22 10:27:00
 * @Description: 生产清单台账页面
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import { Card } from 'antd';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';

const CONFIGID = 'UnProduction';

@connect()
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.match.params.entCode
    };
  }

  // 删除
  onDelete = (id) => {
    this.props.dispatch({
      type: 'standingBook/DeleteInstallation',
      payload: {
        "id": id,
        "installationType": 4
      }
    }).then(() => {
      this.loadDataSource();
    })
  }

  // 加载表格数据
  loadDataSource() {
    this.props.dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: CONFIGID,
      },
    });
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
          onDelete={(row, key) => {
            this.onDelete(key);
          }}
        />
      </Card>
    </BreadcrumbWrapper >
  }
}

export default index;