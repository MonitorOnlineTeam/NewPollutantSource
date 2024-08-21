/*
 * @desc: 下拉列表组件
 * @Author: Jiaqi
 * @Date: 2019-05-22 16:38:14
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-21 17:27:26
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Select,
  Spin
} from 'antd'
import { connect } from 'dva';
const Option = Select.Option;

@connect(({ loading, autoForm }) => ({
  configIdList: autoForm.configIdList,
}))
class SearchSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false
    };
    this._SELF_ = {
      defaultPlaceholder: "请选择",
    }
  }

  componentDidMount() {
    const { dispatch, configId, data } = this.props;
    console.log("configId=", configId)
    if (configId) {
      this.setState({loading:true})
      // this.props.loadingChange && this.props.loadingChange(true)
      !data.length && dispatch({
        type: 'autoForm/getConfigIdList',
        payload: {
          configId: configId
        },
        callback:()=>{
          this.setState({loading:false})
          this.props.loadingChange && this.props.loadingChange(false) //loading状态传给父组件
        }
      })
    }
  }
  render() {
    const { configId, configIdList, itemValue, itemName, data } = this.props;
    const dataSource = data.length ? data : (configIdList[configId] || []);
    return (
      this.state.loading? <Spin size='small' spinning={this.state.loading}><Select placeholder='请选择' {...this.props}/></Spin>
    :
      <Select
        allowClear
        showSearch
        placeholder={this._SELF_.defaultPlaceholder}
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...this.props}
      >
        {
          dataSource.map(option => {
            return data.length ?
              <Option key={option.key} value={option.key}>{option.value}</Option> :
              <Option key={option[itemValue]} value={`${option[itemValue]}`}>{option[itemName]}</Option>
          })
        }
      </Select>
    );
  }
}


SearchSelect.propTypes = {
  // placeholder
  placeholder: PropTypes.string,
  // mode
  mode: PropTypes.string,
  // configId
  configId: PropTypes.string.isRequired,
  // itemName
  itemName: PropTypes.string,
  // itemValue
  itemValue: PropTypes.string,
  // data
  data: PropTypes.array,
}


SearchSelect.defaultProps = {
  data: []
}

export default SearchSelect;
