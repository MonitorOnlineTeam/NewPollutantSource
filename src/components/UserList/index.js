
import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select,Spin,} from 'antd'
//用户列表 组件
@connect(({  common,loading }) => ({
  userList : common.userList,
  userLoading: loading.effects[`common/getUserList`],
}))
export default class Index extends Component {
  static defaultProps = {
  };
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }
  children = () => { //用户列表
    const { userList ,data } = this.props;
    const list = data ? data :userList;
     if (list.length > 0) {
      return list.map(item =><Option key={item.ID} value={item.ID} title={item.userName}>
              {item.userName}
             </Option>
      ); 
  }
  };
  componentDidMount() {
      const {dispatch,userList,} = this.props;
      if(userList.length<=0){
        dispatch({ type: 'common/getUserList', payload: {},  })  
      }


   }
   componentDidUpdate(props) {

  }
  render() {
      const {userLoading,style,} = this.props
    return (<Spin spinning={userLoading} size='small'>
        <Select
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder={'请输入'}
        style={{ width: '100%', ...style }}
        {...this.props}
      >
        {this.children()}
      </Select>
      </Spin>
    );
  }
}
                                                                                             