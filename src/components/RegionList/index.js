
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import { connect } from 'dva';
import { Select, TreeSelect, Spin, } from 'antd';
import common from '@/models/common';

const { TreeNode } = TreeSelect;

// import SdlCascader from '@/pages/AutoFormManager/SdlCascader'

//行政区列表组件
@connect(({ autoForm, common, loading, }) => ({
  regionList: autoForm.regionList,
  noFilterRegionList: common.noFilterRegionList,
  regLoading: loading.effects[`autoForm/getRegions`],
  noFilteRegLoading: loading.effects[`common/getNoFilterRegionList`],
  testRegionList: common.testRegionList,
  testRegLoading: loading.effects[`common/getTestXuRegions`],
  ctRegionList: common.ctRegionList,
  ctRegLoading: loading.effects[`common/getCtTestXuRegions`],
}))
export default class Index extends Component {
  static defaultProps = {
    levelNum: 3,
    selectType: '3,是'
  }
  constructor(props) {
    super(props);

    this.state = {
    };

  }

  regchildren = (data, i, parentTitle) => {

    const { levelNum } = this.props;

    if (data && data.length > 0 && i <= levelNum) {
      i++;
      return data.map(item => {
        return <TreeNode key={item.value} value={item.value} title={item.label} parentTitle={parentTitle}>
          {this.regchildren(item.children, i, item.label)}
        </TreeNode>
      });
    }



  }


  componentDidMount() {
    const { regionList, noFilter, noFilterRegionList, test, testRegionList, ct, ctRegionList, } = this.props;
    if (noFilter) {
      if (noFilterRegionList && noFilterRegionList.length <= 0) {
        this.props.dispatch({ type: 'common/getNoFilterRegionList', payload: { PointMark: '2', RegionCode: '' }, });
      }
    } else if (test) { //调试服务行政区列表
      if (testRegionList && testRegionList.length <= 0) {
        this.props.dispatch({ type: 'common/getTestXuRegions', payload: { PointMark: '2', RegionCode: '' }, });
      }
    } else if (ct) { //成套行政区列表
      if (ctRegionList && ctRegionList.length <= 0) {
        this.props.dispatch({ type: 'common/getCtTestXuRegions', payload: { PointMark: '2', RegionCode: '' }, });
      }
    } else {
      //   if(regionList&&regionList.length<=0){ //普通行政区
      //     this.props.dispatch({   type: 'autoForm/getRegions',  payload: {  PointMark: '2', RegionCode: ''} });
      //  }
    }
  }

  //       <SdlCascader
  //        style={{ width: 170 }}
  //        placeholder="请选择行政区"
  //        allowClear
  //        selectType={selectType}
  //        onChange={changeRegion}
  // />
  // spinning={noFilter? noFilteRegLoading : regLoading}
  loadingStatus = () => {
    const {regLoading, noFilter, noFilteRegLoading,test, testRegLoading, ct,ctRegLoading,} = this.props
    if (noFilter) {
      return noFilteRegLoading
    } else if (test) {
      return testRegLoading
    } else if (ct) {
      return ctRegLoading
    } else {
      regLoading
    }
  }
  render() {
    const { selectType, RegionCode, changeRegion, regionList, noFilter, noFilterRegionList, test, testRegionList, ct, ctRegionList, placeholder, spinSty, style } = this.props
    return (this.loadingStatus() ?
      <Spin size='small' style={spinSty}>
        <TreeSelect style={{ width: '100%', ...style }} placeholder={placeholder ? placeholder : '行政区'} />
      </Spin>
      :
      <TreeSelect
        virtual={false}
        showSearch
        allowClear
        placeholder="行政区"
        treeNodeFilterProp='title'
        autoExpandParent={false}
        value={RegionCode ? RegionCode : undefined}
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        onChange={changeRegion}
        {...this.props}
      >
        {this.regchildren(noFilter ? noFilterRegionList : test ? testRegionList : ct ? ctRegionList : regionList, 1)}
      </TreeSelect>
    );
  }
}
