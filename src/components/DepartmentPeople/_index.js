/*
 * @desc 根据公司选择人员
 * @Author: Jiaqi
 * @Date: 2019-04-26 15:46:55
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-04-28 09:50:17
 */
import React, { Component } from 'react';
import sytles from './index.less';
import { connect } from 'dva';
import { Input, TreeSelect, Select } from 'antd';
import { routerRedux } from 'dva/router';
const InputGroup = Input.Group;
const Option = Select.Option;
@connect(({ userinfo }) => ({
  // dptList: region.dptList,
  // groupList: userinfo.groupList
}))
export default class _index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeList: [],
      groupList: [],
      sltUser: [],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let update = false;
    let newState = {};
    if (nextProps.dptList !== prevState.treeList) {
      update = true;
      newState.treeList = nextProps.dptList;
    }
    // if (nextProps.groupList !== prevState.groupList) {
    //     update = true;
    //     newState.groupList = nextProps.groupList
    // }
    return update
      ? {
          ...prevState,
          ...newState,
        }
      : null;
  }

  componentDidMount() {
    this.setState({
      sltUser: [],
    });
    this.props.dispatch({
      type: 'userinfo/GetUserInfoListByGroupId',
      payload: {
        type: this.props.type,
        callback: res => {
          this.setState({
            groupList: res,
          });
        },
      },
    });
  }

  GetSelectUser = () => {
    let user = [];
    if (this.state.groupList != null && this.state.groupList.length > 0) {
      this.state.groupList.map(u =>
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
        type: this.props.type,
        userGroupID: value,
        callback: res => {
          this.setState({
            groupList: res,
          });
        },
      },
    });
    this.setState({
      sltUser: [],
    });
    this.props.updateSltUserModel && this.props.updateSltUserModel(null);
  };

  render() {
    const { treeList, groupList } = this.state;
    const { width, minWidth } = this.props;
    return (
      <div style={{ margin: 0, width: width, minWidth: minWidth }}>
        <InputGroup compact>
          <TreeSelect
            showSearch
            defaultValue={this.props.treeValue || null}
            style={{ width: '50%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            treeData={treeList}
            allowClear
            treeDefaultExpandAll
            treeNodeFilterProp="title"
            onChange={this.onGroupChange}
          ></TreeSelect>
          <Select
            showSearch
            allowClear
            value={this.state.sltUser}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: '50%' }}
            placeholder="请选择"
            // optionFilterProp="User_Name"
            {...this.props}
          >
            {this.GetSelectUser()}
          </Select>
        </InputGroup>
      </div>
    );
  }
}
