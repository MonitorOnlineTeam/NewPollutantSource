import React, { Component, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Spin,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
} from 'antd';
import styles from '@/pages/AutoFormManager/index.less';
import MonitorContent from '@/components/MonitorContent/index';
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
}))

export default class AutoFormTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  componentDidMount() {
    const { configId } = this.props;
    this.reloadPage(configId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig)
        this.reloadPage(nextProps.match.params.configId);
    }
  }

  reloadPage = (configId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'autoForm/updateState',
      payload: {
        routerConfig: configId
      }
    });
    dispatch({
      type: 'autoForm/getPageConfig',
      payload: {
        configId: configId,
      }
    })
    // dispatch({
    //   type: 'monitorTarget/updateState',
    //   payload: {
    //     pollutantType: type,
    //     pointDataWhere: [
    //       {
    //         Key: 'dbo__T_Cod_MonitorPointBase__BaseCode',
    //         Value: match.params.targetId,
    //         Where: '$=',
    //       },
    //     ],
    //   },
    // });
  }

  render() {
    const { searchConfigItems, searchForm, tableInfo, configId, dispatch,pointDataWhere, } = this.props;
    if (this.props.loading) {
      return (<Spin
        style={{
          width: '100%',
          height: 'calc(100vh/2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        size="large"
      />);
    }
    return (

      <div className={styles.cardTitle}>
        <Card>
          <SearchWrapper
            searchParams={pointDataWhere}
            onSubmitForm={form => this.loadReportList(form)}
            configId={configId}
            isCoustom
            selectType='3,是'
            // resultConfigId={pointConfigId}
          ></SearchWrapper>
          <AutoFormTable
            style={{ marginTop: 10 }}
            configId={configId}
            isCenter
            {...this.props}
            pagination={false}
          />
        </Card>
      </div>
    );
  }
}
