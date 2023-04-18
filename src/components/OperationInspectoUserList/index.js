
import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select, Spin, } from 'antd'
//运维人员 督查人员  组件
@connect(({ common, loading }) => ({
  operationUserList:common.operationUserList,
  inspectorUserList:common.inspectorUserList,
  inspectorUserLoading: loading.effects[`common/getInspectorUserList`],
}))
export default class Index extends Component {
  static defaultProps = {
    type:"1",
  };
  constructor(props) {
    super(props);

  }
  children = () => { // 运维人员 督查人员

    const { type, } = this.props;
    const { operationUserList, inspectorUserList } = this.props;
    if (operationUserList.length > 0 && type == '1') { //运维人员
      return operationUserList.map(item => <Option key={item.UserId} value={item.UserId} title={item.UserName}>
         {workNum? `${item.UserName} - ${item.UserAccount}` : `${item.UserName}`}
      </Option>
      );
    }
    if (inspectorUserList.length > 0 && type == '2') { //督查人员
      return inspectorUserList.map(item => <Option key={item.UserId} value={item.UserId} title={item.UserName}>
        {item.UserName}
      </Option>
      );
    }
  };
  componentDidMount() {
    const { dispatch,operationUserList,inspectorUserList,noFirst, } = this.props;
      if(noFirst){ return }
      dispatch({
        type: 'common/getInspectorUserList',
        payload: {},
      })

  }
  componentDidUpdate(props) {

  }
  render() {
    const {style,inspectorUserLoading, } = this.props;
    return (
       <Spin  spinning={inspectorUserLoading} size='small'>
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
