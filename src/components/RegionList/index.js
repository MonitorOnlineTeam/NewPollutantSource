
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Select,TreeSelect} from 'antd';

const { TreeNode } = TreeSelect;

// import SdlCascader from '@/pages/AutoFormManager/SdlCascader'

//行政区列表组件
@connect(({  autoForm }) => ({
    regionList: autoForm.regionList,
}))
export default class Index extends Component {
  static defaultProps = { 
    levelNum: 2,
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
        // i > levelNum ? item.disabled = false : item.disabled = true;  //设置父级都为禁用模式
        return <TreeNode key={item.value} value={item.value} title={item.label} key={item.value}>
             {this.regchildren(item.children,i)}
           </TreeNode>
    });
  }
 

    // i++;
//   return data.map(item => {
//     if (item.children&&item.children.length>0) {
//        item.disabled = true;  //设置父级都为禁用模式
//        return (
//         <TreeNode
//           key={item.value}
//           title={item.label}
//           value={item.value}
//           disabled={item.disabled}
//         >
//           {this.regchildren(item.children,i)}
//         </TreeNode>
//       );
//     }
//     return <TreeNode {...item} key={item.key} title={item.label} value={item.value} />;
//   })
}
  

  componentDidMount() {
    
    this.props.paraCode&&this.props.dispatch({  type: 'autoForm/getRegions',  payload: {  PointMark: '2', RegionCode:this.props.paraCode==='all'? '': this.props.paraCode}, });  //获取行政区列表
  
   }
  render() {
      const {selectType,RegionCode,changeRegion,regionList} = this.props
    return (
//       <SdlCascader
//        style={{ width: 170 }}
//        placeholder="请选择行政区"
//        allowClear
//        selectType={selectType}
//        onChange={changeRegion}
// /> 
      <TreeSelect
      virtual={false}
      showSearch
      allowClear
      searchPlaceholder='输入你查找的字段'
      placeholder="行政区"
      autoExpandParent={false}
      value={RegionCode ? RegionCode : undefined}
      style={{ width: 170 }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      treeNodeFilterProp='title'
      onChange={changeRegion}
      {...this.props}
    >
       {this.regchildren(regionList,1)}
      </TreeSelect>
    );
  }
}
                                                                                             