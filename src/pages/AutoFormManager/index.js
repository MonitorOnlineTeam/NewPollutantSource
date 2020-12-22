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
import styles from './index.less';
import MonitorContent from '../../components/MonitorContent/index';
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import SdlTable from './AutoFormTable';
import SearchWrapper from './SearchWrapper';

@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  routerConfig: autoForm.routerConfig
}))

export default class AutoFormIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {};

  }

  componentDidMount() {
    const { match } = this.props;
    this.reloadPage(match.params.configId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig)
        this.reloadPage(nextProps.match.params.configId);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.routerConfig !== nextProps.routerConfig) {
  //     return false;
  //   }
  //   if (this.props.configId !== nextProps.configId) {
  //     return false;
  //   }
  //   return true;
  // }

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
        configId: configId
      }
    })
  }

  render() {
    const { tableInfo, match: { params: { configId } } } = this.props;
    if (this.props.loading !== false ) {
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
      <BreadcrumbWrapper>
        <div className={styles.cardTitle}>
          <Card>
            <SearchWrapper configId={configId} />
            <SdlTable
              style={{ marginTop: 10 }}
              noload
              configId={configId}
              rowChange={(key, row) => {
                this.setState({
                  key, row
                })
              }}
              {...this.props}
            />
          </Card>
        </div>
      </BreadcrumbWrapper>
    );
  }
}
