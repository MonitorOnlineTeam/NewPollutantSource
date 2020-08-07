import React, { Component } from 'react';
import { message, TreeSelect, Form, Card, Row, Col } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
const FormItem = Form.Item;
@Form.create()
@connect(({ loading, userinfo }) => ({
  ALLdptList: userinfo.ALLdptList,
}))
class ToLoanModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
      visible: props.visible,
    };
    this.props.onRef(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //获取所有部门
    dispatch({
      type: 'userinfo/GetAllDepartmentTree',
    });
    //根据选中用户获取选中部门id集合
    dispatch({
      type: 'userinfo/GetUserInfoToLoanByUserId',
      payload: {
        User_ID: this.props.User_ID,
        callback: data => {
          if (data) {
            this.setState({
              checkedKeys: data,
            });
          }
        },
      },
    });
  }

  //保存部门信息
  handleOk = () => {
    debugger;
    const { dispatch } = this.props;
    //获取所有部门
    dispatch({
      type: 'userinfo/AddUserInfoToLoan',
      payload: {
        User_ID: this.props.User_ID,
        UserGroup_IDs: this.state.checkedKeys,
        callback: data => {
          if (data.requstresult) {
            message.success(data.reason);
          } else {
            message.error(data.reason);
          }
          this.props.onCancel();
        },
      },
    });
  };
  //树改变事件
  TreeSelectChange = value => {
    let selectValues = [];
    if (value.length) {
      value.map(item => {
        selectValues.push(item.value);
      });
    }
    this.setState({
      checkedKeys: selectValues,
    });
  };
  render() {
    const { dispatch, form, ALLdptList } = this.props;
    const { getFieldDecorator } = form;
    const { checkedKeys } = this.state;
    return (
      <div>
        <Form>
          <Row gutter={48}>
            <Col span={24}>
              <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 17 }} label="借调至">
                {' '}
                {getFieldDecorator('Group_Id', {
                  initialValue: checkedKeys,
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择部门"
                    treeData={ALLdptList}
                    allowClear
                    treeDefaultExpandedKeys={
                      ALLdptList ? (ALLdptList[0] ? [ALLdptList[0].key] : []) : []
                    }
                    treeNodeFilterProp="title"
                    treeCheckable
                    treeCheckStrictly
                    onChange={this.TreeSelectChange}
                  ></TreeSelect>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default ToLoanModel;
