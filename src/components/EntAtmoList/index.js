
import React, { Component } from 'react'
import { connect } from 'dva'
import { Select,Spin } from 'antd'
import styles from './styles.less';


//企业 大气站 列表组件
@connect(({ common }) => ({
  atmoStationList: common.atmoStationList,
  entList: common.entList,
  entLoading: common.entLoading,
  noFilterEntList: common.noFilterEntList,
  noFilterEntLoading: common.noFilterEntLoading,
  enableEntList: common.enableEntList,
  enableEntLoading: common.enableEntLoading,

}))
export default class Index extends Component {
  static defaultProps = {
    type: 1,
    regionCode: ''
  };
  constructor(props) {
    super(props);

    this.state = {
    };

  }
  children = () => { //企业列表 or 大气站列表
    const { entList, atmoStationList, type, noFilter, noFilterEntList, enable, enableEntList } = this.props;

    const selectList = [];

    if (type == 1) {
      if (noFilter) {
        if (noFilterEntList.length > 0) {
          noFilterEntList.map(item => {
            selectList.push(
              <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
                {item.EntName}
              </Option>,
            );
          });
        }
      } else if (enable) {
        if (enableEntList.length > 0) {
          enableEntList.map(item => {
            selectList.push(
              <Option key={item.entID} value={item.entID} title={item.entName}>
                {item.entName}
              </Option>,
            );
          });
        }
      } else {
        if (entList.length > 0) {
          entList.map(item => {
            selectList.push(<Option key={item.EntCode} value={item.EntCode} title={item.EntName}> {item.EntName}</Option>,
            );
          });
        }
      }
    } else {
      if (atmoStationList.length > 0) {
        atmoStationList.map(item => {
          selectList.push(<Option key={item.StationCode} value={item.StationCode} title={item.StationName}> {item.StationName} </Option>,
          );
        });
      }
    }

    return selectList;
  };
  componentDidMount() {
    const { type, dispatch, regionCode, pollutantType, atmoStationList, entList, noFilter, noFilterEntList, enable, enableEntList } = this.props;
    switch (type) {
      case 1: //企业
        if (noFilter) { //不用过滤的企业列表
          if (noFilterEntList && noFilterEntList.length) { return }
          dispatch({ type: 'common/getEntNoFilterList', payload: { RegionCode: regionCode, PollutantType: pollutantType }, })
        } else if (enable) { //启用的企业 不包含停用的企业
          if (enableEntList && enableEntList.length) { return }
          dispatch({ type: 'common/getEnableEntList', payload: { RegionCode: regionCode, PollutantType: pollutantType }, })
        } else {
          if (entList && entList.length) { return }
          dispatch({ type: 'common/getEntByRegion', payload: { RegionCode: regionCode, PollutantType: pollutantType }, })
        }
        break;
      case 2: //空气站
        if (!(atmoStationList && atmoStationList[0] && regionCode)) {
          dispatch({ type: 'defectData/getStationByRegion', payload: { RegionCode: regionCode }, });
        }
        break;
    }

  }
  componentDidUpdate(props) {
    const { type, dispatch, regionCode, pollutantType, noFilter } = this.props;
    if (props.regionCode !== regionCode || props.pollutantType !== pollutantType) {
      type == 1 ? dispatch({ type: noFilter ? 'common/getEntNoFilterList' : 'common/getEntByRegion', payload: { RegionCode: regionCode, PollutantType: pollutantType }, }) : dispatch({ type: 'defectData/getStationByRegion', payload: { RegionCode: regionCode }, });
    }
  }
  loadingStatus = () => {
    const { entLoading, noFilter, noFilterEntLoading, enable, enableEntLoading } = this.props;
    if (noFilter) {
      return noFilterEntLoading
    } else if (enable) {
      return enableEntLoading
    } else {
      return entLoading
    }
  }
  render() {
    const { EntCode, changeEnt, type } = this.props
    return (<Spin spinning={this.loadingStatus()} size='small' wrapperClassName={styles.spinSty}>
      <Select
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder={type == 1 ? "企业列表" : "大气站列表"}
        onChange={changeEnt}
        value={EntCode ? EntCode : undefined}
        style={{ width: '200px' }}
        {...this.props}
      >
        {this.children()}
      </Select>
    </Spin>
    );
  }
}
