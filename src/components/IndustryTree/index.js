/*
 * @Author: Jiaqi 
 * @Date: 2019-12-09 15:58:41 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2020-10-22 17:09:49
 * @desc: 产业级联组件
 */
import React, { PureComponent } from 'react';
import { Cascader } from "antd";
import { connect } from "dva";
import PropTypes from 'prop-types';


@connect(({ common }) => ({
  industryTreeList: common.industryTreeList,
}))
class IndustryTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      industryTreeList: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.industryTreeList !== state.industryTreeList) {
      return {
        ...state,
        industryTreeList: props.industryTreeList
      }
    }
  }

  componentDidMount() {
    const { configId, valueField, textField } = this.props;
    this.props.dispatch({
      type: "common/getIndustryTree",
      payload: {
        ConfigId: configId,
        ValueField: valueField,
        TextField: textField
      }
    })
  }

  filter = (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  render() {
    const { industryTreeList } = this.state;
    return (
      <Cascader options={industryTreeList} placeholder="请选择产业" showSearch={this.filter} {...this.props} />
    );
  }
}

IndustryTree.propTypes = {
  // options: PropTypes.Array.isRequired,
  configId: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  textField: PropTypes.string.isRequired,
}

export default IndustryTree;