/*
页面：行政区选择
add by xpy
modify by
*/
import React, { Component } from 'react';
import { Cascader, Spin } from 'antd';
import { connect } from 'dva';

@connect(({ region, loading }) => ({
  isloading: loading.effects['region/GetRegions'],
  RegionArr: region.RegionArr,
}))
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RegionCode: this.props.RegionCode === null ? '' : this.props.RegionCode,
      DefaultValue: this.props.DefaultValue,
      IsLoadAllRegion: this.props.IsLoadAllRegion,
      SltRegionCode: null,
    };
  }

  componentWillMount() {
    if (this.props.onRef !== undefined) {
      this.props.onRef(this);
    }
    // console.log("--------------------------------------------",this.state.RegionCode);
    this.props.dispatch({
      type: 'region/GetRegions',
      payload: {
        RegionCode: this.state.RegionCode,
        IsLoadAllRegion: this.state.IsLoadAllRegion,
        pointType: this.props.pointType,
      },
    });
  }

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    setTimeout(() => {
      targetOption.loading = false;
      this.props.dispatch({
        type: 'region/GetRegions',
        payload: {
          RegionCode: targetOption.value,
          IsLoadAllRegion: this.state.IsLoadAllRegion,
          pointType: this.props.pointType,
        },
      });
    }, 1000);
  };

  onChange = (value, selectedOptions) => {
    this.props.getRegionCode(value);
    this.setState({
      SltRegionCode: value,
    });
  };

  //置空
  Reset = () => {
    this.setState({
      SltRegionCode: null,
    });
  };

  render() {
    const { width, minWidth, RegionArr, Disabled, changeOnSelect } = this.props;
    const { DefaultValue } = this.state;
    return (
      <div style={{ margin: 0, width: width, minWidth: minWidth }}>
        <Cascader
          options={RegionArr}
          defaultValue={DefaultValue === null ? [] : DefaultValue}
          // loadData={
          //     this.loadData
          // }
          onChange={this.onChange}
          changeOnSelect={changeOnSelect}
          placeholder="请选择"
          disabled={Disabled}
          value={this.state.SltRegionCode}
          {...this.props}
        />
      </div>
    );
  }
}
export default index;
