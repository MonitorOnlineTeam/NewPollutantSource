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
import { routerRedux } from 'dva/router';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';

@connect(({ loading, autoForm }) => ({
  // loading: loading.effects['autoForm/getPageConfig'],
  // autoForm: autoForm,
  // searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  // tableInfo: autoForm.tableInfo,
  // searchForm: autoForm.searchForm,
  // routerConfig: autoForm.routerConfig
}))

export default class AutoFormIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadFlag:false,
    };

  }
 
  componentDidMount() {
    const { match } = this.props;
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.isModal){
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig)
        this.reloadPage(nextProps.match.params.configId);
    }
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
        configId: configId
      },
      callback:()=>{
       this.setState({loadFlag:true})
      },
    })
  }
  render() {
    const { searchConfigItems, searchForm, tableInfo, match: { params: { configId } }, dispatch,isModal} = this.props;
    const isFixedOpera =  configId === 'Storehouse'? true : false;
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
      <BreadcrumbWrapper hideBreadcrumb={isModal}>
        <div>
          <Card bordered={false}>
            <SearchWrapper
              onSubmitForm={(form) => this.loadReportList(form)}
              configId={configId}
            ></SearchWrapper>
            <AutoFormTable
              noload
              getPageConfig
              handleMode="modal" 
              style={{ marginTop: 10 }}
              configId={configId}
              rowChange={(key, row) => {
                this.setState({
                  key, row
                })
              }}
              isCenter
              isFixedOpera={isFixedOpera}
              {...this.props}
            />
          </Card>
        </div>
        </BreadcrumbWrapper>
      // </MonitorContent>
    );
  }
}
