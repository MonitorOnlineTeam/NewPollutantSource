
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Cascader,
  Select
} from 'antd'
import { connect } from 'dva';
const { Option } = Select;

@connect(({ loading, common }) => ({
  enterpriseAndPointList: common.enterpriseAndPointList,
  level: common.level
}))
class SdlCascader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._SELF_ = {
      defaultPlaceholder: "请选择",
    }
  }

  componentDidMount() {
    const { dispatch, data } = this.props;
    // !data.length && dispatch({
    //   type: 'autoForm/getRegions',
    // })
    !data.length && dispatch({
      type: 'common/getEnterpriseAndPoint',
      payload: {
        RegionCode: "",
        PointMark: "2"
      }
    })
  }
  render() {
    const { configId, enterpriseAndPointList, data, itemValue, itemName, level } = this.props;
    const options = data.length ? data : enterpriseAndPointList;
    const labelArr = itemName.split('.');
    const valueArr = itemValue.split('.');
    let label = labelArr.length > 1 ? itemName.split('.').pop().toString() : itemName;
    let value = valueArr.length > 1 ? itemValue.split('.').pop().toString() : itemValue;
    if (level == 1) {
      return (
        <Select
          showSearch
          {...this.props}
        >
          {
            options.map(item => {
              return <Option value={item.value}>{item.label}</Option>
            })
          }
        </Select>
      )
    }
    return (
      <Cascader
        fieldNames={{ label: label, value: value, children: 'children' }}
        options={options}
        changeOnSelect={true}
        {...this.props}
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