
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Select,TreeSelect,Spin,} from 'antd';
import common from '@/models/common';

const { TreeNode } = TreeSelect;

// import SdlCascader from '@/pages/AutoFormManager/SdlCascader'

//行政区列表组件
@connect(({  autoForm,common,loading, }) => ({
    regionList: autoForm.regionList,
    noFilterRegionList:common.noFilterRegionList,
    regLoading: loading.effects[`autoForm/getRegions`],
    noFilteregLoading: loading.effects[`common/getNoFilterRegionList`],
}))
export default class Index extends Component {
  static defaultProps = { 
    levelNum: 3,
    selectType:'3,是'
  }
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }

  regchildren=(data,i)=>{

    const { levelNum } = this.props;

    if (data&&data.length > 0 && i<= levelNum) {
      i++;
      return data.map(item => {
        return <TreeNode key={item.value} value={item.value} title={item.label}>
             {this.regchildren(item.children,i)}
           </TreeNode>
    });
  }
 


}
  

  componentDidMount() {
    
    // this.props.dispatch({  type: 'autoForm/getRegions',  payload: {  PointMark: '2', RegionCode:''}, });  //获取行政区列表
     if(this.props.noFilter&&this.props.noFilterRegionList.length<=0){
      this.props.dispatch({  type: 'common/getNoFilterRegionList',  payload: {  PointMark: '2', RegionCode:''}, });
     }
   }
  render() {
      const {selectType,RegionCode,changeRegion,regionList,noFilter,noFilterRegionList,noFilteregLoading,regLoading} = this.props
    return (
//       <SdlCascader
//        style={{ width: 170 }}
//        placeholder="请选择行政区"
//        allowClear
//        selectType={selectType}
//        onChange={changeRegion}
// /> 
     <Spin spinning={noFilter? noFilteregLoading : regLoading} size='small'>
      <TreeSelect
      virtual={false}
      showSearch
      allowClear
      searchPlaceholder='输入你查找的字段'
      placeholder="行政区"
      autoExpandParent={false}
      value={RegionCode ? RegionCode : undefined}
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeNodeFilterProp='title'
      onChange={changeRegion}
      {...this.props}
    >
       {this.regchildren(noFilter?noFilterRegionList:regionList,1)}
      </TreeSelect>
      </Spin>
    );
  }
}
                                                                                             