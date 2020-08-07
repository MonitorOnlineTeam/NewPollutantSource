import React, { Component } from 'react';
import {
  Col,
  Row,
  Form,
  Input,
  Radio,
  Switch,
  InputNumber,
  message,
  Select,
  Button,
  Card,
  Divider,
  Spin,
  TreeSelect,
  Popover,
  Icon,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import MonitorContent from '../../components/MonitorContent/index';
import styles from './index.less';
import { EnumRequstResult } from '../../utils/enum';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

const { TextArea } = Input;
const children = [];
for (let i = 0; i < 21; i++) {
  children.push(<Option key={i}> {i}</Option>);
}
@connect(({ loading, userinfo }) => ({
  isloading: loading.effects['userinfo/getuser'],
  isAddUserLoading: loading.effects['userinfo/adduser'] || loading.effects['userinfo/edituser'],
  reason: userinfo.reason,
  requstresult: userinfo.requstresult,
  editUser: userinfo.editUser,
  dptList: userinfo.dptList,
  userRoleList: userinfo.userRoleList,
  userRegionList: userinfo.userRegionList,
}))
@Form.create()
class AddUser extends Component {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { UserId },
      },
      dptList,
      userRoleList,
      userRegionList,
    } = this.props;
    if (UserId !== 'null') {
      dispatch({
        type: 'userinfo/getuser',
        payload: {
          UserId: UserId,
          callback: () => {},
        },
      });
    }
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
    if (!userRegionList.length) {
      dispatch({
        type: 'userinfo/GetUserRegionList',
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    let flag = true;
    const {
      dispatch,
      form,
      match: {
        params: { UserId },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      let { User_Account: UserAccount } = values;
      const that = this;
      if (UserId === 'null') {
        dispatch({
          type: 'userinfo/isexistenceuser',
          payload: {
            UserAccount,
            callback: () => {
              if (that.props.reason === '1') {
                flag = false;
                that.props.form.setFields({
                  // 设置验证返回错误
                  User_Account: {
                    value: UserAccount,
                    errors: [new Error('登录名已存在，请重新填写')],
                  },
                });
              } else {
                flag = true;
                that.props.form.setFields({
                  // 设置验证返回错误
                  User_Account: {
                    value: UserAccount,
                    errors: null,
                  },
                });
              }
              if (!err && flag === true) {
                that.props.dispatch({
                  type: 'userinfo/adduser',
                  payload: {
                    UserAccount: values.User_Account,
                    UserName: values.User_Name,
                    UserSex: values.User_Sex,
                    Group_Id: values.Group_Id,
                    // Email: values.Email === undefined ? '' : values.Email,
                    // Phone: values.Phone === undefined ? '' : values.Phone,
                    // Title: values.Title === undefined ? '' : values.Title,
                    // UserOrderby: values.User_Orderby,
                    // SendPush: values.SendPush === undefined ? '' : values.SendPush.join(','),
                    // AlarmType: values.AlarmType === undefined ? '' : values.AlarmType,
                    // AlarmTime: values.AlarmTime === undefined ? '' : values.AlarmTime.join(','),
                    UserRemark: values.User_Remark === undefined ? '' : values.User_Remark,
                    DeleteMark: values.DeleteMark === true ? 1 : 2,
                    RolesId: values.Roles_Name.toString(),
                    PinYin: values.PinYin,
                    User_Number: 'SDL' + values.User_Number,
                    RegionId: values.UserRegionId,
                    callback: requstresult => {
                      if (requstresult == EnumRequstResult.Success) {
                        this.success();
                      } else {
                        message.error('操作失败', 1);
                      }
                    },
                  },
                });
              }
            },
          },
        });
      } else if (!err && flag === true) {
        that.props.dispatch({
          type: 'userinfo/edituser',
          payload: {
            UserId: UserId,
            UserAccount: values.User_Account,
            UserName: values.User_Name,
            UserSex: values.User_Sex,
            Group_Id: values.Group_Id,
            // Email: values.Email === undefined ? '' : values.Email,
            // Phone: values.Phone === undefined ? '' : values.Phone,
            // Title: values.Title === undefined ? '' : values.Title,
            // UserOrderby: values.User_Orderby,
            // SendPush: values.SendPush === undefined ? '' : values.SendPush.join(','),
            // AlarmType: values.AlarmType === undefined ? '' : values.AlarmType,
            // AlarmTime: values.AlarmTime === undefined ? '' : values.AlarmTime.join(','),
            UserRemark: values.User_Remark === undefined ? '' : values.User_Remark,
            DeleteMark: values.DeleteMark === true ? 1 : 2,
            RolesId: values.Roles_Name.toString(),
            PinYin: values.PinYin,
            User_Number: 'SDL' + values.User_Number,
            RegionId: values.UserRegionId,
            callback: requstresult => {
              if (requstresult == EnumRequstResult.Success) {
                this.success();
              } else {
                message.error('操作失败', 1);
              }
            },
          },
        });
      }
    });
  };

  success = () => {
    const {
      dispatch,
      match: {
        params: { UserId },
      },
    } = this.props;
    let index = dispatch(routerRedux.push(`/rolesmanager/user/userinfo`));
    if (UserId !== 'null') {
      message.success('修改成功', 3).then(() => index);
    } else {
      message.success('新增成功', 3).then(() => index);
    }
  };
  selectNode = (value, node, extra) => {
    console.log(value);
    console.log(node);
    console.log(extra);
    debugger;
  };
  onGroupChange = (value, label, extra) => {
    console.log(value);
    console.log(label);
    console.log(extra);
    debugger;
  };

  render() {
    const {
      dispatch,
      form,
      match,
      isloading,
      isAddUserLoading,
      editUser,
      dptList,
      userRoleList,
      userRegionList,
    } = this.props;
    console.log('dptList----------------------------------------------', dptList);
    const { getFieldDecorator } = form;
    const { UserId } = match.params;
    let popoverContentRole = [];
    const DepartInfo = (
      <div>
        <p>如果用户是区域经理：请分配省区部门；</p>
        <p>如果用户是分区经理或运维人员：请分配市区部门；</p>
      </div>
    );
    // const UserId = this.props.match.params.UserId;
    if (isloading) {
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
    const {
      User_Name: UserName = null,
      User_Account: UserAccount,
      User_Sex: UserSex,
      DeleteMark,
      Email,
      Phone,
      Title,
      User_Orderby: UserOrderby,
      AlarmType,
      SendPush,
      AlarmTime,
      Roles_Name: RolesName, //这个明明是ID?
      User_Remark: UserRemark,
      UserGroupID,
      PinYin,
      User_Number,
      UserRegionId,
      RegionId,
      RegionName,
    } = editUser === null || UserId === 'null' ? {} : editUser;
    // if (Roles_Name) {
    //   Roles_Name = JSON.parse(Roles_Name);
    // }
    //获取描述信息
    userRoleList.map((item, key) => {
      if (item.RoleRemark) {
        popoverContentRole.push(
          <p>
            <span className={styles.TitleClassName}>{`${item.RoleName}：`}</span>
            <span>{item.RoleRemark}</span>
          </p>,
        );
      }
    });

    return (
      <MonitorContent
        {...this.props}
        breadCrumbList={[
          { Name: '系统管理', Url: '' },
          { Name: '用户管理', Url: '/sysmanage/Userinfo' },
          { Name: '用户维护', Url: '' },
        ]}
      >
        <div>
          <Form onSubmit={this.handleSubmit}>
            <Card style={{}} title="用户维护">
              <Row gutter={48}>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="用户姓名">
                    {getFieldDecorator('User_Name', {
                      initialValue: UserName,
                      rules: [
                        {
                          required: true,
                          message: '请输入用户姓名!',
                        },
                      ],
                    })(<Input placeholder="例如：张三" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="姓名拼音">
                    {getFieldDecorator('PinYin', {
                      initialValue: PinYin,
                      rules: [
                        {
                          required: true,
                          message: '请输入姓名拼音!',
                        },
                      ],
                    })(<Input placeholder="例如：zhangsan" />)}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="登录名称">
                    {getFieldDecorator('User_Account', {
                      initialValue: UserAccount,
                      rules: [
                        {
                          required: true,
                          message: '请输入登录名称!',
                        },
                      ],
                    })(
                      <Input
                        placeholder="使用员工编号，格式：SDL0001"
                        disabled={UserId !== 'null'}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="员工编号">
                    {getFieldDecorator('User_Number', {
                      initialValue: User_Number && User_Number.toLowerCase().replace('sdl', ''),
                      rules: [
                        {
                          required: true,
                          message: '请输入员工编号!',
                        },
                        // {
                        //   validator: this.compareToFirstPassword,
                        // }
                      ],
                    })(
                      <Input
                        type="number"
                        placeholder="例如：0001"
                        addonBefore={<span>SDL</span>}
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="用户性别">
                    {getFieldDecorator('User_Sex', {
                      initialValue: UserSex || 1,
                    })(
                      <RadioGroup onChange={this.onChange}>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="用户状态">
                    {getFieldDecorator('DeleteMark', {
                      initialValue: DeleteMark === undefined || DeleteMark,
                      valuePropName: 'checked',
                    })(<Switch checkedChildren="启用" unCheckedChildren="禁用" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="角色名称">
                    {' '}
                    {getFieldDecorator('Roles_Name', {
                      initialValue: RolesName && RolesName,
                      rules: [
                        {
                          required: true,
                          message: '请选择角色!',
                          type: 'array',
                        },
                      ],
                    })(
                      <Select style={{ width: '90%' }} mode="multiple" placeholder="请选择">
                        {userRoleList.map(user => {
                          return (
                            <Option key={user.RoleID} value={user.RoleID}>
                              {user.RoleName}
                            </Option>
                          );
                        })}
                      </Select>,
                    )}
                    <Popover content={popoverContentRole}>
                      <Icon style={{ width: '10%' }} type="question-circle" theme="twoTone" />
                    </Popover>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="部门">
                    {' '}
                    {getFieldDecorator('Group_Id', {
                      initialValue: UserGroupID,
                      rules: [
                        {
                          required: true,
                          message: '请选择部门',
                        },
                      ],
                    })(
                      <TreeSelect
                        style={{ width: '90%' }}
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择部门"
                        treeData={dptList}
                        allowClear
                        treeDefaultExpandedKeys={
                          dptList ? (dptList[0] ? [dptList[0].key] : []) : []
                        }
                        treeNodeFilterProp="title"
                        treeCheckable
                        treeCheckStrictly
                      ></TreeSelect>,
                    )}
                    <Popover content={DepartInfo}>
                      <Icon style={{ width: '10%' }} type="question-circle" theme="twoTone" />
                    </Popover>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={48}>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="行政区域">
                    {' '}
                    {getFieldDecorator('UserRegionId', {
                      initialValue: UserRegionId && UserRegionId,
                      rules: [
                        {
                          required: true,
                          message: '请选择行政区域!',
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '90%' }}
                        showSearch
                        allowClear
                        optionFilterProp="RegionName"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="请选择行政区域"
                      >
                        {userRegionList.map(user => {
                          return (
                            <Option key={user.RegionId} value={user.RegionId}>
                              {user.RegionName}
                            </Option>
                          );
                        })}
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="备注">
                    {getFieldDecorator('User_Remark', {
                      initialValue: UserRemark,
                    })(<Input style={{ width: '100%' }} />)}
                  </FormItem>
                </Col>
              </Row>
              <Divider orientation="right" style={{ border: '1px dashed #FFFFFF' }}>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={isAddUserLoading}
                  >
                    保存
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    type="dashed"
                    onClick={() => dispatch(routerRedux.push(`/rolesmanager/user/userinfo`))}
                  >
                    返回
                  </Button>
                </Col>
              </Divider>
            </Card>
          </Form>
        </div>
      </MonitorContent>
    );
  }
}
export default AddUser;
