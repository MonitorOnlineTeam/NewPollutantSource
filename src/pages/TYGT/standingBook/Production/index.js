/*
 * @Author: JiaQi 
 * @Date: 2022-11-17 15:17:42 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-01-06 10:12:59
 * @Description: 生产清单台账页面
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import { Card, Tooltip, Divider } from 'antd';
import { LineChartOutlined } from '@ant-design/icons'
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
          appendHandleRows={row => {
            return (
              <>
                <Divider type="vertical" />
                <Tooltip title="查看数据">
                  <a onClick={() => {

                  }}>
                    <LineChartOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
              </>
            );
          }}
        />
      </Card>
    </BreadcrumbWrapper >
  }
}

export default index;