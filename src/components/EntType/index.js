/*
 * @Author: outman0611
 * @Date: 2024-06-07 10:56:37
 * @LastEditors: outman0611
 * @LastEditTime: 2024-08-23 15:35:06
 */

import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select} from 'antd'
//企业类型组件

export default class Index extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
    
  }


  componentDidMount() {

  
   }
  render() {
      const {PollutantType,typeChange} = this.props
    return (
      <Select
       allowClear
       placeholder="企业类型"
       onChange={typeChange}
       defaultValue={PollutantType? PollutantType :undefined}
       style={{ width: 150 }}
       {...this.props}
     >
       <Option value={2}>废气</Option>
       <Option value={1}>废水</Option>
     </Select>
    );
  }
}
                                                                                             