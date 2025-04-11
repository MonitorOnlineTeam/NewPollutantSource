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

    const { operationCompanyList, } = this.props;
    if (operationCompanyList && operationCompanyList[0]) { //已经请求的数据 不再请求 缓存数据 默认值问题
      this.props.getDefaultOpration && this.props.getDefaultOpration(operationCompanyList[0].id)
      return
    }
    this.props.dispatch({
      type: 'operations/getOperationCompanyList',//获取运维单位列表
      callback: (data) => {
        this.props.getDefaultOpration && this.props.getDefaultOpration(data && data[0] && data[0]['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']) //默认选中第一个
      }
    });

  }


  render() {
    const { operationCompanyLoading, operationCompanyList, style, placeholder, mode, } = this.props;

    return (operationCompanyLoading ?
      <Spin size='small'>
        <Select style={{ width: '100%', ...style }} placeholder={placeholder ? placeholder : '请选择'} />
      </Spin>
      :
      <Select
        allowClear
        showSearch
        optionFilterProp="children"
        style={{ width: '100%', ...style }}
        placeholder={'请选择'}
        {...this.props} 
        >
        {operationCompanyList.map(item => {
          return <Option key={item['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']} value={item['dbo.T_Bas_OperationMaintenanceEnterprise.EnterpriseID']}>{item['dbo.T_Bas_OperationMaintenanceEnterprise.Company']}</Option>
        })
        }
      </Select>

    );
  }
}
export default Index;
