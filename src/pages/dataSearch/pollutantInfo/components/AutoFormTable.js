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
import SdlTable from '@/pages/AutoFormManager/AutoFormTable';

@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig
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
    // if (nextProps.location.pathname != this.props.location.pathname) {
    //   if (nextProps.match.params.configId !== this.props.routerConfig)
    //     this.reloadPage(nextProps.match.params.configId);
    // }
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
  }

  render() {
    const { searchConfigItems, searchForm, tableInfo, configId, dispatch } = this.props;
    const searchConditions = searchConfigItems[configId] || []
    const columns = tableInfo[configId] ? tableInfo[configId]["columns"] : [];
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
            <SdlTable
              style={{ marginTop: 10 }}
              configId={configId}
              rowChange={(key, row) => {
                this.setState({
                  key, row
                })
              }}
              isCenter
              {...this.props}
              pagination={false}
              otherParams={{
                pageIndex: 1,
                pageSize: 9999999
               }}
            />
          </Card>
        </div>
    );
  }
}
