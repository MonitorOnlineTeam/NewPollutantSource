
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Select,} from 'antd';
//行政区列表组件
@connect(({  autoForm }) => ({
    regionList: autoForm.regionList,
}))
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }
  regchildren=()=>{
    const { regionList } = this.props;
    const selectList = [];
    if (regionList.length > 0) {
      regionList[0].children.map(item => {
        selectList.push(
          <Option key={item.key} value={item.value}>
            {item.title}
          </Option>,
        );
      });
      return selectList;
    }
  }
  componentDidMount() {
    this.props.dispatch({  type: 'autoForm/getRegions',  payload: {  RegionCode: '',  PointMark: '2',  }, });  //获取行政区列表
  
   }
  render() {
      const {RegionCode,changeRegion} = this.props
    return (
        <Select
        allowClear
        placeholder="行政区"
        onChange={changeRegion}
        value={RegionCode ? RegionCode : undefined}
        style={{ width: 150 }}
        {...this.props}
      >
        {this.regchildren()}
      </Select>
    );
  }
}
                                                                                             