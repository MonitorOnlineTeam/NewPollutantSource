// 运维单位列表组件

import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;
import { connect } from "dva";
@connect(({ operations, loading }) => ({
  operationCompanyList: operations.operationCompanyList,
}))
class Index extends Component {


  componentDidMount() {

    this.props.dispatch({ type: 'operations/getOperationCompanyList', payload: { PointMark: '2', RegionCode: '' }, });  //获取行政区列表

  }


  render() {
    const {style, operationCompanyList,placeholder, } = this.props;

    return (
      <Select style={{ width: '100%', ...style }} placeholder={placeholder ? placeholder : '请选择'}  {...this.props} >
        {operationCompanyList.map(item => {
          return <Option key={item.id} value={item.id}>{item.name}</Option>
        })
        }
      </Select>
    );
  }
}
export default Index;
