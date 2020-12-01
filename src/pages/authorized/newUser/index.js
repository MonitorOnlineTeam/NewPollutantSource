/*
 * @Author: 贾安波
 * @Date: 2020-12-1
 * @LastEditors: 贾安波
 * @LastEditTime: 2020-12-1
 * @Description: 用户管理 新页面
 */
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
  Tooltip,
} from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import AutoFormTable from '../../AutoFormManager/AutoFormTable';
import SearchWrapper from '../../AutoFormManager/SearchWrapper';
import { sdlMessage } from '@/utils/utils';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import SdlTable from '@/components/SdlTable';

import styles from './style.less';
const { confirm } = Modal;

@connect(({ loading, autoForm,newuserinfo }) => ({
  loading: loading.effects['autoForm/getPageConfig'],
  autoForm,
  searchConfigItems: autoForm.searchConfigItems,
  // columns: autoForm.columns,
  tableInfo: autoForm.tableInfo,
  searchForm: autoForm.searchForm,
  routerConfig: autoForm.routerConfig,
  tableDatas:newuserinfo.tableDatas
}))
export default class UserInfoIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys:[],
    };

    this.columns = [
      {
        title: <span>登录名</span>,
        dataIndex: 'regionName',
        key: 'regionName',
        align: 'center',
      },
      {
        title: <span>真实姓名</span>,
        dataIndex: 'entName',
        key: 'entName',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>部门</span>,
        dataIndex: 'pointName',
        key: 'pointName',
        align: 'center',
        render: (text, record) => {     
          return  <div style={{textAlign:'left',width:'100%'}}>{text}</div>
       },
      },
      {
        title: <span>角色</span>,
        dataIndex: 'firstAlarmTime',
        key: 'firstAlarmTime',
        align: 'center',
        render:(text,row)=>{
          return `${row.firstAlarmTime}~${row.alarmTime}`
        }
      },
      {
        title: <span>手机号</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: <span>推送类型</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: <span>报警类别</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: <span>报警时间</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: <span>拼音</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },
      {
        title: <span>操作</span>,
        dataIndex: 'defectCount',
        key: 'defectCount',
        align: 'center',
      },

    ];
  }

  componentDidMount() {
    const { match } = this.props;
    this.reloadPage(match.params.configId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname != this.props.location.pathname) {
      if (nextProps.match.params.configId !== this.props.routerConfig) {this.reloadPage(nextProps.match.params.configId);}
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
        let str = [];
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
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
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
    const columns = tableInfo[configId] ? tableInfo[configId].columns : [];
    
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
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
      <BreadcrumbWrapper title="用户管理">
          <Card>
          <Form layout="inline">
                <Form.Item label='登录名'>
                  <Input placeholder='请输入登录名' />
                </Form.Item>
                <Form.Item label='真实姓名'>
                  <Input placeholder='请输入真实姓名' />
                </Form.Item>
                <Form.Item label='部门'>
                  <Select
                    placeholder="请选择部门"
                    onChange={this.typeChange}
                    value={this.props.pollutantType}
                    style={{ width: 200, marginLeft: 10 }}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                </Form.Item>
                <Form.Item label='角色'>
                  <Select
                    placeholder="请选择角色"
                    onChange={this.typeChange}
                    value={this.props.pollutantType}
                    style={{ width: 200, marginLeft: 10 }}
                  >
                    <Option value="">全部</Option>
                    <Option value="1">废水</Option>
                    <Option value="2">废气</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                <Button type='primary' style={{ marginLeft: 8 }}> 查询</Button>
                <Button style={{ marginLeft: 8 }}> 重置</Button>
                </Form.Item>
                </Form>
                <Form layout="inline"  style={{padding:'10px 0'}}>  
                <Form.Item>
              <Button
              style={{ marginRight: 8 }}
               icon="plus"
               type="primary"
                onClick={() => {
                this.props.onAdd ? this.props.onAdd() : dispatch(routerRedux.push(`/${parentcode || match.params.parentcode}/autoformmanager/${configId}/autoformadd`));
               }}>添加</Button>
                </Form.Item>
                <Form.Item>
                   <Button
                    type="danger"
                    onClick={() => {
                      this.showConfirm(selectedRowKeys, selectedRows);
                    }}
                    style={{marginRight:8}}
                  >
                    重置密码
                  </Button>
                </Form.Item>

                <Form.Item>
                <Dropdown overlay={() => <Menu onClick={this.moreClick}>

                    <Menu.Item>
                    <Icon type='export' />导出
                  </Menu.Item> 
            </Menu>}>
              <Button>
                更多操作 <Icon type="down" />
              </Button>
            </Dropdown>
                </Form.Item>
                </Form>
            {/* <SearchWrapper
              onSubmitForm={form => this.loadReportList(form)}
              configId={configId}
            ></SearchWrapper> */}
            {/* <AutoFormTable
              style={{ marginTop: 10 }}
              configId={configId}
              onAdd={() => {
                dispatch(routerRedux.push('/rolesmanager/user/userinfoadd?tabName=用户管理 - 添加'));
              }}
              rowChange={(key, row) => {
                this.setState({
                  key,
                  row,
                });
              }}
              appendHandleButtons={(selectedRowKeys, selectedRows) => (
                  <Fragment>
                    <Button
                      type="danger"
                      onClick={() => {
                        this.showConfirm(selectedRowKeys, selectedRows);
                      }}
                      style={{marginRight:8}}
                    >
                      重置密码
                    </Button>
                  </Fragment>
                )}
              appendHandleRows={row => (
                  <Fragment>
                    <Tooltip title="编辑">
                      <a
                        onClick={() => {
                          dispatch(
                            routerRedux.push(
                              '/rolesmanager/user/userinfoedit/' + row['dbo.Base_UserInfo.User_ID'] + "?tabName=用户管理 - 编辑",
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
                              '/rolesmanager/user/userinfoview/' + row['dbo.Base_UserInfo.User_ID'] + "?tabName=用户管理 - 详情",
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
                )}
            /> */}
            <SdlTable
              rowKey={(record, index) => `complete${index}`}
              rowSelection={rowSelection} 
              loading={this.props.loading}
              columns={this.columns}
              dataSource={this.props.tableDatas}
              pagination={{
                defaultPageSize:20
              }}
            />
          </Card>
      </BreadcrumbWrapper>
    );
  }
}
