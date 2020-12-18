
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Select,TreeSelect} from 'antd';

const { TreeNode } = TreeSelect;
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
    // if (regionList.length > 0) {
    //   regionList[0].children.map(item => {
    //     selectList.push(
    //       <Option key={item.key} value={item.value}>
    //         {item.title}
    //       </Option>,
    //     );
    //   });
    //   return selectList;
    // }

    
   if (regionList.length > 0) {
       regionList.map(item => {
        selectList.push(
          <TreeNode value={item.RegionCode} title={item.RegionName} key={item.RegionCode}>
            {item.children&&item.children[0].RegionName!='市辖区'&&item.children.map(childItem=>{

                return   <TreeNode value={childItem.RegionCode} title={childItem.RegionName}  key={childItem.RegionCode} />
            })}
            </TreeNode>,
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
      //   <Select
      //   allowClear
      //   placeholder="行政区"
      //   onChange={changeRegion}
      //   value={RegionCode ? RegionCode : undefined}
      //   style={{ width: 150 }}
      //   {...this.props}
      // >
      //   {this.regchildren()}
      // </Select>
      <TreeSelect
      showSearch
      allowClear
      searchPlaceholder='输入你想要的字段'
      placeholder="行政区"
      autoExpandParent={false}
      value={RegionCode ? RegionCode : undefined}
      style={{ width: 150 }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeNodeFilterProp='title'
      onChange={changeRegion}
      {...this.props}
    >
       {this.regchildren()}
      </TreeSelect>
    );
  }
}
                                                                                             