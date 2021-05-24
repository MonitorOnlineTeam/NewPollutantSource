import React, { Component, Fragment } from 'react';
import {
  Card, Spin, Divider, Tooltip, Popconfirm,
} from 'antd';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import AutoFormTable from '../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../AutoFormManager/SearchWrapper';
import {
  DelIcon,
} from '@/utils/icon';

@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
}))

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { match } = this.props;
    this.reloadPage(match.params.configId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig) { this.reloadPage(nextProps.match.params.configId); }
    }
  }

  reloadPage = configId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'autoForm/updateState',
      payload: {
        routerConfig: configId,
      },
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId,
      },
    })
  }

  /** 逻辑删除 */
  delete = ID => {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'operationsysmanage/DeleteOperationSys',
      payload: {
        configId: match.params.configId,
        VehicleInfoID: ID,
      },
    });
  }

  render() {
    const { match: { params: { configId } } } = this.props;
    if (this.props.loading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        size="large"
      />);
    }
    return (
      <BreadcrumbWrapper>
        <Card>
          <SearchWrapper
            onSubmitForm={form => this.loadReportList(form)}
            configId={configId}
          ></SearchWrapper>
          <AutoFormTable
            style={{ marginTop: 10 }}
            configId={configId}
            parentcode='operations/carmanager/vehiclemanage'
            appendHandleRows={row => <Fragment>
              <Divider type="vertical" />
              <Tooltip title="删除">
                <Popconfirm
                  title="确认要删除吗?"
                  onConfirm={() => {
                    this.delete(
                      row['dbo.T_Bas_VehicleInfo.ID'],
                    );
                  }}
                  onCancel={this.cancel}
                  okText="是"
                  cancelText="否"
                >
                  <a href="#"><DelIcon /></a>
                </Popconfirm>
              </Tooltip>
            </Fragment>}
            {...this.props}
          >
          </AutoFormTable>
        </Card>
      </BreadcrumbWrapper>
    );
  }
}
export default Index;
