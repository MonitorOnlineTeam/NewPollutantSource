
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Cascader,
  Select
} from 'antd'
import { connect } from 'dva';
const { Option } = Select;
@connect(({ loading, common, autoForm }) => ({
  enterpriseAndPointList: common.enterpriseAndPointList,
  industryTreeList: common.industryTreeList,
  level: common.level,
  regionList: autoForm.regionList,
  noFilterRegionList:common.noFilterRegionList,
  testRegionList:common.noFilterRegionList,
}))
class SdlCascader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      industryTreeList: [],
    };
    this._SELF_ = {
      defaultPlaceholder: "请选择",
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.industryTreeList !== state.industryTreeList) {
  //     return {
  //       ...state,
  //       industryTreeList: props.industryTreeList
  //     }
  //   }
  // }

  componentDidMount() {
    const { dispatch, data, configId, itemValue, itemName,noFilter,regionList,noFilterRegionList,testRegionList, } = this.props;
    // !data.length && dispatch({
    //   type: 'autoForm/getRegions',
    // })
    // !data.length && dispatch({
    //   type: 'common/getEnterpriseAndPoint',
    //   payload: {
    //     RegionCode: "",
    //     PointMark: "2"
    //   }
    // })
      //   !data.length && this.props.dispatch({type: this.props.noFilter?"common/getCascaderNoFilterRegionList" : "common/getEnterpriseAndPoint",
      //   // payload: {
      //   //   ConfigId: configId,
      //   //   ValueField: itemValue,
      //   //   TextField: itemName
      //   // },
      //   payload: { PointMark: '2'},
      //   callback: (res) => {
      //     this.setState({ industryTreeList: this.industryTreeListFormat(res,1) })
      //   }
      // })
    if (itemName === 'dbo.T_Cod_Region.RegionName' || !configId ) {
       if(noFilter){  //不用过滤行政区
          if(noFilterRegionList&&noFilterRegionList[0]){
           this.setState({ industryTreeList: this.industryTreeListFormat(noFilterRegionList, 1) })
          }else{
          this.props.dispatch({
            type: "common/getCascaderNoFilterRegionList",
            payload: { PointMark: '2' },
            callback: (res) => {
              this.setState({ industryTreeList: this.industryTreeListFormat(res, 1) })
            }
          })
         }
       } else{
        if(regionList&&regionList.length<=0){ //普通行政区
          this.props.dispatch({
            type: "autoForm/getRegions",
            payload: { PointMark: '2' },
            callback: (res) => {
              this.setState({ industryTreeList: this.industryTreeListFormat(res, 1) })
            }
          })
        }
        setTimeout(() => { this.setState({ industryTreeList: this.industryTreeListFormat(regionList, 1) }), 300 })
       }
    }else if(itemName === 'dbo.View_TestRegion.RegionName'){ //调试服务
       if(testRegionList&&testRegionList[0]){
        this.setState({ industryTreeList: this.industryTreeListFormat(testRegionList, 1) })
       }else{
        this.props.dispatch({
          type: "common/getCtTestXuRegions",
          payload: { PointMark: '2' },
          callback: (res) => {
            this.setState({ industryTreeList: this.industryTreeListFormat(res, 1) })
          }
        })
      }
    } else {
      !data.length && this.props.dispatch({
        type: "common/getIndustryTree",
        payload: {
          ConfigId: configId,
          ValueField: itemValue,
          TextField: itemName
        },
        callback: (res) => {
          this.setState({ industryTreeList: res })
        }
      })
    }

  }
  componentDidUpdate(props) {
    const { regionList, configId, itemName,noFilter,noFilterRegionList,testRegionList, } = this.props;
    if (props.regionList !== regionList || props.noFilterRegionList !== noFilterRegionList  && (itemName === 'dbo.T_Cod_Region.RegionName' || !configId)) {   //资产管理污染源管理 或 不需要过滤的行政区
     this.setState({ industryTreeList: this.industryTreeListFormat(noFilter? noFilterRegionList : regionList, 1) })
    }
    if(props.testRegionList !== testRegionList  && (itemName === 'dbo.View_TestRegion.RegionName')){ //调试服务 污染源管理
      this.setState({ industryTreeList: this.industryTreeListFormat(this.props.testRegionList, 1) })
    }
  }
  industryTreeListFormat = (data, i) => {
    const { selectType } = this.props;
    let levelNum = selectType && selectType.split(",")[0] || 999;
    if (data && data.length > 0 && i <= levelNum) {
      i++;
      return data.map(item => {
        return {
          label: item.label,
          value: item.value,
          children: item.children && item.children.length > 0 ? this.industryTreeListFormat(item.children, i) : undefined
        }
      })
    }
  }

  render() {
    const { configId, enterpriseAndPointList, data, itemValue, itemName, level, selectType } = this.props;
    const { industryTreeList } = this.state;
    // const options = data.length ? data : enterpriseAndPointList;
    const options = data.length ? data : industryTreeList;
    // const labelArr = itemName.split('.');
    // const valueArr = itemValue.split('.');
    // let label = labelArr.length > 1 ? itemName.split('.').pop().toString() : itemName;
    // let value = valueArr.length > 1 ? itemValue.split('.').pop().toString() : itemValue;
    // if (level == 1) {
    //   return (
    //     <Select
    //       showSearch
    //       {...this.props}
    //     >
    //       {
    //         options.map(item => {
    //           return <Option value={item.value}>{item.label}</Option>
    //         })
    //       }
    //     </Select>
    //   )
    // }
    let onSelect = selectType && selectType.split(",")[1] || '是';
    return (
      <Cascader
        {...this.props}
        fieldNames={{ label: "label", value: "value", children: 'children' }}
        options={options}
        showSearch={(inputValue, path) => {
          return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        }}
        changeOnSelect={onSelect === '是' ? true : false}
      />
    );
  }
}


// SearchSelect.propTypes = {
//   // placeholder
//   placeholder: PropTypes.string,
//   // mode
//   mode: PropTypes.string,
//   // configId
//   configId: PropTypes.string.isRequired,
//   // itemName
//   itemName: PropTypes.string.isRequired,
//   // itemValue
//   itemValue: PropTypes.string.isRequired,
// }

SdlCascader.defaultProps = {
  itemName: "title",
  itemValue: "value",
  data: []
}

export default SdlCascader;