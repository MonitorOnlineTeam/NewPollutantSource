/*
 * @Author: JiaQi
 * @Date: 2022-11-17 15:17:42
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-01-17 14:23:41
 * @Description: 生产清单台账页面
 */

import React, { PureComponent } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import { Card, Tooltip, Divider } from 'antd';
import { LineChartOutlined } from '@ant-design/icons'
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import ViewDataModal from '../components/ViewDataModal';
import { formatParamsList } from '../../utils'

const CONFIGID = 'UnProduction';

@connect(({ loading, standingBook, }) => ({
  viewDataVisible: standingBook.viewDataVisible,
}))
class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paramsList: []
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

  // 查看数据
  viewData = () => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        viewDataVisible: true
      }
    })
  }

  render() {
    const { viewDataVisible } = this.props;
    const { facilityCode, paramsList } = this.state;
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
            return false;
            return (
              <>
                <Divider type="vertical" />
                <Tooltip title="查看数据">
                  <a onClick={() => {
                    let PollutantCodes = row['dbo.T_Cods_UnProduction.Pollutant'];
                    let PollutantNames = row['dbo.T_Cod_Pollutant.PollutantName'];
                    let paramsList = formatParamsList(PollutantNames, PollutantCodes)
                    this.setState({
                      facilityCode: row['dbo.T_Cod_UnProduction.DGIMN'],
                      paramsList: paramsList
                    })
                    this.viewData();
                  }}>
                    <LineChartOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
              </>
            );
          }}
        />
      </Card>
      {(viewDataVisible && facilityCode) && <ViewDataModal type={'pro'} facilityCode={facilityCode} paramsList={paramsList} />}
    </BreadcrumbWrapper >
  }
}

export default index;
