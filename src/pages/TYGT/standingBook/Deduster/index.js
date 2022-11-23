/*
 * @Author: JiaQi 
 * @Date: 2022-11-16 16:05:32 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-22 10:23:49
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

  // 删除
  onDelete = (id) => {
    this.props.dispatch({
      type: 'standingBook/DeleteInstallation',
      payload: {
        "id": id,
        "installationType": 1
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
          style={{ marginTop: 10 }}
          handleMode="modal"
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