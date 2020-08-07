import React, { Component } from 'react';
import sytles from './index.less';
import { connect } from 'dva';
import { Input, TreeSelect, Select } from 'antd';
import userinfo from '../../pages/Userinfo/model';
/*
组件：部门、人员选择点位组件
add by hsh 19.4.11
*/
const InputGroup = Input.Group;
const Option = Select.Option;
@connect(userinfo => ({
  dptList: userinfo.dptList,
  groupList: userinfo.groupList,
}))
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: this.props.userList,
      sltUser: this.props.OperationsUserId === undefined ? [] : this.props.OperationsUserId,
    };
  }
  componentWillMount() {
    this.setState({
      sltUser: [],
    });
    if (this.props.onRef !== undefined) {
      this.props.onRef(this);
    }
    this.props.dispatch({
      type: 'userinfo/GetDepartmentTree',
      payload: {},
    });
    this.props.dispatch({
      type: 'userinfo/GetUserInfoListByGroupId',
      payload: {},
    });
  }

  //置空
  Reset = () => {
    this.setState({
      sltUser: [],
    });
  };

  GetSelectUser = () => {
    let user = [];
    if (this.props.groupList != null && this.props.groupList.length > 0) {
      this.props.groupList.map(u =>
        user.push(
          <Option key={u.User_ID} value={u.User_ID}>
            {u.User_Name}
          </Option>,
        ),
      );
    }
    return user;
  };

  onGroupChange = value => {
    this.props.dispatch({
      type: 'userinfo/GetUserInfoListByGroupId',
      payload: {
        userGroupID: value,
      },
    });

    this.setState({
      sltUser: [],
    });
    this.props.updateSltUserModel(null);
  };

  onUserSelect = value => {
    this.setState({
      sltUser: value,
    });
    this.props.updateSltUserModel(value);
  };

  render() {
    const dets = this.props.dptList;
    const { width, minWidth } = this.props;
    return (
      <div style={{ margin: 0, width: width, minWidth: minWidth }}>
        <InputGroup compact>
          <TreeSelect
            showSearch
            style={{ width: '50%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            treeData={dets}
            allowClear
            treeDefaultExpandAll
            treeNodeFilterProp="title"
            onChange={this.onGroupChange}
          ></TreeSelect>
          <Select
            showSearch
            allowClear
            value={this.state.sltUser}
            style={{ width: '50%' }}
            placeholder="请选择"
            optionFilterProp="User_Name"
            onChange={this.onUserSelect}
            {...this.props}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.GetSelectUser()}
          </Select>
        </InputGroup>
      </div>
    );
  }
}
