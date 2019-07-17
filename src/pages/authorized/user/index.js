import React, { Component, Fragment } from 'react';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Form,
  Spin,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
  message,
  DatePicker,
  InputNumber,
  Tooltip
} from 'antd';
import styles from './style.less';
import MonitorContent from '@/components/MonitorContent';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import SdlTable from '@/components/AutoForm/Table';
import SearchWrapper from '@/components/AutoForm/SearchWrapper';
import { sdlMessage } from '@/utils/utils';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
const { confirm } = Modal;

@connect(({ loading, autoForm }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm: autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
}))
export default class UserInfoIndex extends Component {
  constructor(props) {
    super(props);
    console.log('1');
    this.state = {};
  }

  componentDidMount() {
    const { match } = this.props;
    this.reloadPage(match.params.configId);
  }

  componentWillReceiveProps(nextProps) {
    //debugger;
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig)
        this.reloadPage(nextProps.match.params.configId);
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
        configId: configId,
      },
    });
  };
  confirm(userid) {
    this.props.dispatch({
      type: 'userinfo/deluserandroledep',
      payload: {
        User_ID: userid,
      },
    });
  }
  showConfirm = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys.length == 0) {
      message.error('请至少选中一行');
      return;
    }
    const { dispatch } = this.props;
    confirm({
      title: '是否确认重置密码?',
      content: '',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        var str = [];
        selectedRows.map(item => str.push(item['dbo.Base_UserInfo.User_ID']));
        console.log(str);
        dispatch({
          type: 'userinfo/resetpwd',
          payload: {
            User_ID: str,
          },
        });
      },
      onCancel() {
        console.log('取消');
      },
    });
  };

  cancel(e) {
    console.log(e);
  }
  render() {
    const {
      searchConfigItems,
      searchForm,
      tableInfo,
      match: {
        params: { configId },
      },
      dispatch,
    } = this.props;
    const searchConditions = searchConfigItems[configId] || [];
    const columns = tableInfo[configId] ? tableInfo[configId]['columns'] : [];
    if (this.props.loading) {
      return (
        <Spin
          style={{
            width: '100%',
            height: 'calc(100vh/2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    return (
    //   <MonitorContent
    //     breadCrumbList={[
    //       { Name: '首页', Url: '/' },
    //       { Name: '权限管理', Url: '' },
    //       { Name: '用户管理', Url: '/rolesmanager/userinfoindex/UserInfo' },
    //     ]}
    //   >
    <PageHeaderWrapper>
        <div className={styles.cardTitle}>
          <Card>
            <SearchWrapper
              // formItemList={searchConditions}
              // formChangeActionType=""
              // searchFormState={{
              // }}
              onSubmitForm={form => this.loadReportList(form)}
              configId={configId}
              // loadDataSourceParams={[
              //   {
              //     Key: "test",
              //     Value: false,
              //     Where: "$like"
              //   }
              // ]}
            ></SearchWrapper>
            <SdlTable
              style={{ marginTop: 10 }}
              // columns={columns}
              configId={configId}
              onAdd={() => {
                dispatch(routerRedux.push('/rolesmanager/userinfoadd'));
              }}
              rowChange={(key, row) => {
                this.setState({
                  key,
                  row,
                });
              }}
              appendHandleButtons={(selectedRowKeys, selectedRows) => {
                return (
                  <Fragment>
                    <Button
                      type="danger"
                      onClick={() => {
                        // console.log('selectedRowKeys=', selectedRowKeys);
                        // console.log('selectedRows=', selectedRows);
                        this.showConfirm(selectedRowKeys, selectedRows);
                      }}
                    >
                      重置密码
                    </Button>
                  </Fragment>
                );
              }}
              appendHandleRows={row => {
                return (
                  <Fragment>
                    <Tooltip title="编辑">
                    <a
                      onClick={() => {
                        dispatch(
                          routerRedux.push(
                            '/rolesmanager/userinfoedit/' + row['dbo.Base_UserInfo.User_ID'],
                          ),
                        );
                      }}
                    >
                      <Icon type="edit" style={{ fontSize: 16 }} />
                    </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="详情">
                    <a
                      onClick={() => {
                        dispatch(
                          routerRedux.push(
                            '/rolesmanager/userinfoview/' + row['dbo.Base_UserInfo.User_ID'],
                          ),
                        );
                      }}
                    >
                      <Icon type="profile" style={{ fontSize: 16 }} />
                    </a>
                    </Tooltip>
                    <Divider type="vertical" />
                    <Tooltip title="删除">
                    <Popconfirm
                      title="确认要删除吗?"
                      onConfirm={() => {
                        this.confirm(row['dbo.Base_UserInfo.User_ID']);
                      }}
                      onCancel={this.cancel}
                      okText="是"
                      cancelText="否"
                    >
                      <a href="#"><Icon type="delete" style={{ fontSize: 16 }} /></a>
                    </Popconfirm>
                    </Tooltip>
                  </Fragment>
                );
              }}
              // loadDataSourceParams={[
              //   {
              //     Key: "test",
              //     Value: false,
              //     Where: "$like"
              //   }
              // ]}
              // dataSource={dataSource}
            ></SdlTable>
          </Card>
        </div>
        </PageHeaderWrapper>
    );
  }
}
