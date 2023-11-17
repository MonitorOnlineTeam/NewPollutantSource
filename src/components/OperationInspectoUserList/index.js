
import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select, Spin, } from 'antd'
import { ConsoleSqlOutlined } from '@ant-design/icons';
//运维人员 督查人员  组件
@connect(({ common, loading }) => ({
  operationUserList: common.operationUserList,
  inspectorUserList: common.inspectorUserList,
  inspectorUserLoading: loading.effects[`common/getInspectorUserList`],
}))
export default class Index extends Component {
  static defaultProps = {
    type: "1",
  };
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  children = () => { // 运维人员 督查人员

    const { type, } = this.props;
    const { operationUserList, inspectorUserList, workNum, filterData } = this.props;
    if (operationUserList.length > 0 && type == '1') { //运维人员
        return operationUserList.map(item => <Option key={item.UserId} value={item.UserId} title={item.UserName}>
          {workNum ? `${item.UserName}（${item.UserAccount}）` : `${item.UserName}`}
        </Option>);
    }
    if (inspectorUserList.length > 0 && type == '2') { //督查人员
      const userList = [...inspectorUserList]; 
      if (filterData?.[0]) {  //合同变更设置 
        filterData.map(item => {
          userList.filter((filterItem,index) => {
            if (item.userID == filterItem.UserId) {
              userList.splice(index, 1)
            }
          })
        })
        return userList.map(item => <Option key={item.UserId} value={item.UserId} title={item.UserName}>
          {`${item.UserName}（${item.UserAccount}）`}
        </Option>)
      } else {
      return inspectorUserList.map(item => <Option key={item.UserId} value={item.UserId} title={item.UserName}>
        {item.UserName}
      </Option>);
    }
    }
  };
  componentDidMount() {
    const { dispatch, operationUserList, inspectorUserList, type, noFirst, } = this.props;
    if ((operationUserList && operationUserList[0]) || (inspectorUserList && inspectorUserList[0]) || noFirst) { return }
    dispatch({
      type: 'common/getInspectorUserList',
      payload: {},
    })

  }
  componentDidUpdate(props) {
   }
render() {
  const { style, inspectorUserLoading, } = this.props;
  return (
    <Spin spinning={inspectorUserLoading} size='small'>
      <Select
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder={'请选择'}
        style={{ width: '100%', ...style }}
        {...this.props}
      >
        {this.children()}
      </Select>
    </Spin>
  );
}
}
