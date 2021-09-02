
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Select,} from 'antd';

//运维单位列表组件
@connect(({  global }) => ({
    operationCompanyList: global.operationCompanyList,
}))
export default class Index extends Component {
    static defaultProps = {
      notSelf:false
      };
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }
//运维单位列表
operationCompanyList=()=>{
    const { operationCompanyList } = this.props;
     return operationCompanyList.map(item=>{
     return  <Option title={item.name} key={item.id} value={item.id}>{item.name}</Option>
    })
  }
  componentDidMount() {
    const { dispatch,notSelf } = this.props;
    dispatch({
        type: 'global/getOperationCompanyList',
        payload: notSelf ? { Flag:notSelf} : {} ,  //传了 就是不要自运维的
      }); //获取运维单位列表
  
   }
  render() {
      const {RegionCode,changeRegion} = this.props
    return (
        <Select
        allowClear
        placeholder="请选择运维单位"
        onChange={changeRegion}
        // value={RegionCode ? RegionCode : undefined}
        style={{ width: 200 }}
        {...this.props}
      >
        {this.operationCompanyList()}
      </Select>
    );
  }
}
                                                                                             