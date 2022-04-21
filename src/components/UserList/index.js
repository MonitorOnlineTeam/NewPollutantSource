
import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select,Spin,} from 'antd'
//用户列表 组件
@connect(({  common,loading }) => ({
  userList : common.userList,
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
    const { userList} = this.props;
   
     if (userList.length > 0) {
      return userList.map(item =><Option key={item.ID} value={item.ID} title={item.userName}>
              {item.userName}
             </Option>
      ); 
  }
  };
  componentDidMount() {
      const {dispatch, userList} = this.props;

      userList.length<=0&&dispatch({ type: 'common/getUserList', payload: {},  })   


   }
   componentDidUpdate(props) {

  }
  render() {
      const {userId,changeUser,userLoading,style} = this.props
    return (

        <Select
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder={'请输入'}
        onChange={changeUser}
        value={userId ? userId : undefined}
        style={{width:'200px'}}
        {...this.props}
      >
        {this.children()}
      </Select>
    );
  }
}
                                                                                             