import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CascadeMultiSelect } from 'uxcore';
import { connect } from 'dva';
import styles from './index.less'

@connect(({ region }) => ({
  enterpriseAndPointList: region.enterpriseAndPointList,
  level: region.level
}))
class EnterprisePointCascadeMultiSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
  }

  componentDidMount() {
    const { searchEnterprise, searchRegion, dispatch } = this.props;
    let type = 1;
    type = searchRegion ? 2 : (searchEnterprise ? 0 : 1);
    dispatch({
      type: 'region/getEnterpriseAndPoint',
      payload: {
        RegionCode: "",
        PointMark: type
      }
    });
  }

  render() {
    let { enterpriseAndPointList, searchEnterprise, level, searchRegion } = this.props;
    const config = [{ showSearch: true, checkable: true }, {}, {}, {}, {}];
    const cascadeSize = searchRegion ? level : (searchEnterprise ? level * 1 + 1 : level * 1 + 2);
    // const cascadeSize = searchEnterprise ? level * 1 + 1 : level * 1 + 2;
    console.log('cascadeSize-', cascadeSize)
    return (
      <div>
        <CascadeMultiSelect
          className={styles['kuma-cascader-wrapper']}
          dropdownClassName={'ucms-drop'}
          config={config}
          cascadeSize={cascadeSize}
          notFoundContent={"沒有数据"}
          options={enterpriseAndPointList}
          // onSelect={(valueList, labelList, leafList) => {
          //   console.log("select=", valueList, labelList, leafList);
          //   this.setState({ demo1: valueList });
          // }}
          onItemClick={(item, level) => {
            if (level === 1 && this.state.currentLevelNode !== item.value) {
              // if (level === 1) {
              this.props.dispatch({
                type: 'region/getEnterpriseAndPoint',
                payload: {
                  RegionCode: item.value,
                  PointMark: searchRegion ? 2 : (searchEnterprise ? 0 : 1)
                }
              });
              this.setState({ currentLevelNode: item.value });
            }
          }}
          onOk={(valueList, labelList, leafList, level) => {
            console.log("ok=", valueList, labelList, leafList, level);
            const values = leafList.map(p => p.value);
            this.props.onChange && this.props.onChange(values);
          }}
          // {...this.props}
        // value={this.state.demo1}
        />
      </div>
    )
  }
}

EnterprisePointCascadeMultiSelect.propTypes = {
  // 是否只查询企业
  searchEnterprise: PropTypes.bool,
  // 是否只查询城市
  searchRegion: PropTypes.bool,
}


EnterprisePointCascadeMultiSelect.delfultProps = {
  searchEnterprise: false,
  searchRegion: false
}

export default EnterprisePointCascadeMultiSelect;