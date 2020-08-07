import React, { Component } from 'react';
import CascadeMultiSelect from 'uxcore/lib/CascadeMultiSelect';
import blue from '../../../node_modules/uxcore/assets/blue.css';
import iconfont from '../../../node_modules/uxcore/assets/iconfont.css';
import sytles from './index.less';
import { connect } from 'dva';
/*
组件：行政区划、企业选择点位组件
add by hsh 19.4.11
*/
@connect(({ region }) => ({
  RegionData: region.RegionList,
}))
export default class EnterprisePointCascadeMultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LablePoint: this.props.LablePoint === undefined ? [] : this.props.LablePoint,
      OneLevelRegionCode:
        this.props.OneLevelRegionCode === undefined ? '' : this.props.OneLevelRegionCode,
    };
  }
  componentWillMount() {
    if (this.props.onRef !== undefined) {
      this.props.onRef(this);
    }
    this.props.dispatch({
      type: 'region/GetXuRegions',
      payload: {
        RegionCode: this.state.OneLevelRegionCode,
        PollutantTypes: this.props.PollutantTypes,
      },
    });
  }

  //置空
  Reset = () => {
    this.setState({
      LablePoint: [],
    });
  };

  render() {
    const config = [
      { checkable: false, showSearch: true },
      { checkable: true },
      { checkable: true },
    ];
    const { width, minWidth, PollutantTypes } = this.props;
    return (
      <div style={{ margin: 0, width: width, minWidth: minWidth }}>
        <CascadeMultiSelect
          config={config}
          className={sytles['kuma-cascader-wrapper']}
          dropdownClassName={'ucms-drop'}
          options={this.props.RegionData}
          cascadeSize={3}
          notFoundContent={'沒有数据'}
          onSelect={(valueList, labelList, leafList) => {
            this.setState({ LablePoint: valueList });
          }}
          onOk={(valueList, labelList, leafList) => {
            const values = leafList.map(p => p.value);
            this.props.updatePointModel(values, valueList, this.state.OneLevelRegionCode);
          }}
          value={this.state.LablePoint}
          size={'small'}
          onItemClick={(item, level) => {
            if (level === 1 && this.state.OneLevelRegionCode !== item.value) {
              this.props.dispatch({
                type: 'region/GetXuRegions',
                payload: {
                  RegionCode: item.value,
                  PollutantTypes: PollutantTypes,
                },
              });
              this.setState({ OneLevelRegionCode: item.value });
            }
          }}
          onCancel={() => {}}
        />
      </div>
    );
  }
}
