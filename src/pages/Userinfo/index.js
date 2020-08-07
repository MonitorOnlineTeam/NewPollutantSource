import React, { Component, Fragment } from 'react';
import {
  Button,
  Input,
  Card,
  Row,
  Col,
  Table,
  Form,
  Select,
  Modal,
  Tag,
  Divider,
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
  message,
  TreeSelect,
} from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from './index.less';
import MonitorContent from '../../components/MonitorContent/index';
import Importexec from './Importexec';
import ToLoanModel from './ToLoanModel';

import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import config from '../../config';

const Option = Select.Option;
const Search = Input.Search;
const confirm = Modal.confirm;
const { isMultiEnterprise } = config;
const FormItem = Form.Item;
@connect(({ loading, userinfo }) => ({
  ...loading,
  list: userinfo.list,
  total: userinfo.total,
  pageSize: userinfo.pageSize,
  pageIndex: userinfo.pageIndex,
  requstresult: userinfo.requstresult,
  isMultiEnterprise: userinfo.isMultiEnterprise,
  dptList: userinfo.dptList,
  userRoleList: userinfo.userRoleList,
  userWhere: userinfo.userWhere,
}))
export default class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Addvisible: false,
      DataFiltervisible: false,
      EntDataFilterVisible: false,
      loading: false,
      type: '',
      title: '',
      width: 400,
      DeleteMark: '',
      UserAccount: '',
      userId: '',
      userName: '',
      roleName: '',
      Ivisible: false,
    };
  }

  componentDidMount() {
    this.onChange(this.props.pageIndex, this.props.pageSize);
    const { dispatch, dptList, userRoleList } = this.props;
    if (dptList.length === 0) {
      dispatch({
        type: 'userinfo/GetDepartmentTree',
        payload: {},
      });
    }
    if (!userRoleList.length) {
      dispatch({
        type: 'userinfo/GetUserRoleList',
      });
    }
  }

  selectRow = record => {
    this.setState({
      userId: record.key,
    });
  };
  onShowSizeChange = (pageIndex, pageSize) => {
    this.props.dispatch({
      type: 'userinfo/fetchuserlist',
      payload: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        DeleteMark: this.state.DeleteMark,
        UserAccount: this.state.UserAccount,
        GroupID: this.state.GroupID,
        RoleID: this.state.RoleID,
      },
    });
  };
  onChange = (pageIndex, pageSize) => {
    this.props.dispatch({
      type: 'userinfo/fetchuserlist',
      payload: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        DeleteMark: this.state.DeleteMark,
        UserAccount: this.state.UserAccount,
        GroupID: this.state.GroupID,
        RoleID: this.state.RoleID,
      },
    });
  };
  handleOK = e => {
    this.addForm.handleSubmit();
  };
  deleteuserbyid = id => {
    this.props.dispatch({
      type: 'userinfo/deleteuser',
      payload: {
        pageIndex: this.props.pageIndex,
        pageSize: this.props.pageSize,
        DeleteMark: this.state.DeleteMark,
        UserAccount: this.state.UserAccount,
        GroupID: this.state.GroupID,
        RoleID: this.state.RoleID,
        UserId: id,
        callback: requstresult => {
          if (requstresult == 0) {
            message.error('删除失败！');
          } else {
            message.success('删除成功！');
          }
        },
      },
    });
  };
  delete = id => {
    confirm({
      title: '确定要删除吗?',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => this.deleteuserbyid(id),
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  IsEnabled = (type, record) => {
    this.props.dispatch({
      type: 'userinfo/enableduser',
      payload: {
        pageIndex: this.props.pageIndex,
        pageSize: this.props.pageSize,
        DeleteMark: this.state.DeleteMark,
        UserAccount: this.state.UserAccount,
        GroupID: this.state.GroupID,
        RoleID: this.state.RoleID,
        UserId: record.User_ID,
        Enalbe: type,
      },
    });
  };
  onRef1 = ref => {
    this.child = ref;
  };

  AddData = () => {
    this.child.AddDataFilter();
  };
  onMenu = User_ID => {
    confirm({
      title: '重置密码',
      content: '密码将被重置为初始密码：123456，确认是否重置？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'userinfo/resetPwd',
          payload: {
            User_ID,
          },
        });
      },
    });
  };
  /** 关闭上传回调 */
  onCancel = () => {
    this.setState({
      Ivisible: false,
    });
  };
  statisticsSubmit = checkedKeys => {
    debugger;
  };
  /**
   *用户名搜索
   *
   * @memberof UserList
   */
  onUserNameSearch = userName => {
    let { userWhere } = this.props;
    userWhere = {
      ...userWhere,
      UserAccount: userName,
    };
    this.onWhereSearch(userWhere);
  };
  /**
   *用户角色搜索
   *
   * @memberof UserList
   */
  onRoleSearch = role => {
    let { userWhere } = this.props;
    userWhere = {
      ...userWhere,
      RoleID: role,
    };
    this.onWhereSearch(userWhere);
  };
  /**
   *用户部门搜索
   *
   * @memberof UserList
   */
  onGroupSearch = group => {
    debugger;

    let { userWhere } = this.props;
    userWhere = {
      ...userWhere,
      GroupID: group,
    };
    this.onWhereSearch(userWhere);
  };
  /**
   *用户标识搜索
   *
   * @memberof UserList
   */
  onDeleteMarkSearch = deleteMark => {
    let { userWhere } = this.props;
    userWhere = {
      ...userWhere,
      DeleteMark: deleteMark,
    };
    this.onWhereSearch(userWhere);
  };

  onWhereSearch = userWhere => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userinfo/updateState',
      payload: {
        userWhere: userWhere,
      },
    });
    dispatch({
      type: 'userinfo/fetchuserlist',
      payload: {
        pageIndex: 1,
        pageSize: this.props.pageSize,
      },
    });
  };
  //绑定子组件中的保存事件
  ToLoanhandleOk = e => {
    this.child.handleOk();
  };
  onRef1 = ref => {
    this.child = ref;
  };

  onback = () => {
    this.setState({
      Ivisible: false,
    });
    this.props.dispatch({
      type: 'userinfo/fetchuserlist',
      payload: {
        pageIndex: 1,
        pageSize: this.props.pageSize,
      },
    });
  };
  render() {
    const { dptList, userRoleList, userWhere } = this.props;
    const columns = [
      {
        title: '登录名称',
        dataIndex: 'User_Account',
        key: 'User_Account',
        width: '15%',
        align: 'center',
        sorter: (a, b) => a.User_Account.length - b.User_Account.length,
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '用户名称',
        dataIndex: 'User_Name',
        key: 'User_Name',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '角色名称',
        dataIndex: 'Roles_Name',
        key: 'Roles_Name',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          return text && text.toString();
        },
      },
      {
        title: '员工编号',
        dataIndex: 'User_Number',
        key: 'User_Number',
        width: '14%',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'UserGroupName',
        key: 'UserGroupName',
        width: '14%',
        // align: 'center',
        render: (text, record) => {
          return text && text.toString();
        },
      },
      {
        title: '状态',
        dataIndex: 'DeleteMark',
        key: 'DeleteMark',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          if (text === '禁用') {
            return (
              <span style={{ paddingLeft: 10 }}>
                {' '}
                <Tag color="red">
                  {' '}
                  <a onClick={() => this.IsEnabled(1, record)}> {text} </a>
                </Tag>{' '}
              </span>
            );
          }
          return (
            <span style={{ paddingLeft: 10 }}>
              {' '}
              <Tag color="blue">
                {' '}
                <a onClick={() => this.IsEnabled(2, record)}> {text} </a>
              </Tag>{' '}
            </span>
          );
        },
      },
      {
        title: '操作',
        width: '25%',
        align: 'left',
        render: (text, record) => {
          // if (record.Roles_ID !== 'eec719c2-7c94-4132-be32-39fe57e738c9') {

          return (
            <Fragment>
              <a
                onClick={() =>
                  this.props.dispatch(
                    routerRedux.push(`/rolesmanager/user/userdetail/${record.key}`),
                  )
                }
              >
                {' '}
                编辑{' '}
              </a>
              <Divider type="vertical" />
              <Popconfirm
                placement="left"
                title="确定要删除此用户吗？"
                onConfirm={() => this.deleteuserbyid(record.key)}
                okText="是"
                cancelText="否"
              >
                <a href="#"> 删除 </a>
              </Popconfirm>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  debugger;
                  this.setState({
                    ToLoanVisible: true,
                    width: 768,
                    title: '借调部门',
                    User_ID: record.User_ID,
                  });
                }}
              >
                借调
              </a>
              <Divider type="vertical" />
              <a
                onClick={e => {
                  debugger;
                  this.onMenu(record.User_ID);
                }}
              >
                重置密码
              </a>
            </Fragment>
          );
        },
      },
    ];
    return (
      <div id="userinfo">
        <BreadcrumbWrapper>
          <div className={styles.cardTitle}>
            <Card bordered={false}>
              <Row gutter={8}>
                <Col span={24}>
                  <Form layout="inline" style={{ marginBottom: 10 }}>
                    <Form.Item>
                      <Search
                        placeholder="用户名/登录名"
                        allowClear
                        defaultValue={userWhere.UserAccount}
                        onSearch={value => this.onUserNameSearch(value)}
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    <Form.Item>
                      <TreeSelect
                        style={{ width: 220, marginLeft: 10 }}
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择部门"
                        treeData={dptList}
                        allowClear
                        treeDefaultExpandAll
                        defaultValue={userWhere.GroupID}
                        treeNodeFilterProp="title"
                        onChange={value => this.onGroupSearch(value)}
                      ></TreeSelect>
                    </Form.Item>
                    <Form.Item>
                      <Select
                        allowClear
                        // value={this.state.RoleID}
                        placeholder="角色名称"
                        defaultValue={userWhere.RoleID}
                        style={{ width: 180, marginLeft: 10 }}
                        onChange={value => this.onRoleSearch(value)}
                      >
                        {userRoleList.map(user => {
                          return (
                            <Option key={user.RoleID} value={user.RoleID}>
                              {user.RoleName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Select
                        allowClear
                        placeholder="请选择"
                        defaultValue={userWhere.DeleteMark}
                        style={{ width: 150, marginLeft: 10 }}
                        onChange={value => this.onDeleteMarkSearch(value)}
                      >
                        <Option value="1">启用</Option>
                        <Option value="2">禁用</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                          this.props.dispatch(
                            routerRedux.push(`/rolesmanager/user/userdetail/null`),
                          );
                        }}
                      >
                        添加
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          this.setState({
                            Ivisible: true,
                            width: 768,
                            title: '导入',
                          });
                        }}
                      >
                        导入
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Table
                loading={this.props.effects['userinfo/fetchuserlist']}
                columns={columns}
                className={styles.dataTable}
                size="small" // small middle
                dataSource={this.props.requstresult === '1' ? this.props.list : null}
                scroll={{ y: 'calc(100vh - 330px)' }}
                rowClassName={(record, index, indent) => {
                  if (index === 0) {
                    return;
                  }
                  if (index % 2 !== 0) {
                    return 'light';
                  }
                }}
                pagination={{
                  showSizeChanger: true,
                  showQuickJumper: true,
                  total: this.props.total,
                  pageSize: this.props.pageSize,
                  current: this.props.pageIndex,
                  onChange: this.onChange,
                  onShowSizeChange: this.onShowSizeChange,
                  pageSizeOptions: ['5', '10', '20', '30', '40'],
                }}
              />
              <Modal
                visible={this.state.Ivisible}
                title={this.state.title}
                width={this.state.width}
                destroyOnClose={true} // 清除上次数据
                footer={false}
                onCancel={() => {
                  this.setState({
                    Ivisible: false,
                  });
                }}
              >
                {<Importexec onback={this.onback} />}
              </Modal>
              <Modal
                visible={this.state.ToLoanVisible}
                title={this.state.title}
                width={this.state.width}
                destroyOnClose={true} // 清除上次数据
                onOk={this.ToLoanhandleOk}
                onCancel={() => {
                  this.setState({
                    ToLoanVisible: false,
                  });
                }}
              >
                {
                  <ToLoanModel
                    onCancel={() => {
                      this.setState({
                        ToLoanVisible: false,
                      });
                    }}
                    onRef={this.onRef1}
                    User_ID={this.state.User_ID}
                    visible={this.state.ToLoanVisible}
                  />
                }
              </Modal>
            </Card>
          </div>
        </BreadcrumbWrapper>
      </div>
    );
  }
}
