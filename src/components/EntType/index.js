
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
       value={PollutantType?PollutantType:undefined}
       style={{ width: 150 }}
       {...this.props}
     >
       <Option value="1">废水</Option>
       <Option value="2">废气</Option>
     </Select>
    );
  }
}
                                                                                             