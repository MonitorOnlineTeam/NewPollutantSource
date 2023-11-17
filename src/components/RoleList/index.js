
import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select,Spin,} from 'antd'
//角色列表 组件
@connect(({  common,loading }) => ({
  roleList : common.roleList,
  roleLoading: loading.effects[`common/getRoleCodeList`],
}))
export default class Index extends Component {
  static defaultProps = {
  };
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }
  children = () => { //角色列表
    const { roleList, } = this.props;
     if (roleList.length > 0) {
      return roleList.map(item =><Option key={item.code} value={item.code} title={item.name}>
              {item.name}
             </Option>
      ); 
  }
  };
  componentDidMount() {
      const {dispatch,roleList,} = this.props;
      if(roleList&&roleList[0]){ return}
        dispatch({ type: 'common/getRoleCodeList', payload: {},  })  
   }
   componentDidUpdate(props) {

  }
  render() {
      const {roleLoading,style,} = this.props
    return (<Spin spinning={roleLoading} size='small'>
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
                                                                                             