/*
 * @Author: lzp
 * @Date: 2019-07-16 09:42:48
 * @LastEditors: outman0611
 * @LastEditTime: 2024-09-30 14:57:09
 * @Description: 设置用户权限
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';


import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import {
  Input,
  Button,
  Card,
  Spin,
  Row,
  Col,
  Table,
  Modal,
  Checkbox,
  TreeSelect,
  message,
  Divider,
  Popconfirm,
  Empty,
  Transfer,
  Switch,
  Tag,
  Tree,
  Radio,
  Tooltip,
  Popover,
  Select,
} from 'antd';
import difference from 'lodash/difference';
import SelectPollutantType from '@/components/SelectPollutantType';
import TreeTransfer from '@/components/TreeTransfer';
const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
import TreeTransferSingle from '@/components/TreeTransferSingle';
@connect(({ loading, common, global }) => ({
  userLoading: loading.effects[`common/getUserList`],
  userList: common.userList,
  clientHeight: global.clientHeight,

}))
@Form.create()
class DepartIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.getUserList();
  }
  //获取角色列表
  getUserList = params => {
    this.props.dispatch({
      type: 'common/getUserList',
      payload: { roleListID: '', groupListID: '', userName: '', userAccount: '' },
    });
  };
  render() {


    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        destroyOnClose={true}
        onCancel={() => { this.props.onCancel() }}
        width={1100}
        footer={null}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: this.props.clientHeight - 240,
        }}
      >
        <Spin spinning={this.props.userLoading || this.props.getSettingUserLoading || this.props.settingUserLoading} >
          {this.props.userList?.length > 0 && !this.props.getSettingUserLoading && !this.props.settingUserLoading ? (
            <TreeTransferSingle
              key="key"
              titles={this.props.treeTitle || ['待分配用户', '已分配用户']}
              treeData={this.props.userList}
              fieldNames={{ title: 'userName' }}
              checkedKeys={this.props.checkedKeys}
              targetKeysChange={(key, type, callback) => {
                this.props.targetKeysChange(key, type == 1 ? 1 : 2, callback);
              }}
            />
          ) : (
              <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
        </Spin>
      </Modal>



    );
  }
}

export default DepartIndex;
