// 运维单位列表组件

import React, { Component } from 'react';
import { Select, Spin, } from 'antd';
import { Form } from '@ant-design/compatible';
import Cookie from 'js-cookie';

const { Option } = Select;
import { connect } from "dva";

@connect(({ operations, loading }) => ({
  operationCompanyList: operations.operationCompanyList,
  operationCompanyLoading: loading.effects['operations/getOperationCompanyList'],

}))

@Form.create()
class Index extends Component {


  componentDidMount() {
    
    const { operationCompanyList,noFirst, } = this.props;
 
    if(noFirst){ return }
    this.props.dispatch({
      type: 'operations/getOperationCompanyList',//获取运维单位列表
      payload: { PointMark: '2', RegionCode: '' },
      callback: (data) => {
        this.props.getDefaultOpration && this.props.getDefaultOpration(data && data[0] && data[0].id) //默认选中第一个
      }
    });

  }


  render() {
    const { operationCompanyLoading, operationCompanyList, style, placeholder, } = this.props;

    return (<Spin spinning={operationCompanyLoading} size='small'>
      <Select 
         allowClear
         showSearch
         style={{ width: '100%', ...style }} placeholder={placeholder ? placeholder : '请选择'}  {...this.props} >
        {operationCompanyList.map(item => {
          return <Option key={item.id} value={item.id}>{item.name}</Option>
        })
        }
      </Select>
    </Spin>

    );
  }
}
export default Index;
