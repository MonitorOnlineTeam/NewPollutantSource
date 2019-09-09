import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CascadeMultiSelect } from 'uxcore';
import { isEqual } from 'lodash';
import { connect } from 'dva';
import styles from './index.less'

@connect(({ common }) => ({
  enterpriseAndPointList: common.enterpriseAndPointList,
  level: common.level
}))
class EnterprisePointCascadeMultiSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      value: null
    };
  }

  componentDidMount() {
    const { searchEnterprise, searchRegion, dispatch, rtnValType } = this.props;
    let type = 1;
    type = searchRegion ? 2 : (searchEnterprise ? 0 : 1);
    dispatch({
      type: 'common/getEnterpriseAndPoint',
      payload: {
        RegionCode: "",
        PointMark: type,
        RtnValType: rtnValType
      }
    });
  }



  render() {
    let { enterpriseAndPointList, searchEnterprise, level, searchRegion, placeholder, defaultValue, value } = this.props;
    const config = [{ showSearch: true, checkable: true }, {}, {}, {}, {}];
    const cascadeSize = searchRegion ? level : (searchEnterprise ? level * 1 + 1 : level * 1 + 2);
    // const cascadeSize = searchEnterprise ? level * 1 + 1 : level * 1 + 2;
    const props = value ? { value: value } : {};
    return (
      <div>
        <CascadeMultiSelect
          className={styles['kuma-cascader-wrapper']}
          dropdownClassName={'ucms-drop'}
          config={config}
          placeholder={placeholder}
          cascadeSize={cascadeSize * 1}
          notFoundContent={"沒有数据"}
          options={enterpriseAndPointList}
          // onSelect={(valueList, labelList, leafList) => {
          //   console.log("select=", valueList, labelList, leafList);
          //   this.setState({ value: leafList });
          // }}
          // onItemClick={(item, level) => {
          //   if (level === 1 && this.state.currentLevelNode !== item.value) {
          //     // if (level === 1) {
          //     this.props.dispatch({
          //       type: 'common/getEnterpriseAndPoint',
          //       payload: {
          //         RegionCode: item.value,
          //         PointMark: searchRegion ? 2 : (searchEnterprise ? 0 : 1)
          //       }
          //     });
          //     this.setState({ currentLevelNode: item.value });
          //   }
          // }}
          onOk={(valueList, labelList, leafList, level) => {
            // console.log('leafList=',leafList)
            // console.log('valueList=',valueList)
            // console.log('labelList=',labelList)
            // console.log('level=',level)
            const values = leafList.map(p => p.value);
            this.props.onChange && this.props.onChange(values);
          }}
          {...props}
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
  // placeholder
  placeholder: PropTypes.string,
  // value 回显
  value: PropTypes.array
}


EnterprisePointCascadeMultiSelect.delfultProps = {
  searchEnterprise: false,
  searchRegion: false,
  placeholder: "请选择行政区",
}

export default EnterprisePointCascadeMultiSelect;
