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
import SdlTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';

@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig
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
    this.reloadPage(match.params.configId);
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
        configId: configId
      },
      callback:()=>{
       this.setState({loadFlag:true})
      },
    })
  }
  render() {
    const { searchConfigItems, searchForm, tableInfo, match: { params: { configId } }, dispatch } = this.props;
    const searchConditions = searchConfigItems[configId] || []
    const columns = tableInfo[configId] ? tableInfo[configId]["columns"] : [];
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
      // <MonitorContent breadCrumbList={
      //   [
      //     { Name: '首页', Url: '/' },
      //     { Name: '系统管理', Url: '' },
      //     { Name: 'AutoForm', Url: '' }
      //   ]
      // }>
      <BreadcrumbWrapper>
        <div>
          <Card>
            <SearchWrapper
              // formItemList={searchConditions}
              // formChangeActionType=""
              // searchFormState={{
              // }}
              onSubmitForm={(form) => this.loadReportList(form)}
              configId={configId}
            // loadDataSourceParams={[
            //   {
            //     Key: "test",
            //     Value: false,
            //     Where: "$like"
            //   }
            // ]}
            ></SearchWrapper>
            {this.state.loadFlag&&<SdlTable
              style={{ marginTop: 10 }}
              // columns={columns}
              configId={configId}
              rowChange={(key, row) => {
                this.setState({
                  key, row
                })
              }}
              {...this.props}
              isCenter
              isFixedOpera={isFixedOpera}
              // onAdd={()=>{
              //   console.log("点击了添加")
              // }}
              // appendHandleRows={row => {
              //   return <Fragment>
              //     <Divider type="vertical" />
              //     <a onClick={() => {
              //       console.log('row=', row)
              //     }}>测试</a>
              //   </Fragment>
              // }}
              // appendHandleButtons={(selectedRowKeys, selectedRows) => {
              //   return <Fragment>
              //     <Button icon="printer" type="primary" onClick={() => {
              //       console.log('selectedRowKeys=', selectedRowKeys);
              //       console.log('selectedRows=', selectedRows);
              //     }}>维护点信息</Button>
              //   </Fragment>
              // }}
            // searchParams={[
            //   {
            //     Key: "test",
            //     Value: false,
            //     Where: "$like"
            //   }
            // ]}
            // dataSource={dataSource}
            />}
          </Card>
        </div>
        </BreadcrumbWrapper>
      // </MonitorContent>
    );
  }
}
