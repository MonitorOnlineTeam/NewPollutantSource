
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Select,} from 'antd';
//关注列表组件
@connect(({  common }) => ({
  attentionList: common.attentionList,
}))
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }
  attentchildren=()=>{
    const { attentionList } = this.props;
    const selectList = [];
    if (attentionList.length > 0) {
       attentionList.map(item => {
        selectList.push(
          <Option key={item.AttentionCode} value={item.AttentionCode}>
            {item.AttentionName}
          </Option>,
        );
      });
      return selectList;
    }
  }
  componentDidMount() {
    this.props.dispatch({  type: 'common/getAttentionDegreeList',  payload: {  RegionCode:'' }, });  //获取关注列表
  
   }
  render() {
      const {AttentionCode,changeAttent} = this.props
    return (
      <Select
      allowClear
      placeholder="关注程度"
      onChange={changeAttent}
      value={AttentionCode? AttentionCode : undefined}
      style={{ width: 150 }}
      {...this.props}
    >
      {this.attentchildren()}
    </Select>
    );
  }
}
                                                                                             